<script lang="ts">
  import { page } from "$app/state";

  let { children } = $props();

  const isLanding = $derived(page.url.pathname === "/teaching/lis4220/week7");

  const modules = [
    { href: "/teaching/lis4220/week7/markdown", label: "A: Markdown", time: "~15 min" },
    { href: "/teaching/lis4220/week7/licensing", label: "B: Licensing", time: "~15 min" },
  ];
</script>

<div class="mx-auto max-w-5xl px-6 py-8">
  <div class="mb-8">
    <h1
      class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
    >
      Markdown &amp; Licensing
    </h1>
    <p class="text-base text-gray-600 dark:text-gray-400">
      LIS 4220: Data Curation &middot; Week 7: Use and Analysis II
    </p>
  </div>

  {#if !isLanding}
    <nav
      class="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800"
    >
      {#each modules as mod}
        {@const active = page.url.pathname === mod.href}
        <a
          href={mod.href}
          class="flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-all whitespace-nowrap no-underline {active
            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
        >
          {mod.label}
          <span class="ml-1 text-xs text-gray-400 dark:text-gray-500">{mod.time}</span>
        </a>
      {/each}
    </nav>
  {/if}

  {@render children()}
</div>
