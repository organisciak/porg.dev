import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsJsonPath = path.join(__dirname, '../../../src/lib/generated/posts.json');

type FileType = 'md' | 'svx';

interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  slug: string;
  fileType: FileType;
}

export const load: PageServerLoad = async () => {
  try {
    // Check if the generated JSON file exists, if not generate it on demand
    let posts: PostMetadata[] = [];
    
    if (fs.existsSync(postsJsonPath)) {
      // Use the pre-generated JSON file
      const postsJson = fs.readFileSync(postsJsonPath, 'utf-8');
      posts = JSON.parse(postsJson);
    } else {
      // For development: if the JSON doesn't exist, log a warning
      console.warn('Posts JSON file not found. Run "pnpm generate-posts" to create it.');
      
      // Fallback to the original directory reading logic
      const postsDirectory = path.join(__dirname, '../../../src/posts');
      const files = fs.readdirSync(postsDirectory);
      const postFiles = files.filter(file => (file.endsWith('.md') || file.endsWith('.svx')) && !file.startsWith('_'));
      
      const tempPosts = postFiles.map(filename => {
        const filePath = path.join(postsDirectory, filename);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
        if (!frontmatterMatch) return null;
        
        const frontmatter = frontmatterMatch[1];
        const metadata: Record<string, string> = {}; // Use a simple record instead
        
        frontmatter.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length) {
            let value = valueParts.join(':').trim();
            if (value.startsWith("'") && value.endsWith("'")) {
              value = value.slice(1, -1);
            }
            metadata[key.trim()] = value;
          }
        });
        
        const slug = filename.replace(/\.(md|svx)$/, '');
        const fileType: FileType = filename.endsWith('.md') ? 'md' : 'svx';
        
        // Create a properly typed PostMetadata object
        const postData: PostMetadata = {
          title: metadata.title || filename, // Default to filename if no title
          date: metadata.date || new Date().toISOString().split('T')[0],
          description: metadata.description,
          slug,
          fileType
        };
        
        return postData;
      });
      
      // Filter out nulls
      posts = tempPosts.filter((post): post is PostMetadata => post !== null);
      
      // Sort posts by date (newest first)
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return { posts };
  } catch (err) {
    console.error('Error loading posts:', err);
    throw error(500, 'Could not load blog posts');
  }
}; 