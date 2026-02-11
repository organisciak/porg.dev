<script lang="ts">
  let jsonInput = $state(`{
  "name": "Garlic Roasted Potatoes",
  "author": "Ina Garten",
  "prepTime": "10 minutes",
  "cookTime": "1 hour",
  "servings": 8,
  "ingredients": [
    "3 pounds small red potatoes",
    "1/4 cup olive oil",
    "1.5 teaspoons kosher salt",
    "2 tablespoons minced garlic"
  ],
  "vegetarian": true,
  "glutenFree": true
}`);

  let validationResult = $derived.by(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      return { valid: true, formatted: JSON.stringify(parsed, null, 2), error: null };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      return { valid: false, formatted: null, error: msg };
    }
  });

  let showJsonLd = $state(false);

  let jsonLdPreview = $derived.by(() => {
    if (!validationResult.valid) return null;
    try {
      const parsed = JSON.parse(jsonInput);
      return JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "Recipe",
          ...parsed,
        },
        null,
        2,
      );
    } catch {
      return null;
    }
  });

  // XML comparison
  let showXmlComparison = $state(false);

  const xmlExample = `<?xml version="1.0" encoding="UTF-8"?>
<recipe>
  <name>Garlic Roasted Potatoes</name>
  <author>Ina Garten</author>
  <prepTime>10 minutes</prepTime>
  <cookTime>1 hour</cookTime>
  <servings>8</servings>
  <ingredients>
    <ingredient>3 pounds small red potatoes</ingredient>
    <ingredient>1/4 cup olive oil</ingredient>
    <ingredient>1.5 teaspoons kosher salt</ingredient>
    <ingredient>2 tablespoons minced garlic</ingredient>
  </ingredients>
  <vegetarian>true</vegetarian>
  <glutenFree>true</glutenFree>
</recipe>`;

  // Format comparison exercise
  let formatNotes = $state({ json: "", xml: "", csv: "" });

  // Additional formats state
  let expandedFormat: string | null = $state(null);

  const additionalFormats = [
    {
      id: "netcdf",
      name: "NetCDF",
      full: "Network Common Data Form",
      desc: "For sharing n-dimensional array data. Supports compression, quick reads, and self-describing metadata. Common in climate science, oceanography, and atmospheric research.",
    },
    {
      id: "hdf5",
      name: "HDF5",
      full: "Hierarchical Data Format 5",
      desc: "Binary format for n-dimensional arrays with hierarchical group structure. Portable, fast to access, supports compression. Used in astronomy, bioinformatics, and high-performance computing.",
    },
    {
      id: "markdown",
      name: "Markdown",
      full: "Markdown (.md)",
      desc: 'A plain-text markup language for written material. "The overriding design goal for Markdown\'s formatting syntax is to make it as readable as possible." - John Gruber. Used widely in documentation, README files, and academic writing.',
    },
    {
      id: "warc",
      name: "WARC",
      full: "Web Archive Format",
      desc: "For preserving web page data including HTTP headers, page content, and metadata. Used by the Internet Archive and national libraries for web archiving at scale.",
    },
  ];
</script>

<!-- JSON Section -->
<div class="mb-8">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">JSON Data Types</h4>
  <div class="mb-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
    {#each [
      { type: "string", example: '"hello"', color: "text-green-600 dark:text-green-400" },
      { type: "number", example: "42", color: "text-blue-600 dark:text-blue-400" },
      { type: "object", example: '{"key": value}', color: "text-purple-600 dark:text-purple-400" },
      { type: "array", example: "[1, 2, 3]", color: "text-orange-600 dark:text-orange-400" },
      { type: "boolean", example: "true / false", color: "text-red-600 dark:text-red-400" },
      { type: "null", example: "null", color: "text-gray-500 dark:text-gray-400" },
    ] as item}
      <div
        class="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="text-sm font-bold {item.color}">{item.type}</div>
        <code class="mt-1 block text-xs text-gray-600 dark:text-gray-400">{item.example}</code>
      </div>
    {/each}
  </div>

  <h4 class="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">Live JSON Editor</h4>
  <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
    Try writing JSON to describe a recipe, book, or event. The editor validates as you type.
  </p>

  <div class="grid gap-4 lg:grid-cols-2">
    <div>
      <div class="mb-1 flex items-center justify-between">
        <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Your JSON</label>
        <span
          class="rounded px-2 py-0.5 text-xs font-medium {validationResult.valid
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}"
        >
          {validationResult.valid ? "Valid JSON" : "Invalid JSON"}
        </span>
      </div>
      <textarea
        bind:value={jsonInput}
        class="h-72 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-800"
        spellcheck="false"
      ></textarea>
      {#if !validationResult.valid && validationResult.error}
        <p class="mt-1 text-xs text-red-600 dark:text-red-400">{validationResult.error}</p>
      {/if}
    </div>
    <div>
      <div class="mb-1 flex items-center justify-between">
        <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Formatted Preview</label>
      </div>
      <pre
        class="h-72 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >{validationResult.formatted ?? "Fix the JSON to see a preview"}</pre>
    </div>
  </div>

  <!-- JSON-LD Bridge -->
  <div class="mt-4">
    <button
      onclick={() => (showJsonLd = !showJsonLd)}
      class="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    >
      <span class="transition-transform {showJsonLd ? 'rotate-90' : ''}">&rsaquo;</span>
      See this as JSON-LD (format meets schema!)
    </button>
    {#if showJsonLd}
      <div class="mt-2 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <p class="mb-2 text-sm text-gray-700 dark:text-gray-300">
          JSON-LD adds <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">@context</code> and
          <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">@type</code> to connect
          your JSON data to a shared vocabulary (like schema.org). Same format, now with semantic meaning!
        </p>
        <pre
          class="overflow-auto rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >{jsonLdPreview ?? "Fix the JSON first"}</pre>
      </div>
    {/if}
  </div>
</div>

<!-- XML Section -->
<div class="mb-8">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">XML: Tags, Attributes, Elements, Content</h4>
  <div class="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
    {#each [
      { term: "Tag", example: "<book>", desc: "The name in angle brackets" },
      { term: "Element", example: "<book>...</book>", desc: "Everything from open to close tag" },
      { term: "Attribute", example: 'id="bk101"', desc: "Named values inside a tag" },
      { term: "Content", example: "Tolkien, J.R.R.", desc: "Text between open and close tags" },
    ] as item}
      <div class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{item.term}</div>
        <code class="mt-1 block text-xs text-purple-600 dark:text-purple-400">{item.example}</code>
        <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
      </div>
    {/each}
  </div>

  <button
    onclick={() => (showXmlComparison = !showXmlComparison)}
    class="mb-3 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
  >
    <span class="transition-transform {showXmlComparison ? 'rotate-90' : ''}">&rsaquo;</span>
    Compare: Same data in JSON vs XML
  </button>

  {#if showXmlComparison}
    <div class="grid gap-4 lg:grid-cols-2">
      <div>
        <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">JSON</div>
        <pre
          class="h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >{validationResult.formatted ?? jsonInput}</pre>
      </div>
      <div>
        <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">XML</div>
        <pre
          class="h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >{xmlExample}</pre>
      </div>
    </div>
  {/if}
</div>

<!-- Format Comparison Exercise -->
<div class="mb-8 rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">
    Exercise: Format Comparison
  </h4>
  <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
    For each format, note its <strong>strengths</strong> and <strong>weaknesses</strong>. Think about: readability,
    flexibility, file size, tool support, data types...
  </p>
  <div class="grid gap-4 md:grid-cols-3">
    {#each [
      { key: "json" as const, label: "JSON" },
      { key: "xml" as const, label: "XML" },
      { key: "csv" as const, label: "CSV" },
    ] as format}
      <div>
        <label class="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >{format.label}</label
        >
        <textarea
          bind:value={formatNotes[format.key]}
          placeholder="Pros / cons..."
          class="h-24 w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        ></textarea>
      </div>
    {/each}
  </div>
</div>

<!-- More Formats -->
<div>
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">More Formats</h4>
  <div class="grid gap-2 sm:grid-cols-2">
    {#each additionalFormats as fmt}
      <button
        class="rounded-lg border p-3 text-left transition-all {expandedFormat === fmt.id
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'}"
        onclick={() => (expandedFormat = expandedFormat === fmt.id ? null : fmt.id)}
      >
        <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{fmt.name}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{fmt.full}</div>
        {#if expandedFormat === fmt.id}
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{fmt.desc}</p>
        {/if}
      </button>
    {/each}
  </div>
</div>
