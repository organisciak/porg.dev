<script lang="ts">
  import SchemaIntro from "$lib/teaching/schema/SchemaIntro.svelte";
  import SchemaDataTypes from "$lib/teaching/schema/SchemaDataTypes.svelte";
  import SchemaThingProperties from "$lib/teaching/schema/SchemaThingProperties.svelte";
  import SchemaTypeExplorer from "$lib/teaching/schema/SchemaTypeExplorer.svelte";
  import SchemaExercise from "$lib/teaching/schema/SchemaExercise.svelte";
  import SchemaEmbedding from "$lib/teaching/schema/SchemaEmbedding.svelte";
</script>

<svelte:head>
  <title>Schema.org Explorer | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Explore the schema.org vocabulary: types, properties, hierarchy, and hands-on exercises."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h2 class="text-xl">Module A: Schema.org Explorer</h2>
</section>

<div class="mt-6 space-y-10">
  <SchemaIntro />
  <SchemaDataTypes />
  <SchemaThingProperties />
  <SchemaTypeExplorer />
  <SchemaExercise />
  <SchemaEmbedding />
</div>
