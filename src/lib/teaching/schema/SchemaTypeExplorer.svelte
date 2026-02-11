<script lang="ts">
  import { searchTypes, getPopularTypes, getType, getTypeProperties } from "./schema-vocab";
  import type { VocabType, TypeProperty } from "./schema-vocab-types";

  let searchQuery = $state("");
  let selectedTypeName: string | null = $state(null);

  const popularTypes = getPopularTypes();

  let searchResults = $derived(
    searchQuery.trim() ? searchTypes(searchQuery, 30) : [],
  );

  let displayTypes = $derived(
    searchQuery.trim() ? searchResults : popularTypes,
  );

  let selectedType = $derived(
    selectedTypeName ? getType(selectedTypeName) ?? null : null,
  );

  let typeProps = $derived(
    selectedTypeName ? getTypeProperties(selectedTypeName) : [],
  );

  let ownProps = $derived(typeProps.filter((p) => p.inheritedFrom === null));

  // Group inherited properties by ancestor
  let inheritedGroups = $derived.by(() => {
    const groups: Record<string, TypeProperty[]> = {};
    for (const p of typeProps) {
      if (p.inheritedFrom) {
        if (!groups[p.inheritedFrom]) groups[p.inheritedFrom] = [];
        groups[p.inheritedFrom].push(p);
      }
    }
    return groups;
  });

  let expandedAncestors = $state<Set<string>>(new Set());

  function toggleAncestor(name: string) {
    const next = new Set(expandedAncestors);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    expandedAncestors = next;
  }

  function selectType(name: string) {
    selectedTypeName = selectedTypeName === name ? null : name;
    expandedAncestors = new Set();
  }
</script>

<section>
  <div class="prose prose-gray max-w-none dark:prose-invert">
    <h3>Explore the Full Vocabulary</h3>
    <p>
      Schema.org has <strong>900+ types</strong>. Search below, or click a popular type to see its
      properties, hierarchy, and how it inherits from parent types.
    </p>
  </div>

  <!-- Search -->
  <div class="mt-4 mb-4">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search ~900 types (e.g. Dataset, Restaurant, MedicalCondition...)"
      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-800"
    />
  </div>

  <!-- Quick-access chips (when not searching) -->
  {#if !searchQuery.trim()}
    <div class="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Popular Types</div>
  {:else}
    <div class="mb-2 text-xs text-gray-500 dark:text-gray-400">
      {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
    </div>
  {/if}

  <!-- Type grid -->
  <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each displayTypes as type}
      <button
        class="rounded-lg border p-3 text-left transition-all {selectedTypeName === type.name
          ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-900/30'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'}"
        onclick={() => selectType(type.name)}
      >
        <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{type.name}</div>
        <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {type.hierarchy.join(" > ")}
        </div>
      </button>
    {/each}
  </div>

  <!-- Selected type detail panel -->
  {#if selectedType}
    <div
      class="mt-4 rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-800 dark:bg-blue-900/20"
    >
      <!-- Header -->
      <div class="mb-1 flex items-baseline gap-2">
        <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {selectedType.name}
        </h4>
        <a
          href={selectedType.url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-normal text-blue-600 hover:underline dark:text-blue-400"
        >schema.org/{selectedType.name} &nearr;</a>
      </div>

      <!-- Hierarchy breadcrumb -->
      <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">
        {#each selectedType.hierarchy as ancestor, i}
          {#if i > 0}<span class="mx-1">&gt;</span>{/if}
          <a
            href="https://schema.org/{ancestor}"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
          >{ancestor}</a>
        {/each}
      </p>

      <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">{selectedType.description}</p>

      <!-- Own Properties -->
      {#if ownProps.length > 0}
        <h5 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Own Properties ({ownProps.length})
        </h5>
        <div class="mb-4 space-y-1.5">
          {#each ownProps as prop}
            <div class="flex items-start gap-3 rounded-lg bg-white px-3 py-2 dark:bg-gray-800">
              <a
                href={prop.url}
                target="_blank"
                rel="noopener noreferrer"
                class="shrink-0 text-sm font-medium text-blue-700 no-underline hover:underline dark:text-blue-300"
              >{prop.name}</a>
              <span class="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {prop.rangeTypes.join(" | ")}
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-400">{prop.description}</span>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Inherited Properties (grouped by ancestor) -->
      {#if Object.keys(inheritedGroups).length > 0}
        <h5 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Inherited Properties
        </h5>
        <div class="space-y-2">
          {#each Object.entries(inheritedGroups) as [ancestor, props]}
            <div>
              <button
                class="flex w-full items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-left text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                onclick={() => toggleAncestor(ancestor)}
              >
                <span
                  class="inline-block transition-transform {expandedAncestors.has(ancestor) ? 'rotate-90' : ''}"
                >&#9656;</span>
                From
                <a
                  href="https://schema.org/{ancestor}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:underline dark:text-blue-400"
                  onclick={(e) => e.stopPropagation()}
                >{ancestor}</a>
                <span class="text-gray-400">({props.length})</span>
              </button>
              {#if expandedAncestors.has(ancestor)}
                <div class="mt-1 space-y-1 pl-4">
                  {#each props as prop}
                    <div class="flex items-start gap-3 rounded-lg bg-white px-3 py-1.5 dark:bg-gray-800">
                      <a
                        href={prop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="shrink-0 text-sm font-medium text-blue-700 no-underline hover:underline dark:text-blue-300"
                      >{prop.name}</a>
                      <span class="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {prop.rangeTypes.join(" | ")}
                      </span>
                      <span class="text-sm text-gray-600 dark:text-gray-400">{prop.description}</span>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</section>
