<script lang="ts">
  import DmpApplied from "$lib/teaching/DmpApplied.svelte";
  import ModulePrevNext from "$lib/teaching/ModulePrevNext.svelte";
</script>

<svelte:head>
  <title>DMP Applied | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Practice answering real DMP questions for a research project scenario."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h2 class="text-xl">DMP Applied</h2>

  <p>
    Earlier you explored the high-level framework of a Data Management Plan with Michener's 10 Rules.
    Now it's time to get concrete: answer the specific questions that funders actually ask on a DMP form.
  </p>
</section>

<div class="mt-6">
  <DmpApplied />
</div>

<ModulePrevNext />
