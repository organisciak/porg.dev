import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(__dirname, '../src/posts');
const outputFile = path.join(__dirname, '../src/lib/generated/posts.json');

// Ensure the output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generatePostsList() {
  console.log('Generating posts list...');

  // Get all files from the posts directory
  const files = fs.readdirSync(postsDirectory);
  
  // Filter for .md and .svx files
  const postFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.svx'));
  
  // Skip layout and other utility files
  const filteredFiles = postFiles.filter(file => !file.startsWith('_'));
  
  // Get metadata for each post
  const posts = filteredFiles.map(filename => {
    const filePath = path.join(postsDirectory, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) {
      return null;
    }
    
    const frontmatter = frontmatterMatch[1];
    const metadata = {};
    
    // Parse frontmatter
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        let value = valueParts.join(':').trim();
        // Remove quotes if present
        if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        metadata[key.trim()] = value;
      }
    });
    
    // Get slug from filename
    const slug = filename.replace(/\.(md|svx)$/, '');
    const fileType = filename.endsWith('.md') ? 'md' : 'svx';
    
    return {
      ...metadata,
      slug,
      fileType
    };
  }).filter(Boolean);
  
  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Write the sorted posts to the output file
  fs.writeFileSync(outputFile, JSON.stringify(sortedPosts, null, 2));
  
  console.log(`Generated posts list with ${sortedPosts.length} posts`);
}

// Run the function
generatePostsList(); 