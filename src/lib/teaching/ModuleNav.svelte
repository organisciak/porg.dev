<script lang="ts">
  import { page } from "$app/state";

  const modules = [
    { href: "/teaching/lis4220/schema", label: "Schema.org", time: "~40 min" },
    { href: "/teaching/lis4220/formats", label: "Formats", time: "~30 min" },
    { href: "/teaching/lis4220/dmp", label: "DMP", time: "~30 min" },
    { href: "/teaching/lis4220/markdown", label: "Markdown", time: "~15 min" },
    { href: "/teaching/lis4220/licensing", label: "Licensing", time: "~15 min" },
    { href: "/teaching/lis4220/dmp-applied", label: "DMP Applied", time: "~20 min" },
    { href: "/teaching/lis4220/git", label: "Git", time: "~20 min" },
  ];
</script>

<nav
  class="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800"
>
  {#each modules as mod}
    {@const active = page.url.pathname === mod.href || page.url.pathname.startsWith(mod.href + '/')}
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
