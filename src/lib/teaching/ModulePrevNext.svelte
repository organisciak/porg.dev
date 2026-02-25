<script lang="ts">
  import { page } from "$app/state";

  const modules = [
    { href: "/teaching/lis4220/schema", label: "Schema.org" },
    { href: "/teaching/lis4220/formats", label: "Formats" },
    { href: "/teaching/lis4220/dmp", label: "DMP" },
    { href: "/teaching/lis4220/markdown", label: "Markdown" },
    { href: "/teaching/lis4220/licensing", label: "Licensing" },
    { href: "/teaching/lis4220/dmp-applied", label: "DMP Applied" },
    { href: "/teaching/lis4220/git", label: "Git" },
    { href: "/teaching/lis4220/visualization", label: "Visualization" },
    { href: "/teaching/lis4220/data-reporting", label: "Data Reporting" },
  ];

  const currentIndex = $derived(
    modules.findIndex(
      (m) => page.url.pathname === m.href || page.url.pathname.startsWith(m.href + "/"),
    ),
  );
  const prev = $derived(currentIndex > 0 ? modules[currentIndex - 1] : null);
  const next = $derived(currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null);
</script>

{#if prev || next}
  <nav
    class="mt-12 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700"
  >
    {#if prev}
      <a
        href={prev.href}
        class="flex items-center gap-2 text-sm font-medium text-gray-600 no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <span>&larr;</span>
        <span>{prev.label}</span>
      </a>
    {:else}
      <div></div>
    {/if}
    {#if next}
      <a
        href={next.href}
        class="flex items-center gap-2 text-sm font-medium text-gray-600 no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <span>{next.label}</span>
        <span>&rarr;</span>
      </a>
    {/if}
  </nav>
{/if}
