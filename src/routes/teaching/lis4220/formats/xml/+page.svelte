<script lang="ts">
  let showXmlComparison = $state(false);

  const recipeJson = `{
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
}`;

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
</script>

<svelte:head>
  <title>XML | Formats | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Learn XML structure: tags, attributes, elements, nesting rules, and comparison with JSON."
  />
</svelte:head>

<!-- XML Section -->
<div class="mb-8">
  <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">XML: Tags, Attributes, Elements, Content</h3>

  <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
    XML (eXtensible Markup Language) organizes data with <strong>tags</strong> that you define.
    Unlike JSON's braces and brackets, XML uses angle-bracket tags that wrap around content.
  </p>

  <div class="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
    {#each [
      { term: "Tag", example: "<book>", desc: "A name in angle brackets that marks the start or end of data" },
      { term: "Element", example: "<book>...</book>", desc: "Everything from the opening tag through the closing tag, including content" },
      { term: "Attribute", example: 'id="bk101"', desc: "Named values inside an opening tag that add metadata" },
      { term: "Content", example: "Tolkien, J.R.R.", desc: "The actual data between the opening and closing tags" },
    ] as item}
      <div class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{item.term}</div>
        <code class="mt-1 block text-xs text-purple-600 dark:text-purple-400">{item.example}</code>
        <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
      </div>
    {/each}
  </div>

  <!-- XML Nesting Rules -->
  <div class="mb-4 rounded-lg border border-purple-200 bg-purple-50/50 p-5 dark:border-purple-800 dark:bg-purple-900/20">
    <h5 class="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">XML Nesting Rules</h5>
    <p class="mb-3 text-sm text-gray-700 dark:text-gray-300">
      XML is <strong>strictly hierarchical</strong>. Every tag that opens must close, and tags cannot overlap.
      If an element is inside a parent, it must close <em>before</em> the parent closes &mdash; like
      Russian nesting dolls.
    </p>

    <div class="grid gap-4 sm:grid-cols-2">
      <!-- Valid example -->
      <div>
        <div class="mb-1 flex items-center gap-1.5">
          <span class="rounded bg-green-100 px-1.5 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">Valid</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Elements properly nested</span>
        </div>
        <pre class="overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 dark:text-gray-300"><code>&lt;catalog&gt;
  &lt;book id="bk101"&gt;
    &lt;author&gt;Gambardella, Matthew&lt;/author&gt;
    &lt;title&gt;XML Developer's Guide&lt;/title&gt;
    &lt;price&gt;44.95&lt;/price&gt;
  &lt;/book&gt;
  &lt;book id="bk102"&gt;
    &lt;author&gt;Ralls, Kim&lt;/author&gt;
    &lt;title&gt;Midnight Rain&lt;/title&gt;
    &lt;price&gt;5.95&lt;/price&gt;
  &lt;/book&gt;
&lt;/catalog&gt;</code></pre>
      </div>

      <!-- Invalid example -->
      <div>
        <div class="mb-1 flex items-center gap-1.5">
          <span class="rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">Invalid</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Tags overlap &mdash; not allowed!</span>
        </div>
        <pre class="overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 dark:text-gray-300"><code>&lt;catalog&gt;
  &lt;book&gt;
    &lt;author&gt;Gambardella
  &lt;/book&gt;
    &lt;/author&gt;  <span class="text-red-500 dark:text-red-400">&lt;!-- ERROR: author</span>
                   <span class="text-red-500 dark:text-red-400">closed after book --&gt;</span>
&lt;/catalog&gt;</code></pre>
        <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
          The <code>&lt;author&gt;</code> element must close <em>before</em> its parent <code>&lt;book&gt;</code> closes.
          Every child element is fully contained within its parent.
        </p>
      </div>
    </div>

    <!-- Hierarchy visualization -->
    <div class="mt-4">
      <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">The nesting forms a tree structure:</div>
      <pre class="overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 dark:text-gray-300"><code>CATALOG
├── BOOK id="bk101"
│   ├── AUTHOR → "Gambardella, Matthew"
│   ├── TITLE  → "XML Developer's Guide"
│   └── PRICE  → "44.95"
└── BOOK id="bk102"
    ├── AUTHOR → "Ralls, Kim"
    ├── TITLE  → "Midnight Rain"
    └── PRICE  → "5.95"</code></pre>
    </div>
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
        >{recipeJson}</pre>
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
