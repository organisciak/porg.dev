<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import type { Component } from 'svelte';

  export let data;

  type PostMetadata = {
    title?: string;
    date?: string;
    description?: string;
    image?: string;
    keywords?: string | string[];
    modified?: string;
  };

  let Post: Component | undefined;
  let metadata: PostMetadata = data.metadata ?? {};
  const canonicalUrl: string | undefined = data.canonicalUrl;
  const siteAuthor = 'Peter Organisciak';
  let jsonLd: Record<string, unknown> | null = null;
  let metaTitle = 'Blog Post';
  let metaDescription = '';
  let metaUrl: string | undefined = canonicalUrl;
  let metaImage: string | undefined;
  let twitterCard = 'summary';
  const defaultOgImagePath = '/opengraph/IMG_20230926_120405.png';

  const resolveAbsoluteUrl = (value?: string, baseUrl?: string) => {
    if (!value) return undefined;
    if (!baseUrl) return value;
    try {
      return new URL(value, baseUrl).toString();
    } catch {
      return value;
    }
  };

  const normalizeKeywords = (value: unknown) => {
    if (!value) return undefined;
    if (Array.isArray(value)) {
      const cleaned = value.map(item => String(item).trim()).filter(Boolean);
      return cleaned.length ? cleaned : undefined;
    }
    const asString = String(value).trim();
    if (!asString) return undefined;
    if (asString.includes(',')) {
      const split = asString.split(',').map(item => item.trim()).filter(Boolean);
      return split.length ? split : undefined;
    }
    return asString;
  };

  const buildJsonLd = (meta: PostMetadata, url?: string) => {
    if (!meta?.title || !meta?.date || !url) return null;
    const keywords = normalizeKeywords(meta.keywords);
    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: meta.title,
      description: meta.description || meta.title,
      datePublished: meta.date,
      dateModified: meta.modified || meta.date,
      author: {
        '@type': 'Person',
        name: siteAuthor
      },
      url
    };

    if (meta.image) jsonLd.image = meta.image;
    if (keywords) jsonLd.keywords = keywords;
    return jsonLd;
  };

  $: jsonLd = buildJsonLd(metadata, canonicalUrl);
  $: metaTitle = metadata.title ? String(metadata.title) : 'Blog Post';
  $: metaDescription = metadata.description ? String(metadata.description) : metaTitle;
  $: metaUrl = canonicalUrl;
  $: metaImage = resolveAbsoluteUrl(metadata.image || defaultOgImagePath, canonicalUrl);
  $: twitterCard = metaImage ? 'summary_large_image' : 'summary';

  onMount(async () => {
    try {
      // Dynamically import the blog post based on the slug and type
      if (data.postType === 'svx') {
        const module = await import(`$posts/${data.slug}.svx`);
        Post = module.default;
        metadata = { ...metadata, ...(module.metadata || {}) };
      } else {
        const module = await import(`$posts/${data.slug}.md`);
        Post = module.default;
        metadata = { ...metadata, ...(module.metadata || {}) };
      }
    } catch (e) {
      console.error('Error loading post:', e);
    }
  });
</script>

<svelte:head>
  <title>{metaTitle}</title>
  {#if metaDescription}
    <meta name="description" content={metaDescription} />
  {/if}
  {#if canonicalUrl}
    <link rel="canonical" href={canonicalUrl} />
  {/if}
  <meta property="og:type" content="article" />
  {#if metaTitle}
    <meta property="og:title" content={metaTitle} />
    <meta name="twitter:title" content={metaTitle} />
  {/if}
  {#if metaDescription}
    <meta property="og:description" content={metaDescription} />
    <meta name="twitter:description" content={metaDescription} />
  {/if}
  {#if metaUrl}
    <meta property="og:url" content={metaUrl} />
  {/if}
  {#if metaImage}
    <meta property="og:image" content={metaImage} />
    <meta name="twitter:image" content={metaImage} />
  {/if}
  <meta name="twitter:card" content={twitterCard} />
  {#if jsonLd}
    <script type="application/ld+json">{@html JSON.stringify(jsonLd)}</script>
  {/if}
  <link rel="alternate" type="application/rss+xml" title="porg.dev blog" href="{base}/rss.xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</svelte:head>

<div class="post-page">
  <div class="pixel-accent top"></div>

  <div class="content">
    <nav class="breadcrumb">
      <a href="{base}/p">← All posts</a>
    </nav>

    <article class="post-article">
      <header class="post-header">
        {#if metadata.title}
          <h1>{metadata.title}</h1>
        {/if}
        {#if metadata.date}
          <time datetime={metadata.date}>{metadata.date}</time>
        {/if}
      </header>

      <div class="post-content prose prose-slate max-w-none">
        {#if Post}
          <svelte:component this={Post} />
        {:else}
          <p class="loading">Loading post...</p>
        {/if}
      </div>
    </article>

    <footer class="post-footer">
      <a href="{base}/p" class="back-link">← Back to all posts</a>
    </footer>
  </div>

  <div class="pixel-accent bottom"></div>
</div>

<style>
  .post-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #fafafa 0%, #f0f0f5 100%);
    position: relative;
  }

  .pixel-accent {
    height: 4px;
    background: repeating-linear-gradient(
      90deg,
      #ffcc00 0px,
      #ffcc00 8px,
      #ff6600 8px,
      #ff6600 16px,
      #ff0066 16px,
      #ff0066 24px,
      #cc00ff 24px,
      #cc00ff 32px,
      #00ccff 32px,
      #00ccff 40px
    );
    image-rendering: pixelated;
  }

  .pixel-accent.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .content {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  .breadcrumb {
    margin-bottom: 2rem;
  }

  .breadcrumb a {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.6rem;
    color: #888;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: color 0.2s ease;
  }

  .breadcrumb a:hover {
    color: #cc00ff;
  }

  .post-article {
    background: white;
    border: 2px solid #e0e0e8;
    border-top: 4px solid #cc00ff;
    padding: 2.5rem;
    position: relative;
  }

  .post-article::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: repeating-linear-gradient(
      90deg,
      #cc00ff 0px,
      #cc00ff 4px,
      transparent 4px,
      transparent 8px
    );
    opacity: 0;
  }

  .post-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px dashed #e0e0e8;
  }

  .post-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a3a;
    margin: 0 0 1rem;
    line-height: 1.3;
  }

  .post-header time {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.55rem;
    color: #888;
    letter-spacing: 0.05em;
  }

  .post-content {
    line-height: 1.8;
    color: #333;
  }

  .post-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a3a;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    padding-left: 0.75rem;
    border-left: 3px solid #cc00ff;
  }

  .post-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a3a;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  .post-content :global(a) {
    color: #7c3aed;
    text-decoration: underline;
    text-decoration-color: rgba(124, 58, 237, 0.3);
    text-underline-offset: 2px;
    transition: all 0.2s ease;
  }

  .post-content :global(a:hover) {
    color: #cc00ff;
    text-decoration-color: #cc00ff;
  }

  .post-content :global(code) {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9em;
    background: #f5f5fa;
    padding: 0.15em 0.4em;
    border-radius: 3px;
    border: 1px solid #e0e0e8;
  }

  .post-content :global(pre) {
    background: #1a1a2e;
    border: 2px solid #2a2a4a;
    border-left: 4px solid #ffcc00;
    padding: 1.25rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .post-content :global(pre code) {
    background: none;
    border: none;
    padding: 0;
    color: #e0e0e8;
  }

  .post-content :global(blockquote) {
    border-left: 4px solid #ffcc00;
    background: #fffef8;
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #555;
  }

  .post-content :global(img) {
    max-width: 100%;
    height: auto;
    border: 2px solid #e0e0e8;
    margin: 1.5rem 0;
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    padding-left: 1.5rem;
  }

  .post-content :global(li) {
    margin-bottom: 0.5rem;
  }

  .post-content :global(li::marker) {
    color: #cc00ff;
  }

  .loading {
    text-align: center;
    color: #888;
    font-style: italic;
  }

  .post-footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 2px dashed #e0e0e8;
  }

  .back-link {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.6rem;
    color: #888;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: color 0.2s ease;
  }

  .back-link:hover {
    color: #cc00ff;
  }

  @media (max-width: 640px) {
    .post-article {
      padding: 1.5rem;
    }

    .post-header h1 {
      font-size: 1.5rem;
    }

    .post-content :global(h2) {
      font-size: 1.25rem;
    }

    .post-content :global(h3) {
      font-size: 1.1rem;
    }
  }
</style>
