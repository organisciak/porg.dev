import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import posts from '$lib/generated/posts.json';

type FileType = 'md' | 'svx';

interface PostMetadata {
  title?: string;
  date?: string;
  description?: string;
  slug: string;
  fileType: FileType;
}

const rawPosts = import.meta.glob('/src/posts/*.{md,svx}', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

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

const findRawPost = (slug: string) => {
  for (const [filePath, content] of Object.entries(rawPosts)) {
    const match = filePath.match(/\/src\/posts\/(.+)\.(md|svx)$/);
    if (!match) continue;
    const [, fileSlug, extension] = match;
    if (fileSlug === slug) {
      return {
        content,
        fileType: extension as FileType
      };
    }
  }
  return null;
};

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;

  try {
    const postRecord = (posts as PostMetadata[]).find(post => post.slug === slug) ?? null;
    const rawPost = findRawPost(slug);

    if (!rawPost) {
      throw error(404, `Post not found: ${slug}`);
    }

    const { metadata, body } = parseFrontmatter(rawPost.content);
    const cleanBody = stripScriptBlocks(body);

    const finalTitle = metadata.title || postRecord?.title || slug;
    const finalDate = metadata.date || postRecord?.date;
    const finalDescription = metadata.description || postRecord?.description;

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
