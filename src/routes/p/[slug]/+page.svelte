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
  {#if metadata.title}
    <title>{String(metadata.title)}</title>
  {:else}
    <title>Blog Post</title>
  {/if}
  {#if metadata.description}
    <meta name="description" content={String(metadata.description)} />
  {/if}
  {#if jsonLd}
    <script type="application/ld+json">{@html JSON.stringify(jsonLd)}</script>
  {/if}
  <link rel="alternate" type="application/rss+xml" title="porg.dev blog" href="{base}/rss.xml" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <a href="{base}/p" class="text-blue-600 hover:underline">&larr; Back to all posts</a>
  </div>
  
  <article class="prose prose-slate max-w-none">
    {#if Post}
      <svelte:component this={Post} />
    {:else}
      <p>Loading post...</p>
    {/if}
  </article>
</div> 
