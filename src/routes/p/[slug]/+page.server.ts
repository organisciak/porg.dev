import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(__dirname, '../../../../src/posts');

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;
  
  // Check if .svx version exists
  let postPath = path.join(postsDirectory, `${slug}.svx`);
  let postType = 'svx';
  
  // If .svx doesn't exist, try .md
  if (!fs.existsSync(postPath)) {
    postPath = path.join(postsDirectory, `${slug}.md`);
    postType = 'md';
    
    // If neither exists, throw 404
    if (!fs.existsSync(postPath)) {
      throw error(404, `Post not found: ${slug}`);
    }
  }
  
  try {
    // We're letting SvelteKit handle the dynamic import of the mdsvex files
    // So we just need to return the slug and type for the +page.svelte component
    return {
      slug,
      postType
    };
  } catch (err) {
    console.error(`Error loading post ${slug}:`, err);
    throw error(500, 'Could not load blog post');
  }
}; 