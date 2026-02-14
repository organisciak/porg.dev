<script lang="ts">
  import { base } from "$app/paths";
  import type { Component } from "svelte";

  export let data;

  type PostMetadata = {
    title?: string;
    date?: string;
    description?: string;
    image?: string;
    keywords?: string | string[];
    tags?: string | string[];
    modified?: string;
    updated?: string;
  };

  let Post: Component | undefined = data.PostComponent ?? undefined;
  let metadata: PostMetadata = { ...(data.metadata ?? {}), ...(data.postMetadata ?? {}) };
  const canonicalUrl: string | undefined = data.canonicalUrl;
  const siteAuthor = "Peter Organisciak";
  let jsonLd: Record<string, unknown> | null = null;
  let metaTitle = "Post";
  let metaDescription = "";
  let metaUrl: string | undefined = canonicalUrl;
  let metaImage: string | undefined;
  let twitterCard = "summary";
  const defaultOgImagePath = "/opengraph/IMG_20230926_120405.png";

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
      const cleaned = value.map((item) => String(item).trim()).filter(Boolean);
      return cleaned.length ? cleaned : undefined;
    }
    const asString = String(value).trim();
    if (!asString) return undefined;
    if (asString.includes(",")) {
      const split = asString
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      return split.length ? split : undefined;
    }
    return asString;
  };

  const buildJsonLd = (meta: PostMetadata, url?: string, image?: string) => {
    if (!meta?.title || !meta?.date || !url) return null;
    const keywords = normalizeKeywords(meta.keywords ?? meta.tags);
    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: meta.title,
      description: meta.description || meta.title,
      datePublished: meta.date,
      dateModified: meta.modified || meta.updated || meta.date,
      author: {
        "@type": "Person",
        name: siteAuthor,
      },
      url,
    };

    if (image) jsonLd.image = image;
    if (keywords) jsonLd.keywords = keywords;
    return jsonLd;
  };

  $: metaTitle = metadata.title ? String(metadata.title) : "Post";
  $: metaDescription = metadata.description ? String(metadata.description) : metaTitle;
  $: metaUrl = canonicalUrl;
  $: metaImage = resolveAbsoluteUrl(metadata.image || defaultOgImagePath, canonicalUrl);
  $: twitterCard = metaImage ? "summary_large_image" : "summary";
  $: jsonLd = buildJsonLd(metadata, canonicalUrl, metaImage);
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
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
  {/if}
  <link rel="alternate" type="application/rss+xml" title="porg.dev posts" href="{base}/rss.xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Press+Start+2P&family=Space+Grotesk:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
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
    --ink: #15152b;
    --muted-ink: #5b5b70;
    --paper: #fffdf8;
    --paper-shadow: rgba(21, 21, 43, 0.12);
    --accent-warm: #ff9f1c;
    --accent-cool: #00b4d8;
    --accent-ink: #7c3aed;
    color: var(--ink);
    background:
      radial-gradient(circle at 12% 12%, rgba(255, 159, 28, 0.12), transparent 45%),
      radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.12), transparent 45%),
      linear-gradient(180deg, #fbf7f1 0%, #f1f1f7 100%);
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
    font-family: "Space Grotesk", system-ui, sans-serif;
  }

  .breadcrumb {
    margin-bottom: 2rem;
  }

  .breadcrumb a {
    font-family: "Press Start 2P", monospace;
    font-size: 0.6rem;
    color: #6f6f7f;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: color 0.2s ease;
  }

  .breadcrumb a:hover {
    color: var(--accent-ink);
  }

  .post-article {
    background: linear-gradient(135deg, #ffffff 0%, #fff6ef 100%);
    border: 2px solid #e6dfd5;
    border-radius: 14px;
    padding: 2.75rem;
    position: relative;
    box-shadow: 8px 8px 0 var(--paper-shadow);
    animation: article-rise 0.6s ease both;
  }

  .post-article::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: repeating-linear-gradient(
      90deg,
      var(--accent-warm) 0px,
      var(--accent-warm) 18px,
      var(--accent-ink) 18px,
      var(--accent-ink) 36px,
      var(--accent-cool) 36px,
      var(--accent-cool) 54px
    );
    opacity: 0.7;
  }

  .post-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px dashed #e6dfd5;
  }

  .post-header h1 {
    font-family: "Fraunces", serif;
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--ink);
    margin: 0 0 0.9rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 0 rgba(255, 159, 28, 0.3);
  }

  .post-header time {
    font-family: "Press Start 2P", monospace;
    font-size: 0.55rem;
    color: #6f6f7f;
    letter-spacing: 0.05em;
    display: inline-block;
    padding: 0.3rem 0.5rem;
    border-radius: 999px;
    background: rgba(255, 159, 28, 0.16);
  }

  .post-content {
    line-height: 1.8;
    color: var(--ink);
    font-size: 1.05rem;
  }

  .post-content :global(h2) {
    font-family: "Fraunces", serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--ink);
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    padding-left: 0.75rem;
    border-left: 3px solid var(--accent-ink);
  }

  .post-content :global(h3) {
    font-family: "Fraunces", serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--ink);
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  .post-content :global(a) {
    color: var(--accent-ink);
    text-decoration: underline;
    text-decoration-color: rgba(124, 58, 237, 0.35);
    text-underline-offset: 2px;
    transition: all 0.2s ease;
  }

  .post-content :global(a:hover) {
    color: #5b21b6;
    text-decoration-color: #5b21b6;
  }

  .post-content :global(code) {
    font-family: "JetBrains Mono", monospace;
    font-size: 0.9em;
    background: #f5f2ec;
    padding: 0.15em 0.4em;
    border-radius: 3px;
    border: 1px solid #e6dfd5;
  }

  .post-content :global(pre) {
    background: #19192c;
    border: 2px solid #2a2a4a;
    border-left: 4px solid var(--accent-warm);
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
    border-left: 4px solid var(--accent-warm);
    background: #fff8ed;
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #4f4f5a;
  }

  .post-content :global(img) {
    max-width: 100%;
    height: auto;
    border: 2px solid #e6dfd5;
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
    color: var(--accent-ink);
  }

  .loading {
    text-align: center;
    color: #888;
    font-style: italic;
  }

  .post-footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 2px dashed #e6dfd5;
  }

  .back-link {
    font-family: "Press Start 2P", monospace;
    font-size: 0.6rem;
    color: #6f6f7f;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: color 0.2s ease;
  }

  .back-link:hover {
    color: var(--accent-ink);
  }

  @keyframes article-rise {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .post-article {
      animation: none;
    }
  }

  @media (max-width: 640px) {
    .post-article {
      padding: 1.6rem;
    }

    .post-header h1 {
      font-size: 1.9rem;
    }

    .post-content :global(h2) {
      font-size: 1.35rem;
    }

    .post-content :global(h3) {
      font-size: 1.1rem;
    }
  }
</style>
