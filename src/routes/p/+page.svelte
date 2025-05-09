<script lang="ts">
  import { base } from '$app/paths';
  
  export let data;
</script>

<svelte:head>
  <title>Blog | P</title>
  <meta name="description" content="My blog posts" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Blog Posts</h1>
  
  <div class="grid gap-6">
    {#each data.posts as post}
      {#if post}
        <a 
          href="{base}/p/{post.slug}" 
          class="block p-6 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
        >
          <h2 class="text-xl font-semibold">{post.title}</h2>
          <p class="text-sm text-slate-500 mt-1">{post.date}</p>
          {#if post.description}
            <p class="mt-3">{post.description}</p>
          {/if}
        </a>
      {/if}
    {/each}
  </div>
</div> 