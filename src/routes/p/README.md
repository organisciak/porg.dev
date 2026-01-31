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
image: '/opengraph/your-image.png' # optional
keywords: 'ai, creativity, evaluation' # optional (or tags)
tags: 'ai, creativity, evaluation' # optional (or keywords)
modified: 'YYYY-MM-DD' # optional (or updated)
updated: 'YYYY-MM-DD' # optional (or modified)
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
  - `[slug].md/` - Markdown mirror endpoint for LLMs and tooling
- `src/lib/generated/posts.json` - Generated metadata for all posts
- `scripts/generate-post-list.js` - Script to generate posts JSON

## Metadata Outputs

- `/rss.xml` - RSS 2.0 feed built from `posts.json` (includes Atom self-link)
- `/llms.txt` - LLM-friendly index with key links and recent posts
- `/p/<slug>` - Full post page with SEO meta tags + Schema.org BlogPosting JSON-LD
- `/p/<slug>.md` - Markdown mirror of the post content
  - Missing `image` falls back to the default OG image.
  - Missing `modified/updated` falls back to `date`.

## Validation & Tests

- `pnpm run validate-posts` - Validates frontmatter fields and formats.
- Playwright coverage:
  - `tests/post-meta.spec.js` (canonical + OG/Twitter)
  - `tests/post-schema.spec.js` (JSON-LD)
  - `tests/post-markdown.spec.js` (markdown mirror)
  - `tests/rss.spec.js` (RSS feed contents)
  - `tests/llms.spec.js` (llms.txt contents)

## Features

- Supports both `.svx` and `.md` files
- Automatic post listing with metadata
- Efficient loading using pre-generated JSON
- Responsive design with Tailwind CSS
- Markdown syntax highlighting
- Ability to use Svelte components in `.svx` files
- SEO meta tags + JSON-LD for posts
- RSS + llms.txt metadata surfaces
