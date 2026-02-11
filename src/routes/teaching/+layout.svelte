<script lang="ts">
  import { hideStandardHeader } from "$lib/stores/headerVisibility";
  import { onMount, onDestroy } from "svelte";
  import ProfessorQuestions from "$lib/teaching/ProfessorQuestions.svelte";

  let { children } = $props();

  onMount(() => {
    hideStandardHeader.set(true);
  });

  onDestroy(() => {
    hideStandardHeader.set(false);
  });
</script>

<div class="teaching-layout min-h-screen bg-white dark:bg-gray-950">
  <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
      <div class="flex items-center gap-3">
        <a href="/" class="text-sm font-normal text-gray-400 no-underline hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">porg.dev</a>
        <span class="text-gray-300 dark:text-gray-700">/</span>
        <a href="/teaching/lis4220/schema-formats" class="text-sm font-semibold text-gray-900 no-underline dark:text-gray-100">LIS 4220</a>
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">Data Curation &middot; University of Denver</div>
    </div>
  </header>
  {@render children()}
</div>

<ProfessorQuestions />

<style>
  :global(.teaching-layout a) {
    font-weight: inherit;
  }
</style>
