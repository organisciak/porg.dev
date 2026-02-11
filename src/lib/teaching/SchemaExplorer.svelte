<script lang="ts">
  import { schemaTypes, exerciseWebsites, type SchemaType } from "./schemaTypes";

  let searchQuery = $state("");
  let selectedType: SchemaType | null = $state(null);

  let filteredTypes = $derived(
    searchQuery.trim() === ""
      ? schemaTypes
      : schemaTypes.filter(
          (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
  );

  // Exercise state
  let selectedSite1 = $state("");
  let selectedSite2 = $state("");
  let exerciseEntries = $state<
    Array<{ site: string; type: string; properties: Array<{ key: string; value: string }> }>
  >([
    { site: "", type: "", properties: [{ key: "", value: "" }] },
    { site: "", type: "", properties: [{ key: "", value: "" }] },
  ]);

  function addProperty(index: number) {
    exerciseEntries[index].properties = [
      ...exerciseEntries[index].properties,
      { key: "", value: "" },
    ];
  }

  function copyExercise() {
    const text = exerciseEntries
      .map((entry, i) => {
        const lines = [`Website ${i + 1}: ${entry.site}`, `Type: ${entry.type}`];
        entry.properties.forEach((p) => {
          if (p.key || p.value) lines.push(`  ${p.key}: ${p.value}`);
        });
        return lines.join("\n");
      })
      .join("\n\n");
    navigator.clipboard.writeText(text);
  }
</script>

<!-- Type Browser -->
<div class="mb-8">
  <div class="mb-4">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search types (e.g. Book, Dataset, Event...)"
      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-800"
    />
  </div>

  <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each filteredTypes as type}
      <button
        class="rounded-lg border p-3 text-left transition-all {selectedType?.name === type.name
          ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-900/30'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'}"
        onclick={() => (selectedType = selectedType?.name === type.name ? null : type)}
      >
        <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{type.name}</div>
        <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {type.hierarchy.join(" > ")}
        </div>
      </button>
    {/each}
  </div>

  {#if selectedType}
    <div
      class="mt-4 rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-800 dark:bg-blue-900/20"
    >
      <div class="mb-1 flex items-baseline gap-2">
        <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {selectedType.name}
        </h4>
        <a
          href="https://schema.org/{selectedType.name}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-normal text-blue-600 hover:underline dark:text-blue-400"
          >schema.org/{selectedType.name} &nearr;</a
        >
      </div>
      <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">
        {selectedType.hierarchy.join(" > ")}
      </p>
      <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">{selectedType.description}</p>

      <h5 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        Properties
      </h5>
      <div class="space-y-1.5">
        {#each selectedType.properties as prop}
          <div
            class="flex items-start gap-3 rounded-lg bg-white px-3 py-2 dark:bg-gray-800"
          >
            <code class="shrink-0 text-sm font-medium text-blue-700 dark:text-blue-300"
              >{prop.name}</code
            >
            <span class="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >{prop.expectedType}</span
            >
            <span class="text-sm text-gray-600 dark:text-gray-400">{prop.description}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<!-- Group Exercise -->
<div class="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">
    Group Exercise: Describe a Website with Schema.org
  </h4>
  <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
    Pick <strong>2 websites</strong> from the list below. For each, choose a schema.org type and
    fill in its properties. Think about: What type best describes this entity? What properties
    matter most?
  </p>

  <div class="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
    {#each exerciseWebsites as site}
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        class="group rounded-lg border border-gray-200 bg-white p-3 no-underline transition-all hover:border-blue-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
      >
        <div class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {site.name}
        </div>
        <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{site.hint}</div>
      </a>
    {/each}
  </div>

  <div class="space-y-4">
    {#each exerciseEntries as entry, i}
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Website {i + 1}
        </div>
        <div class="mb-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >Website URL or Name</label
            >
            <input
              type="text"
              bind:value={entry.site}
              placeholder="e.g. Denver Zoo"
              class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >Schema.org Type</label
            >
            <select
              bind:value={entry.type}
              class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Select a type...</option>
              {#each schemaTypes as t}
                <option value={t.name}>{t.name}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="space-y-2">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Properties</div>
          {#each entry.properties as prop}
            <div class="flex gap-2">
              <input
                type="text"
                bind:value={prop.key}
                placeholder="property name"
                class="w-1/3 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <input
                type="text"
                bind:value={prop.value}
                placeholder="value"
                class="flex-1 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          {/each}
          <button
            onclick={() => addProperty(i)}
            class="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            + Add property
          </button>
        </div>
      </div>
    {/each}
  </div>

  <button
    onclick={copyExercise}
    class="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
  >
    Copy to Clipboard
  </button>
</div>

<!-- Discussion Prompts -->
<div class="mt-6 rounded-xl border border-purple-200 bg-purple-50/50 p-5 dark:border-purple-800 dark:bg-purple-900/20">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">
    Discussion
  </h4>
  <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
    <li>What was confusing or surprising about schema.org?</li>
    <li>Was there anything you wanted to describe but couldn't find the right type or property for?</li>
    <li>How do you decide which type to use when multiple seem to fit?</li>
    <li>What wouldn't you have thought to describe about a web entity before this exercise?</li>
  </ul>
</div>
