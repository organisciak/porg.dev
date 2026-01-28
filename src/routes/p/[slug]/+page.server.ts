import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(__dirname, '../../../../src/posts');
const postsJsonPath = path.join(__dirname, '../../../../src/lib/generated/posts.json');

type FileType = 'md' | 'svx';

interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  image?: string;
  keywords?: string;
  tags?: string;
  modified?: string;
  updated?: string;
  slug: string;
  fileType: FileType;
}

const parseFrontmatter = (content: string): Record<string, string> | null => {
  const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return null;

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

  return metadata;
};

const buildPostMetadata = (metadata: Record<string, string>, slug: string, fileType: FileType): PostMetadata => {
  const keywords = metadata.keywords || metadata.tags;
  const modified = metadata.modified || metadata.updated;

  return {
    title: metadata.title || slug,
    date: metadata.date || new Date().toISOString().split('T')[0],
    description: metadata.description,
    image: metadata.image,
    keywords,
    tags: metadata.tags,
    modified,
    updated: metadata.updated,
    slug,
    fileType
  };
};

export const load: PageServerLoad = async ({ params, url }) => {
  const { slug } = params;
  const canonicalUrl = new URL(url.pathname, url.origin).toString();
  
  try {
    let postMetadata: PostMetadata | null = null;
    let postType: FileType | null = null;

    // First try to get the post info from the JSON file if it exists
    if (fs.existsSync(postsJsonPath)) {
      const postsJson = fs.readFileSync(postsJsonPath, 'utf-8');
      const posts: PostMetadata[] = JSON.parse(postsJson);
      
      const post = posts.find(p => p.slug === slug);
      if (post) {
        postMetadata = post;
        postType = post.fileType;
        return {
          slug,
          postType: post.fileType,
          metadata: postMetadata,
          canonicalUrl
        };
      }
    }
    
    // Fall back to checking the file system if JSON doesn't exist or post not found
    let postPath = path.join(postsDirectory, `${slug}.svx`);
    postType = 'svx';
    
    if (!fs.existsSync(postPath)) {
      postPath = path.join(postsDirectory, `${slug}.md`);
      postType = 'md';
      
      if (!fs.existsSync(postPath)) {
        throw error(404, `Post not found: ${slug}`);
      }
    }

    const content = fs.readFileSync(postPath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    if (frontmatter) {
      postMetadata = buildPostMetadata(frontmatter, slug, postType);
    } else {
      postMetadata = {
        title: slug,
        date: new Date().toISOString().split('T')[0],
        slug,
        fileType: postType
      };
    }

    return {
      slug,
      postType,
      metadata: postMetadata,
      canonicalUrl
    };
  } catch (err) {
    console.error(`Error loading post ${slug}:`, err);
    throw error(500, 'Could not load blog post');
  }
}; 
