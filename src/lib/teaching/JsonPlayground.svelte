<script lang="ts">
  import ExerciseTimer from "$lib/teaching/ExerciseTimer.svelte";

  const STORAGE_KEY = "lis4220-format-playground";

  // --- localStorage helpers ---
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
    } catch { /* quota exceeded — silently ignore */ }
  }

  // --- Color highlighting for JSON examples ---
  let colorHighlighting = $state(false);

  function colorizeJson(json: string): string {
    const escaped = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return escaped.replace(
      /("(?:[^"\\]|\\.)*")|(\b-?\d+\.?\d*(?:[eE][+-]?\d+)?\b)|(\btrue\b|\bfalse\b)|(\bnull\b)|([{}])|([[\]])/g,
      (match, str, num, bool, nul, brace, bracket) => {
        if (str) return `<span class="text-green-600 dark:text-green-400">${str}</span>`;
        if (num) return `<span class="text-blue-600 dark:text-blue-400">${num}</span>`;
        if (bool) return `<span class="text-red-600 dark:text-red-400">${bool}</span>`;
        if (nul) return `<span class="text-gray-500 dark:text-gray-400">${nul}</span>`;
        if (brace) return `<span class="text-purple-600 dark:text-purple-400">${brace}</span>`;
        if (bracket) return `<span class="text-orange-600 dark:text-orange-400">${bracket}</span>`;
        return match;
      },
    );
  }

  const step1Json = `{
  "name": "Data Curation",
  "student_count": 17,
  "graduate_level": true,
  "prerequisites": null
}`;

  const step2Json = `{
  "name": "Data Curation",
  "related_courses": [
    "Digitization",
    "Scripting",
    "Digital Preservation"
  ]
}`;

  const step3Json = `{
  "name": "Data Curation",
  "instructor": {
    "name": "Peter Organisciak",
    "affiliation": "University of Denver"
  },
  "assignments": [
    { "title": "Data Cleaning", "points": 190 },
    { "title": "Data Management Plan", "points": 190 },
    { "title": "Data Paper", "points": 230 }
  ]
}`;

  // --- JSON Editor state ---
  let jsonInput = $state(loadState("jsonInput", "{}"));
  $effect(() => { saveState("jsonInput", jsonInput); });

  // Normalize single quotes to double quotes for lenient parsing
  function normalizeSingleQuotes(input: string): string {
    let result = "";
    let inDouble = false;
    let inSingle = false;
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      const prev = i > 0 ? input[i - 1] : "";
      if (ch === '"' && prev !== "\\" && !inSingle) {
        inDouble = !inDouble;
        result += ch;
      } else if (ch === "'" && prev !== "\\" && !inDouble) {
        inSingle = !inSingle;
        result += '"';
      } else {
        result += ch;
      }
    }
    return result;
  }

  function getErrorHint(error: string): string | null {
    const e = error.toLowerCase();
    if (e.includes("bad control character"))
      return "Are your strings closed? A missing closing quote can cause this.";
    if (e.includes("expected property name") || e.includes("expected double-quoted property name"))
      return 'Keys in JSON must be strings in double quotes, like "name".';
    if (e.includes("unexpected end"))
      return "Your JSON seems incomplete — check for missing closing } or ].";
    if (e.includes("unexpected non-whitespace"))
      return "There may be extra characters after your JSON ends. Check for stray text outside the main { }.";
    if (e.includes("unexpected token"))
      return "Check for missing commas, extra commas, or unquoted values. Remember: only strings get quotes, and they must be double quotes.";
    return null;
  }

  let validationResult = $derived.by(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      return { valid: true, formatted: JSON.stringify(parsed, null, 2), error: null, hint: null, singleQuoteWarning: false };
    } catch (e: unknown) {
      try {
        const normalized = normalizeSingleQuotes(jsonInput);
        const parsed = JSON.parse(normalized);
        return { valid: true, formatted: JSON.stringify(parsed, null, 2), error: null, hint: null, singleQuoteWarning: true };
      } catch {
        const msg = e instanceof Error ? e.message : "Invalid JSON";
        return { valid: false, formatted: null, error: msg, hint: getErrorHint(msg), singleQuoteWarning: false };
      }
    }
  });

  let showPreview = $state(false);

  // --- XML comparison ---
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

  // --- JSON-LD standalone examples ---
  const plainJsonExample = `{
  "name": "Data Curation",
  "courseCode": "LIS 4220",
  "provider": "University of Denver",
  "instructor": "Peter Organisciak",
  "description": "Data cleaning, management plans, preservation, and policy."
}`;

  const jsonLdExample = `{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Data Curation",
  "courseCode": "LIS 4220",
  "provider": {
    "@type": "Organization",
    "name": "University of Denver"
  },
  "instructor": {
    "@type": "Person",
    "name": "Peter Organisciak"
  },
  "description": "Data cleaning, management plans, preservation, and policy."
}`;

  // --- Format comparison exercise (persisted) ---
  let formatNotes = $state(loadState("formatNotes", { json: "", xml: "", csv: "" }));
  $effect(() => { saveState("formatNotes", formatNotes); });

  // --- Additional formats ---
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
  <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
    JSON has six data types &mdash; four simple values and two structures that combine them:
  </p>
  <div class="mb-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
    {#each [
      { type: "string", example: '"hello"', color: "text-green-600 dark:text-green-400", note: "text in quotes" },
      { type: "number", example: "42", color: "text-blue-600 dark:text-blue-400", note: "digits only" },
      { type: "boolean", example: "true / false", color: "text-red-600 dark:text-red-400", note: "no quotes" },
      { type: "null", example: "null", color: "text-gray-500 dark:text-gray-400", note: "absence of data" },
      { type: "object", example: '{ "key": val }', color: "text-purple-600 dark:text-purple-400", note: "key:value pairs" },
      { type: "array", example: "[1, 2, 3]", color: "text-orange-600 dark:text-orange-400", note: "ordered list" },
    ] as item}
      <div
        class="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="text-sm font-bold {item.color}">{item.type}</div>
        <code class="mt-1 block text-xs text-gray-600 dark:text-gray-400">{item.example}</code>
        <div class="mt-1 text-[10px] text-gray-400 dark:text-gray-500">{item.note}</div>
      </div>
    {/each}
  </div>

  <!-- Step-by-step guide to writing JSON -->
  <div class="mb-6 rounded-lg border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
    <div class="mb-3 flex items-center justify-between">
      <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">
        How to Write Valid JSON
      </h4>
      <button
        onclick={() => (colorHighlighting = !colorHighlighting)}
        class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors {colorHighlighting
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'}"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        {colorHighlighting ? "Color on" : "Color by type"}
      </button>
    </div>

    <!-- Step 1 -->
    <div class="mb-4">
      <div class="mb-1 flex items-center gap-2">
        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Start with an object: key-value pairs in curly braces</span>
      </div>
      <p class="mb-2 ml-8 text-sm text-gray-600 dark:text-gray-400">
        An <strong>object</strong> is a collection of named values. Keys must be unique strings (in quotes).
        Pairs are separated by commas.
      </p>
      {#if colorHighlighting}
        <pre class="ml-8 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900"><code>{@html colorizeJson(step1Json)}</code></pre>
      {:else}
        <pre class="ml-8 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 dark:text-gray-300"><code>{step1Json}</code></pre>
      {/if}
    </div>

    <!-- Step 2 -->
    <div class="mb-4">
      <div class="mb-1 flex items-center gap-2">
        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Use arrays for ordered lists of values</span>
      </div>
      <p class="mb-2 ml-8 text-sm text-gray-600 dark:text-gray-400">
        An <strong>array</strong> holds a sequence of values in square brackets. Values can be any type &mdash; strings, numbers, even other objects.
      </p>
      {#if colorHighlighting}
        <pre class="ml-8 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900"><code>{@html colorizeJson(step2Json)}</code></pre>
      {:else}
        <pre class="ml-8 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 dark:text-gray-300"><code>{step2Json}</code></pre>
      {/if}
    </div>

    <!-- Step 3 -->
    <div>
      <div class="mb-1 flex items-center gap-2">
        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">3</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Nest objects and arrays to describe complex data</span>
      </div>
      <p class="mb-2 ml-8 text-sm text-gray-600 dark:text-gray-400">
        Objects can contain other objects. Arrays can contain objects. This nesting is how JSON represents
        real-world structures &mdash; a recipe with a list of ingredient objects, a catalog with nested books.
      </p>
      {#if colorHighlighting}
        <pre class="ml-8 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900"><code>{@html colorizeJson(step3Json)}</code></pre>
      {:else}
        <pre class="ml-8 overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 dark:text-gray-300"><code>{step3Json}</code></pre>
      {/if}
    </div>
  </div>

  <h4 class="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">Live JSON Editor</h4>
  <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
    Try writing JSON to describe a recipe, book, or event. The editor validates as you type.
    Your work is saved automatically.
  </p>

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
      class="h-48 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-800"
      spellcheck="false"
    ></textarea>
    {#if !validationResult.valid && validationResult.error}
      <p class="mt-1 text-xs text-red-600 dark:text-red-400">{validationResult.error}</p>
      {#if validationResult.hint}
        <p class="mt-1 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
          <svg class="mt-0.5 h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>{validationResult.hint}</span>
        </p>
      {/if}
    {/if}
    {#if validationResult.singleQuoteWarning}
      <p class="mt-1 text-xs text-amber-600 dark:text-amber-400">
        Note: JSON officially requires double quotes (<code class="rounded bg-amber-100 px-1 dark:bg-amber-900/30">"</code>). We accepted your single quotes, but use double quotes for compatibility.
      </p>
    {/if}
  </div>

  <!-- Whitespace learning moment + collapsible preview -->
  <div class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
    <p class="text-sm text-gray-700 dark:text-gray-300">
      <strong>Did you know?</strong> Whitespace (spaces, tabs, line breaks) is optional in JSON. The machine
      doesn't care whether your data is all on one line or neatly indented &mdash; both parse to exactly the
      same thing. But formatting makes it <em>much</em> easier for humans to read and debug.
    </p>
    <button
      onclick={() => (showPreview = !showPreview)}
      class="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    >
      <span class="inline-block transition-transform {showPreview ? 'rotate-90' : ''}">&rsaquo;</span>
      {showPreview ? "Hide formatted preview" : "Show formatted preview"}
    </button>
    {#if showPreview}
      <pre
        class="mt-2 max-h-72 overflow-auto rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >{validationResult.formatted ?? "Fix the JSON to see a preview"}</pre>
    {/if}
  </div>
</div>

<!-- JSON-LD: From Data to Meaning -->
<div class="mb-8 mt-8">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">JSON-LD: From Data to Meaning</h4>
  <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
    JSON can hold any structured data, but it doesn't say what the data <em>means</em>. Is
    <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">"name"</code> a person's name? A course
    title? A pet's name? <strong>JSON-LD</strong> (JSON for Linked Data) solves this by adding two special keys:
  </p>

  <div class="mb-4 grid gap-3 sm:grid-cols-2">
    <div class="rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
      <code class="text-sm font-bold text-blue-700 dark:text-blue-300">"@context"</code>
      <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
        Points to a shared vocabulary (like <code class="text-xs">https://schema.org</code>) so every reader
        agrees on what the property names mean.
      </p>
    </div>
    <div class="rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
      <code class="text-sm font-bold text-blue-700 dark:text-blue-300">"@type"</code>
      <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
        Declares what kind of thing you're describing &mdash; a
        <code class="text-xs">Course</code>, <code class="text-xs">Person</code>,
        <code class="text-xs">Book</code>, etc.
      </p>
    </div>
  </div>

  <div class="grid gap-4 lg:grid-cols-2">
    <div>
      <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Plain JSON</div>
      <pre
        class="h-56 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >{plainJsonExample}</pre>
    </div>
    <div>
      <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">JSON-LD (with semantic context)</div>
      <pre
        class="h-56 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >{jsonLdExample}</pre>
    </div>
  </div>

  <div class="mt-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
    <p class="text-sm text-gray-700 dark:text-gray-300">
      Same data, but now machines (search engines, assistants, databases) can understand it. Google
      <a href="https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">recommends JSON-LD</a>
      for adding structured data to web pages. You'll explore this further in
      <strong>Module A: Schema.org</strong>.
    </p>
  </div>
</div>

<!-- XML Section -->
<div class="mb-8">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">XML: Tags, Attributes, Elements, Content</h4>

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

<!-- Format Comparison Exercise -->
<div class="mb-8 rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
  <h4 class="mb-1 text-base font-bold text-gray-900 dark:text-gray-100">
    Exercise: Format Comparison
  </h4>
  <ExerciseTimer phases={[{ label: "Note pros/cons", minutes: 3 }, { label: "Discuss", minutes: 2 }]}>
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
    <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">Your notes are saved automatically in your browser.</p>
  </ExerciseTimer>
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
