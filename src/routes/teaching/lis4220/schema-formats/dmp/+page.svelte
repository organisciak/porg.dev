<script lang="ts">
  import DmpScaffold from "$lib/teaching/DmpScaffold.svelte";
</script>

<svelte:head>
  <title>DMP Quick-Plan | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Interactive data management plan scaffolding with Michener's 10 Rules."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h2 class="text-xl">Module C: DMP Quick-Plan</h2>

  <p>
    A <strong>Data Management Plan</strong> anticipates the future of your data. It's a living
    document that addresses how data will be collected, organized, documented, stored, shared, and
    preserved throughout a research project.
  </p>

  <p>
    The emphasis is on <em>plan</em>: DMPs exist to anticipate challenges to
    <strong>findable, accessible, interoperable, reusable</strong> (FAIR) data before they happen.
    Different funders (NSF, NIH, IMLS, NEH) have different requirements &mdash; always follow their
    format!
  </p>
</section>

<div class="mt-6">
  <DmpScaffold />
</div>
