<script lang="ts">
  import DataReportingPlanner from "$lib/teaching/DataReportingPlanner.svelte";
  import ModulePrevNext from "$lib/teaching/ModulePrevNext.svelte";
</script>

<svelte:head>
  <title>Data Reporting | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Plan audience-centered data reporting with user stories, validity checks, and visualization choices."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h2 class="text-xl">Data Reporting</h2>

  <p>
    A report is never neutral: it frames audience, signal, and uncertainty. This module turns
    dataset documentation into a reporting plan your group can defend.
  </p>
</section>

<div class="mt-6">
  <DataReportingPlanner />
</div>

<ModulePrevNext />
