import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(__dirname, '../../../../src/posts');
const postsJsonPath = path.join(__dirname, '../../../../src/lib/generated/posts.json');

type FileType = 'md' | 'svx';

interface PostMetadata {
  title?: string;
  date?: string;
  description?: string;
  slug: string;
  fileType: FileType;
}

const parseFrontmatter = (content: string) => {
  const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!frontmatterMatch) {
    return {
      metadata: {},
      body: content
    };
  }

  const frontmatter = frontmatterMatch[1];
  const metadata: Record<string, string> = {};

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (!key || !valueParts.length) return;
    let value = valueParts.join(':').trim();
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    metadata[key.trim()] = value;
  });

  const body = content.slice(frontmatterMatch.index! + frontmatterMatch[0].length);
  return {
    metadata,
    body
  };
};

const stripScriptBlocks = (content: string) => {
  return content.replace(/<script[\s\S]*?<\/script>\s*/g, '').trim();
};

const buildMarkdown = (meta: { title: string; date?: string; description?: string }, body: string) => {
  const parts = [`# ${meta.title}`];
  if (meta.date) {
    parts.push('', `_Date: ${meta.date}_`);
  }
  if (meta.description) {
    parts.push('', meta.description);
  }
  parts.push('', '---', '', body.trim());
  return parts.join('\n');
};

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;

  try {
    let postType: FileType = 'svx';
    let metadataFromJson: PostMetadata | null = null;

    if (fs.existsSync(postsJsonPath)) {
      const postsJson = fs.readFileSync(postsJsonPath, 'utf-8');
      const posts: PostMetadata[] = JSON.parse(postsJson);
      const post = posts.find(p => p.slug === slug);
      if (post) {
        postType = post.fileType;
        metadataFromJson = post;
      }
    }

    let postPath = path.join(postsDirectory, `${slug}.${postType}`);
    if (!fs.existsSync(postPath)) {
      const fallbackType: FileType = postType === 'svx' ? 'md' : 'svx';
      postPath = path.join(postsDirectory, `${slug}.${fallbackType}`);
      postType = fallbackType;
    }

    if (!fs.existsSync(postPath)) {
      throw error(404, `Post not found: ${slug}`);
    }

    const content = fs.readFileSync(postPath, 'utf-8');
    const { metadata, body } = parseFrontmatter(content);
    const cleanBody = stripScriptBlocks(body);

    const finalTitle = metadata.title || metadataFromJson?.title || slug;
    const finalDate = metadata.date || metadataFromJson?.date;
    const finalDescription = metadata.description || metadataFromJson?.description;

    const markdown = buildMarkdown(
      {
        title: finalTitle,
        date: finalDate,
        description: finalDescription
      },
      cleanBody
    );

    return new Response(markdown, {
      headers: {
        'content-type': 'text/markdown; charset=utf-8'
      }
    });
  } catch (err) {
    console.error(`Error building markdown mirror for ${slug}:`, err);
    throw error(500, 'Could not build markdown mirror');
  }
};
