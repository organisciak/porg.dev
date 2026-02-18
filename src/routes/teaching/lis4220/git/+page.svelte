<script lang="ts">
  import GitTutorial from "$lib/teaching/GitTutorial.svelte";
  import ModulePrevNext from "$lib/teaching/ModulePrevNext.svelte";
</script>

<svelte:head>
  <title>Git Tutorial | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Interactive slide-based tutorial on Git version control for data curation."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h2 class="text-xl">Git</h2>

  <p>
    A hands-on introduction to Git: version control concepts, basic commands,
    branching, merging, and handling large files.
  </p>
</section>

<div class="mt-6">
  <GitTutorial />
</div>

<ModulePrevNext />
