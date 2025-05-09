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

## File Structure

- `src/posts/` - All blog post content files
- `src/routes/p/` - The blog route
  - `+page.svelte` - Blog index page listing all posts
  - `+page.server.ts` - Server-side logic to load posts
  - `[slug]/` - Dynamic route for individual posts
- `src/lib/components/PostLayout.svelte` - The layout for blog posts

## Features

- Supports both `.svx` and `.md` files
- Automatic post listing with metadata
- Responsive design with Tailwind CSS
- Markdown syntax highlighting
- Ability to use Svelte components in `.svx` files 