<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  const STORAGE_KEY = "lis4220-professor-questions";

  function loadText(): string {
    if (typeof localStorage === "undefined") return "";
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  }

  function saveText(text: string) {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, text);
    } catch { /* quota exceeded */ }
  }

  let isOpen = $state(true);
  let text = $state(loadText());

  $effect(() => { saveText(text); });

  let hasText = $derived(text.trim().length > 0);

  function clearText() {
    if (confirm("Clear all your saved questions?")) {
      text = "";
    }
  }

  // Portal: move the container to document.body so it escapes any
  // ancestor with will-change/transform that breaks fixed positioning.
  let portalEl: HTMLDivElement | undefined = $state();

  onMount(() => {
    if (portalEl) document.body.appendChild(portalEl);
  });

  onDestroy(() => {
    if (portalEl?.parentNode) portalEl.parentNode.removeChild(portalEl);
  });
</script>

<div bind:this={portalEl} class="professor-questions-portal">
{#if !isOpen}
  <!-- Collapsed: floating button -->
  <button
    onclick={() => (isOpen = true)}
    class="fixed bottom-4 right-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-purple-700 active:scale-95"
    aria-label="Open questions scratchpad"
  >
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />
    </svg>
    {#if hasText}
      <span class="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-amber-400 ring-2 ring-white dark:ring-gray-950"></span>
    {/if}
  </button>
{:else}
  <!-- Expanded: panel -->
  <div class="fixed bottom-4 right-4 z-[9999] flex w-[calc(100vw-2rem)] flex-col rounded-xl border border-purple-200 bg-white shadow-xl sm:w-80 dark:border-purple-800 dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Questions for Prof</h3>
      <div class="flex items-center gap-1">
        {#if hasText}
          <button
            onclick={clearText}
            class="rounded p-1 text-xs text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            aria-label="Clear questions"
            title="Clear all"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        {/if}
        <button
          onclick={() => (isOpen = false)}
          class="rounded p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          aria-label="Minimize"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
    <!-- Textarea -->
    <div class="p-3">
      <textarea
        bind:value={text}
        placeholder="Jot down questions as you go through the material..."
        class="h-48 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-purple-500 dark:focus:ring-purple-800"
      ></textarea>
    </div>
    <!-- Footer -->
    <div class="border-t border-gray-100 px-4 py-2 dark:border-gray-800">
      <p class="text-[10px] text-gray-400 dark:text-gray-500">Saved automatically in your browser</p>
    </div>
  </div>
{/if}
</div>
