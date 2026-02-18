<script lang="ts">
  import JsonPlayground from "$lib/teaching/JsonPlayground.svelte";
</script>

<svelte:head>
  <title>JSON | Formats | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Learn JSON syntax hands-on: data types, live editor, and JSON-LD for linked data."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h3>JSON (JavaScript Object Notation)</h3>
  <p>
    JSON is a lightweight, text-based format for structured data. It's human-readable and widely
    supported. Let's explore its building blocks and try writing some.
  </p>
</section>

<div class="mt-6">
  <JsonPlayground />
</div>
