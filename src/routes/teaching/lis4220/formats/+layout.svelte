<script lang="ts">
  import { page } from "$app/state";
  import ModulePrevNext from "$lib/teaching/ModulePrevNext.svelte";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  const subModules = [
    { href: "/teaching/lis4220/formats", label: "Overview" },
    { href: "/teaching/lis4220/formats/json", label: "JSON" },
    { href: "/teaching/lis4220/formats/xml", label: "XML" },
  ];
</script>

<nav class="mb-6 flex gap-2">
  {#each subModules as sub}
    {@const active = page.url.pathname === sub.href}
    <a
      href={sub.href}
      class="rounded-full px-4 py-1.5 text-sm font-medium no-underline transition-all {active
        ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}"
    >
      {sub.label}
    </a>
  {/each}
</nav>

{@render children()}

<ModulePrevNext />
