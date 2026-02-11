<script lang="ts">
  import { getThingProperties } from "./schema-vocab";

  const thingProps = getThingProperties();

  const dcParallels: Record<string, string> = {
    name: "dc:title",
    description: "dc:description",
    identifier: "dc:identifier",
    url: "dc:identifier (URI)",
    image: "dc:relation",
    sameAs: "dc:relation",
    alternateName: "dc:alternative",
    subjectOf: "dc:subject",
  };
</script>

<section>
  <div class="prose prose-gray max-w-none dark:prose-invert">
    <h3>Thing: The Universal Properties</h3>
    <p>
      Every schema.org type inherits from
      <a href="https://schema.org/Thing" target="_blank" rel="noopener noreferrer">Thing</a> &mdash;
      the root of the hierarchy. Thing's properties are the <strong>universal metadata fields</strong>
      that apply to anything you'd describe: a person, a book, a dataset, an event.
    </p>
    <p>
      Notice how many of these parallel <strong>Dublin Core</strong> elements? The metadata world builds
      on the same fundamental concepts.
    </p>
  </div>

  <div class="mt-4 space-y-1.5">
    {#each thingProps as prop}
      <div
        class="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
      >
        <a
          href={prop.url}
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 text-sm font-medium text-blue-700 no-underline hover:underline dark:text-blue-300"
        >{prop.name}</a>
        <span class="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {prop.rangeTypes.join(" | ")}
        </span>
        {#if dcParallels[prop.name]}
          <span class="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            &#8801; {dcParallels[prop.name]}
          </span>
        {/if}
        <span class="text-sm text-gray-600 dark:text-gray-400">{prop.description}</span>
      </div>
    {/each}
  </div>
</section>
