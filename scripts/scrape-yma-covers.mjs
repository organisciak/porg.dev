#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE_FILE = 'src/posts/2026-youth-media-awards.svx';
const OUTPUT_DIR = 'static/book-covers/2026-youth-media-awards';
const PUBLIC_PREFIX = '/book-covers/2026-youth-media-awards';
const MANIFEST_FILE = path.join(OUTPUT_DIR, 'manifest.json');
const COVER_PATTERN = /"cover":\s*"([^"]+)"/g;

const REQUEST_HEADERS = {
  'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};

class RetryableError extends Error {}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shortHash(value) {
  return crypto.createHash('sha1').update(value).digest('hex').slice(0, 8);
}

function sanitizePart(value) {
  return (
    value
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'cover'
  );
}

function filenameForUrl(url, usedFilenames) {
  const parsed = new URL(url);
  let base = '';

  if (parsed.hostname === 'books.google.com' && parsed.pathname === '/books/content') {
    const id = parsed.searchParams.get('id');
    if (id) {
      base = sanitizePart(id);
    }
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

function shouldRetry(error) {
  return error instanceof RetryableError;
}

async function downloadImage(url, destinationPath) {
  const maxAttempts = 6;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const headers = { ...REQUEST_HEADERS };
      if (url.includes('books.google.com/books/content')) {
        headers.referer = 'https://books.google.com/';
      }

      const response = await fetch(url, {
        headers,
        redirect: 'follow'
      });

      if ([429, 500, 502, 503, 504].includes(response.status)) {
        throw new RetryableError(`HTTP ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.startsWith('image/')) {
        throw new Error(`Unexpected content-type "${contentType || 'none'}"`);
      }

      const body = Buffer.from(await response.arrayBuffer());
      if (body.length < 256) {
        throw new RetryableError(`Response too small (${body.length} bytes)`);
      }

      await fs.writeFile(destinationPath, body);
      return;
    } catch (error) {
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      const delayMs = 300 * attempt;
      await sleep(delayMs);
    }
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const source = await fs.readFile(SOURCE_FILE, 'utf8');
  const coverUrls = [...source.matchAll(COVER_PATTERN)].map((match) => match[1]);
  const uniqueUrls = [...new Set(coverUrls)];

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const usedFilenames = new Map();
  const urlToLocalPath = new Map();
  const failures = [];

  console.log(`Found ${coverUrls.length} cover references (${uniqueUrls.length} unique URLs).`);

  for (let i = 0; i < uniqueUrls.length; i += 1) {
    const url = uniqueUrls[i];
    const filename = filenameForUrl(url, usedFilenames);
    const outputPath = path.join(OUTPUT_DIR, filename);
    const localPath = `${PUBLIC_PREFIX}/${filename}`;

    process.stdout.write(`[${i + 1}/${uniqueUrls.length}] ${filename} ... `);

    try {
      if (!(await fileExists(outputPath))) {
        await downloadImage(url, outputPath);
      }

      urlToLocalPath.set(url, localPath);
      console.log('ok');
    } catch (error) {
      failures.push({
        url,
        error: error instanceof Error ? error.message : String(error)
      });
      console.log(`failed (${failures.at(-1)?.error})`);
    }

    await sleep(150);
  }

  let updatedSource = source;
  for (const [url, localPath] of urlToLocalPath) {
    updatedSource = updatedSource.split(url).join(localPath);
  }

  if (updatedSource !== source) {
    await fs.writeFile(SOURCE_FILE, updatedSource, 'utf8');
    console.log(`Updated ${SOURCE_FILE} to use local cover paths.`);
  } else {
    console.log(`No URL replacements needed in ${SOURCE_FILE}.`);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceFile: SOURCE_FILE,
    outputDir: OUTPUT_DIR,
    totalReferences: coverUrls.length,
    uniqueUrls: uniqueUrls.length,
    downloadedOrReused: urlToLocalPath.size,
    failures
  };
  await fs.writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Wrote manifest: ${MANIFEST_FILE}`);

  if (failures.length > 0) {
    console.error(`Failed to fetch ${failures.length} images. See manifest for details.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
