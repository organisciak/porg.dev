<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import type { ComponentType } from 'svelte';
  
  export let data;
  
  let Post: ComponentType | undefined;
  let metadata: Record<string, unknown> = {};
  
  onMount(async () => {
    try {
      // Dynamically import the blog post based on the slug and type
      if (data.postType === 'svx') {
        const module = await import(`$posts/${data.slug}.svx`);
        Post = module.default;
        metadata = module.metadata || {};
      } else {
        const module = await import(`$posts/${data.slug}.md`);
        Post = module.default;
        metadata = module.metadata || {};
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