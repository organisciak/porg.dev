import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(__dirname, '../../../src/posts');

interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  slug: string;
}

export const load: PageServerLoad = async () => {
  try {
    // Get all files from the posts directory
    const files = fs.readdirSync(postsDirectory);
    
    // Filter for .md and .svx files
    const postFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.svx'));
    
    // Get metadata for each post
    const posts = postFiles.map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract frontmatter
      const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatterMatch) {
        return null;
      }
      
      const frontmatter = frontmatterMatch[1];
      const metadata: Partial<PostMetadata> = {};
      
      // Parse frontmatter
      frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          let value = valueParts.join(':').trim();
          // Remove quotes if present
          if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          metadata[key.trim() as keyof PostMetadata] = value;
        }
      });
      
      // Get slug from filename
      const slug = filename.replace(/\.(md|svx)$/, '');
      
      return {
        ...metadata,
        slug
      } as PostMetadata;
    }).filter(Boolean);
    
    // Sort posts by date (newest first)
    const sortedPosts = posts.sort((a, b) => {
      return new Date(b!.date).getTime() - new Date(a!.date).getTime();
    });
    
    return {
      posts: sortedPosts
    };
  } catch (err) {
    console.error('Error loading posts:', err);
    throw error(500, 'Could not load blog posts');
  }
}; 