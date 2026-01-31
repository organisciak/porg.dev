<script>
  // This component will receive all frontmatter values as props
  export let title;
  export let date;
  export let description = "";
</script>

<div class="post-layout">
  <header class="mb-8">
    <h1 class="text-3xl font-bold">{title}</h1>
    <p class="mt-2 text-sm text-slate-500">{date}</p>
    {#if description}
      <p class="mt-2 text-lg text-slate-700">{description}</p>
    {/if}
  </header>

  <div class="post-content">
    <slot />
  </div>
</div>

<style>
  .post-layout {
    width: 100%;
  }
</style>
