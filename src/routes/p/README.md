# Blog with mdsvex

This is a simple blog implementation using mdsvex for SvelteKit, supporting both `.svx` and `.md` files.

## How to add a new blog post

1. Create a new file in the `src/posts` directory with either `.svx` or `.md` extension
2. Add frontmatter at the top of the file:

```
---
title: Your Post Title
date: 'YYYY-MM-DD'
description: 'A brief description of your post'
---
```

3. Write your content using Markdown syntax
4. If using `.svx`, you can include Svelte components and use Svelte features
5. Run `pnpm generate-posts` to update the JSON cache (or wait for build time)

## How Posts Are Loaded

There are two ways the blog posts are loaded:

### Production (Build Time)

During the build process, a script (`scripts/generate-post-list.js`) is automatically run to generate a JSON file with metadata from all blog posts. This JSON file is then used by the blog routes to display posts without having to read all the markdown files at runtime.

### Development (Fallback)

In development, the app will first try to use the JSON file if it exists. If it doesn't find the JSON file, it will fall back to reading the post files directly from the file system.

You can manually regenerate the JSON file at any time by running:

```bash
pnpm generate-posts
```

## File Structure

- `src/posts/` - All blog post content files
- `src/routes/p/` - The blog route
  - `+page.svelte` - Blog index page listing all posts
  - `+page.server.ts` - Server-side logic to load posts
  - `[slug]/` - Dynamic route for individual posts
- `src/lib/generated/posts.json` - Generated metadata for all posts
- `scripts/generate-post-list.js` - Script to generate posts JSON

## Features

- Supports both `.svx` and `.md` files
- Automatic post listing with metadata
- Efficient loading using pre-generated JSON
- Responsive design with Tailwind CSS
- Markdown syntax highlighting
- Ability to use Svelte components in `.svx` files 