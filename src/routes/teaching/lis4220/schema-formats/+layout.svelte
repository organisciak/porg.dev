<script lang="ts">
  import ModuleNav from "$lib/teaching/ModuleNav.svelte";
  import { page } from "$app/state";

  let { children } = $props();

  const isLanding = $derived(page.url.pathname === "/teaching/lis4220/schema-formats");
</script>

<div class="mx-auto max-w-5xl px-6 py-8">
  <!-- Page Header -->
  <div class="mb-8">
    <h1
      class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
    >
      Schema, Formats &amp; Data Management Plans
    </h1>
    <p class="text-base text-gray-600 dark:text-gray-400">
      LIS 4220: Data Curation &middot; Week 6 Activities
    </p>
  </div>

  {#if !isLanding}
    <ModuleNav />
  {/if}

  {@render children()}
</div>
