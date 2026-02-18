<script lang="ts">
  import ModuleNav from "$lib/teaching/ModuleNav.svelte";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  const isLanding = $derived(page.url.pathname === "/teaching/lis4220");
</script>

<div class="mx-auto max-w-5xl px-6 py-8">
  <div class="mb-8">
    <h1
      class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
    >
      LIS 4220: Data Curation
    </h1>
    <p class="text-base text-gray-600 dark:text-gray-400">
      Module 2: Use and Analysis
    </p>
  </div>

  {#if !isLanding}
    <ModuleNav />
  {/if}

  {@render children()}
</div>
