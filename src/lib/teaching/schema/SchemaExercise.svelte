<script lang="ts">
  import TypeCombobox from "./TypeCombobox.svelte";
  import PropertyCombobox from "./PropertyCombobox.svelte";
  import ExerciseTimer from "$lib/teaching/ExerciseTimer.svelte";

  const STORAGE_KEY = "lis4220-schema-exercise";

  function loadState<T>(key: string, fallback: T): T {
    if (typeof localStorage === "undefined") return fallback;
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}-${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveState(key: string, value: unknown) {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(`${STORAGE_KEY}-${key}`, JSON.stringify(value));
    } catch { /* quota exceeded */ }
  }

  const exerciseWebsites = [
    {
      name: "Denver Zoo",
      url: "https://www.denverzoo.org",
      hint: "Think about what type of organization this is, its location, events, hours...",
    },
    {
      name: "A YouTube Video",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      hint: "What schema.org type describes a video? What properties matter most?",
    },
    {
      name: "University of Denver Homepage",
      url: "https://www.du.edu",
      hint: "Is this an Organization? An EducationalOrganization? What properties describe a university?",
    },
    {
      name: "Denver Public Library",
      url: "https://www.denverlibrary.org",
      hint: "Libraries are organizations with locations, collections, events, hours...",
    },
    {
      name: "An Internet Archive Game",
      url: "https://archive.org/details/msdos_Oregon_Trail_The_1990",
      hint: "What type is a software application / game? How would you describe a preserved digital artifact?",
    },
  ];

  let exerciseEntries = $state<
    Array<{ site: string; type: string; properties: Array<{ key: string; value: string; rangeHint?: string[] }> }>
  >(loadState("entries", [
    { site: "", type: "", properties: [{ key: "", value: "" }] },
    { site: "", type: "", properties: [{ key: "", value: "" }] },
  ]));

  function clearPropertyHints(entryIndex: number) {
    for (const prop of exerciseEntries[entryIndex].properties) {
      prop.rangeHint = undefined;
    }
  }

  $effect(() => { saveState("entries", exerciseEntries); });

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

<section>
  <div
    class="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20"
  >
    <h4 class="mb-1 text-base font-bold text-gray-900 dark:text-gray-100">
      Group Exercise: Describe a Website with Schema.org
    </h4>
    <ExerciseTimer phases={[{ label: "Pick & annotate", minutes: 13 }, { label: "Compare & discuss", minutes: 5 }]}>
    <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
      Pick <strong>2 websites</strong> from the list below. For each, choose a
      <a href="https://schema.org/docs/full.html" target="_blank" rel="noopener noreferrer">schema.org type</a>
      and fill in its properties. Think about: What type best describes this entity? What properties
      matter most? <strong>Tip:</strong> open the website in another tab so you can compare what's on the page
      with the schema.org types and properties available.
    </p>

    <div class="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {#each exerciseWebsites as site}
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          class="group rounded-lg border border-gray-200 bg-white p-3 no-underline transition-all hover:border-blue-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
        >
          <div
            class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400"
          >
            {site.name}
          </div>
          <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{site.hint}</div>
        </a>
      {/each}
    </div>

    <div class="space-y-4">
      {#each exerciseEntries as entry, i}
        <div
          class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
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
              <TypeCombobox bind:value={entry.type} onselect={() => clearPropertyHints(i)} />
              {#if entry.type}
                <a
                  href="https://schema.org/{entry.type}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-1 inline-block text-[10px] text-blue-500 hover:underline dark:text-blue-400"
                >schema.org/{entry.type} &nearr;</a>
              {/if}
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Properties</div>
            {#each entry.properties as prop}
              <div class="space-y-1">
                <div class="flex gap-2">
                  <div class="w-1/3">
                    <PropertyCombobox
                      bind:value={prop.key}
                      typeName={entry.type}
                      onselect={(p) => { prop.rangeHint = p.rangeTypes; }}
                    />
                  </div>
                  <input
                    type="text"
                    bind:value={prop.value}
                    placeholder={prop.rangeHint?.length ? `Expected: ${prop.rangeHint.slice(0, 3).join(' or ')}` : 'value'}
                    class="flex-1 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                {#if prop.rangeHint?.length}
                  <div class="ml-[calc(33.333%+0.5rem)] text-[10px] text-gray-400 dark:text-gray-500">
                    Expects: {prop.rangeHint.join(' | ')}
                  </div>
                {/if}
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

    <div class="mt-3 flex items-center gap-3">
      <button
        onclick={copyExercise}
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Copy to Clipboard
      </button>
      <span class="text-xs text-gray-400 dark:text-gray-500">Your work is saved automatically in your browser.</span>
    </div>
    </ExerciseTimer>
  </div>

  <!-- Discussion Prompts -->
  <div
    class="mt-6 rounded-xl border border-purple-200 bg-purple-50/50 p-5 dark:border-purple-800 dark:bg-purple-900/20"
  >
    <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Discussion</h4>
    <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
      <li>What was confusing or surprising about schema.org?</li>
      <li>
        Was there anything you wanted to describe but couldn't find the right type or property for?
      </li>
      <li>How do you decide which type to use when multiple seem to fit?</li>
      <li>What wouldn't you have thought to describe about a web entity before this exercise?</li>
    </ul>
  </div>
</section>
