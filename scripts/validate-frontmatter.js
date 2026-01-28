import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(__dirname, '../src/posts');

// Schema definition
const REQUIRED_FIELDS = ['title', 'date', 'description'];
const OPTIONAL_FIELDS = ['image', 'tags', 'keywords', 'modified', 'updated'];

// Validation helpers
const isValidDateString = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

const isValidUrl = (value) => {
  if (!value) return true; // Optional, so empty is valid
  try {
    new URL(value);
    return true;
  } catch {
    // Allow relative paths starting with /
    return value.startsWith('/');
  }
};

const isValidTags = (value) => {
  if (!value) return true; // Optional
  // Tags can be a comma-separated string or already parsed as array-like
  if (typeof value === 'string') return true;
  if (Array.isArray(value)) return value.every(t => typeof t === 'string');
  return false;
};

function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    return null;
  }

  const frontmatter = frontmatterMatch[1];
  const metadata = {};

  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }

    if (key) {
      metadata[key] = value;
    }
  });

  return metadata;
}

function validatePost(filename, metadata) {
  const errors = [];
  const warnings = [];
  const slug = filename.replace(/\.(md|svx)$/, '');

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!metadata[field] || metadata[field].trim() === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate date format
  if (metadata.date && !isValidDateString(metadata.date)) {
    errors.push(`Invalid date format: "${metadata.date}" (expected: YYYY-MM-DD)`);
  }

  // Validate modified/updated date if present
  const modifiedField = metadata.modified || metadata.updated;
  if (modifiedField && !isValidDateString(modifiedField)) {
    errors.push(`Invalid modified/updated date: "${modifiedField}"`);
  }

  // Validate image URL if present
  if (metadata.image && !isValidUrl(metadata.image)) {
    errors.push(`Invalid image URL: "${metadata.image}"`);
  }

  // Validate tags/keywords if present
  const tagsField = metadata.tags || metadata.keywords;
  if (tagsField && !isValidTags(tagsField)) {
    warnings.push(`Tags should be a string or array: "${tagsField}"`);
  }

  // Warnings for recommended fields
  if (!metadata.description || metadata.description.length < 10) {
    warnings.push('Description is very short (recommended: 50-160 chars for SEO)');
  } else if (metadata.description.length > 160) {
    warnings.push(`Description is long (${metadata.description.length} chars, recommended: 50-160 for SEO)`);
  }

  return { slug, errors, warnings };
}

function validateAllPosts() {
  console.log('Validating post frontmatter...\n');

  const files = fs.readdirSync(postsDirectory);
  const postFiles = files
    .filter(file => file.endsWith('.md') || file.endsWith('.svx'))
    .filter(file => !file.startsWith('_'));

  let hasErrors = false;
  let totalWarnings = 0;

  for (const filename of postFiles) {
    const filePath = path.join(postsDirectory, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const metadata = parseFrontmatter(content);

    if (!metadata) {
      console.log(`❌ ${filename}: No frontmatter found`);
      hasErrors = true;
      continue;
    }

    const { slug, errors, warnings } = validatePost(filename, metadata);

    if (errors.length > 0 || warnings.length > 0) {
      console.log(`📄 ${filename} (/${slug})`);

      for (const error of errors) {
        console.log(`   ❌ ${error}`);
        hasErrors = true;
      }

      for (const warning of warnings) {
        console.log(`   ⚠️  ${warning}`);
        totalWarnings++;
      }

      console.log('');
    } else {
      console.log(`✅ ${filename}`);
    }
  }

  console.log('\n---');
  console.log(`Validated ${postFiles.length} posts`);

  if (hasErrors) {
    console.log('❌ Validation failed with errors');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log(`✅ Validation passed with ${totalWarnings} warning(s)`);
  } else {
    console.log('✅ All posts valid');
  }
}

validateAllPosts();
