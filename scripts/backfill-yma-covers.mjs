#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE_FILE = 'src/posts/2026-youth-media-awards.svx';
const OUTPUT_DIR = 'static/book-covers/2026-youth-media-awards';
const COVER_PATTERN = /"cover":\s*"([^"]+)"/g;
const VOLUMES_API = 'https://www.googleapis.com/books/v1/volumes/';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizePart(value) {
  return (
    value
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'cover'
  );
}

function shortHash(value) {
  return crypto.createHash('sha1').update(value).digest('hex').slice(0, 8);
}

function filenameForUrl(url, usedFilenames) {
  const parsed = new URL(url);
  let base = '';

  if (parsed.hostname.includes('books.google') && parsed.pathname.includes('/books/content')) {
    const id = parsed.searchParams.get('id');
    if (id) {
      base = sanitizePart(id);
    }
  }

  if (!base && url.startsWith('/book-covers/2026-youth-media-awards/')) {
    return path.basename(url);
  }

  if (!base) {
    const rawBasename = path.basename(parsed.pathname);
    const withoutExt = rawBasename ? rawBasename.replace(/\.[^.]+$/, '') : '';
    if (withoutExt) {
      base = sanitizePart(withoutExt);
    }
  }

  if (!base) {
    base = `cover-${shortHash(url)}`;
  }

  let filename = `${base}.jpg`;
  if (usedFilenames.has(filename) && usedFilenames.get(filename) !== url) {
    filename = `${base}-${shortHash(url)}.jpg`;
  }

  usedFilenames.set(filename, url);
  return filename;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`JSON fetch failed (${response.status}) for ${url}`);
  }
  return response.json();
}

async function fetchImage(url, destinationPath) {
  const response = await fetch(url, {
    headers: {
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    },
    redirect: 'follow'
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Unexpected content-type ${contentType || 'none'}`);
  }

  const body = Buffer.from(await response.arrayBuffer());
  if (body.length < 1000) {
    throw new Error(`Image too small (${body.length} bytes)`);
  }

  await fs.writeFile(destinationPath, body);
  return { bytes: body.length, contentType };
}

function extractGoogleVolumeId(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('books.google')) {
      return null;
    }
    return parsed.searchParams.get('id');
  } catch {
    return null;
  }
}

function isbnCandidatesFromVolume(volume) {
  const ids = volume?.volumeInfo?.industryIdentifiers ?? [];
  const output = [];

  for (const entry of ids) {
    if (!entry?.identifier) continue;
    const cleaned = entry.identifier.replace(/[^0-9Xx]/g, '');
    if (cleaned.length >= 10) {
      output.push(cleaned);
    }
  }

  return [...new Set(output)];
}

function openLibraryCoverUrlsFromIsbn(isbn) {
  return [
    `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
    `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`
  ];
}

function isbnDbCoverUrls(isbn) {
  return [
    `https://images.isbndb.com/covers/${isbn}.jpg`,
    `https://images.isbndb.com/covers/${isbn}.png`
  ];
}

function normalizeGoogleImageHost(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('books.google')) {
      return url;
    }
    parsed.protocol = 'https:';
    parsed.hostname = 'books.googleusercontent.com';
    return parsed.toString();
  } catch {
    return url;
  }
}

async function findOpenLibraryByTitleAuthor(title, author) {
  const q = new URLSearchParams({
    title,
    author,
    limit: '5'
  });
  const data = await fetchJson(`https://openlibrary.org/search.json?${q.toString()}`);
  const docs = data?.docs ?? [];
  for (const doc of docs) {
    if (doc?.cover_i) {
      return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg?default=false`;
    }
  }
  return null;
}

async function fetchVolumeInfo(volumeId) {
  return fetchJson(`${VOLUMES_API}${encodeURIComponent(volumeId)}`);
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const source = await fs.readFile(SOURCE_FILE, 'utf8');
  const coverUrls = [...source.matchAll(COVER_PATTERN)].map((match) => match[1]);
  const uniqueCoverUrls = [...new Set(coverUrls)];

  const usedFilenames = new Map();
  const entries = uniqueCoverUrls.map((url) => {
    const filename = url.startsWith('/book-covers/2026-youth-media-awards/')
      ? path.basename(url)
      : filenameForUrl(url, usedFilenames);

    return {
      originalUrl: url,
      filename,
      localPath: path.join(OUTPUT_DIR, filename),
      sourceTried: [],
      sourceUsed: null,
      status: 'pending',
      error: null
    };
  });

  console.log(`Backfilling ${entries.length} unique covers...`);

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    process.stdout.write(`[${i + 1}/${entries.length}] ${entry.filename} ... `);

    if (await fileExists(entry.localPath)) {
      entry.status = 'exists';
      console.log('exists');
      continue;
    }

    const candidateUrls = [];

    if (entry.originalUrl.startsWith('http')) {
      candidateUrls.push(entry.originalUrl);
    }

    const volumeId = extractGoogleVolumeId(entry.originalUrl);
    let volume = null;
    if (volumeId) {
      try {
        volume = await fetchVolumeInfo(volumeId);
      } catch (error) {
        // continue with any direct URL candidates if metadata fails
      }
    }

    if (volume?.volumeInfo?.imageLinks) {
      const links = Object.values(volume.volumeInfo.imageLinks).filter(Boolean);
      for (const link of links) {
        candidateUrls.push(link);
        candidateUrls.push(normalizeGoogleImageHost(link));
      }
    }

    if (volume) {
      const isbns = isbnCandidatesFromVolume(volume);
      for (const isbn of isbns) {
        candidateUrls.push(...openLibraryCoverUrlsFromIsbn(isbn));
        candidateUrls.push(...isbnDbCoverUrls(isbn));
      }

      const title = volume?.volumeInfo?.title;
      const author = volume?.volumeInfo?.authors?.[0] ?? '';
      if (title) {
        try {
          const olBySearch = await findOpenLibraryByTitleAuthor(title, author);
          if (olBySearch) {
            candidateUrls.push(olBySearch);
          }
        } catch {
          // ignore search fallback errors
        }
      }
    }

    const uniqueCandidates = [...new Set(candidateUrls.filter(Boolean))];
    let succeeded = false;

    for (const candidate of uniqueCandidates) {
      entry.sourceTried.push(candidate);
      try {
        await fetchImage(candidate, entry.localPath);
        entry.status = 'downloaded';
        entry.sourceUsed = candidate;
        succeeded = true;
        break;
      } catch (error) {
        entry.error = error instanceof Error ? error.message : String(error);
        await sleep(100);
      }
    }

    if (succeeded) {
      console.log('downloaded');
    } else {
      entry.status = 'failed';
      console.log(`failed (${entry.error})`);
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    sourceFile: SOURCE_FILE,
    outputDir: OUTPUT_DIR,
    uniqueCovers: entries.length,
    exists: entries.filter((e) => e.status === 'exists').length,
    downloaded: entries.filter((e) => e.status === 'downloaded').length,
    failed: entries.filter((e) => e.status === 'failed').length,
    entries
  };

  const summaryPath = path.join(OUTPUT_DIR, 'backfill-manifest.json');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${summaryPath}`);

  if (summary.failed > 0) {
    console.error(`Failed to resolve ${summary.failed} covers.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
