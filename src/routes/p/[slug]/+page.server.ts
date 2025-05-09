import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(__dirname, '../../../../src/posts');
const postsJsonPath = path.join(__dirname, '../../../../src/lib/generated/posts.json');

interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  slug: string;
  fileType: 'md' | 'svx';
}

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;
  
  try {
    // First try to get the post info from the JSON file if it exists
    if (fs.existsSync(postsJsonPath)) {
      const postsJson = fs.readFileSync(postsJsonPath, 'utf-8');
      const posts: PostMetadata[] = JSON.parse(postsJson);
      
      const post = posts.find(p => p.slug === slug);
      if (post) {
        return {
          slug,
          postType: post.fileType
        };
      }
    }
    
    // Fall back to checking the file system if JSON doesn't exist or post not found
    let postPath = path.join(postsDirectory, `${slug}.svx`);
    let postType = 'svx';
    
    if (!fs.existsSync(postPath)) {
      postPath = path.join(postsDirectory, `${slug}.md`);
      postType = 'md';
      
      if (!fs.existsSync(postPath)) {
        throw error(404, `Post not found: ${slug}`);
      }
    }
    
    return {
      slug,
      postType
    };
  } catch (err) {
    console.error(`Error loading post ${slug}:`, err);
    throw error(500, 'Could not load blog post');
  }
}; 