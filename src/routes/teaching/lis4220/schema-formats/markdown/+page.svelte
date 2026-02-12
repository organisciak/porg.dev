<script lang="ts">
  import MarkdownPlayground from "$lib/teaching/MarkdownPlayground.svelte";
</script>

<svelte:head>
  <title>Markdown | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Learn Markdown syntax with a live editor and conversion exercise."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h2 class="text-xl">Module D: Markdown</h2>

  <p>
    Markdown is a <strong>plain-text format</strong> for writing formatted documents. Unlike proprietary
    formats like <code>.docx</code>, a Markdown file is just text &mdash; readable on any computer,
    in any editor, decades from now. That makes it an excellent choice for data documentation.
  </p>
</section>

<div class="mt-6">
  <MarkdownPlayground />
</div>
