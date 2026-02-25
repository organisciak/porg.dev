<script lang="ts">
  import VisualizationQuestions from "$lib/teaching/VisualizationQuestions.svelte";
  import ModulePrevNext from "$lib/teaching/ModulePrevNext.svelte";
</script>

<svelte:head>
  <title>Visualization | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Choose defensible charts for analytic questions and practice arguing why they fit."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h2 class="text-xl">Visualization</h2>

  <p>
    Good visualizations are arguments, not decoration. This module asks you to select chart forms by
    analytical task and justify your choices.
  </p>
</section>

<div class="mt-6">
  <VisualizationQuestions />
</div>

<ModulePrevNext />
