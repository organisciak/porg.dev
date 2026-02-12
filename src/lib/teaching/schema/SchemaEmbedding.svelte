<script lang="ts">
  let showMicrodata = $state(false);
  let showAnnotations = $state(true);

  // Actual JSON-LD extracted from Goodreads for Life of Pi
  const goodreadsJsonLd = `{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "Life of Pi",
  "image": "https://m.media-amazon.com/.../4214.jpg",
  "bookFormat": "Paperback",
  "numberOfPages": 460,
  "inLanguage": "English",
  "isbn": "9780770430078",
  "author": [
    {
      "@type": "Person",
      "name": "Yann Martel",
      "url": "https://www.goodreads.com/author/..."
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 3.94,
    "ratingCount": 1757563,
    "reviewCount": 57282
  }
}`;

  const jsonLdExample = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "Life of Pi",
  "bookFormat": "Paperback",
  "numberOfPages": 460,
  "isbn": "9780770430078",
  "author": {
    "@type": "Person",
    "name": "Yann Martel"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 3.94,
    "ratingCount": 1757563
  }
}
<\/script>`;

  const rdfaExample = `<div vocab="https://schema.org/" typeof="Book">
  <h1 property="name">Life of Pi</h1>
  <span property="author" typeof="Person">
    <a property="name"
       href="/author/show/811.Yann_Martel">
      Yann Martel
    </a>
  </span>
  <div property="aggregateRating"
       typeof="AggregateRating">
    <span property="ratingValue">3.94</span> /
    <span property="ratingCount">1,757,563</span>
  </div>
  <span property="numberOfPages">460</span> pages,
  <span property="bookFormat">Paperback</span>
</div>`;

  const annotations = [
    {
      label: "Type: Book",
      detail: "Thing > CreativeWork > Book",
      color: "bg-blue-500",
      items: [
        { property: "name", source: "inherited from Thing", value: '"Life of Pi"', valueType: "Text" },
        { property: "author", source: "inherited from CreativeWork", value: "Yann Martel", valueType: "Person (another Type!)" },
        { property: "aggregateRating", source: "inherited from CreativeWork", value: "3.94 from 1.7M ratings", valueType: "AggregateRating (another Type!)" },
        { property: "numberOfPages", source: "own property of Book", value: "460", valueType: "Integer" },
        { property: "bookFormat", source: "own property of Book", value: '"Paperback"', valueType: "BookFormatType" },
        { property: "isbn", source: "own property of Book", value: '"9780770430078"', valueType: "Text" },
        { property: "inLanguage", source: "inherited from CreativeWork", value: '"English"', valueType: "Text" },
      ],
    },
  ];

  const comparisonRows = [
    { aspect: "Location in page", jsonld: "Separate <script> block in <head> or <body>", rdfa: "Inline attributes on existing HTML elements" },
    { aspect: "Readability", jsonld: "Easy to read — it's just JSON", rdfa: "Mixed with HTML — harder to scan" },
    { aspect: "Maintenance", jsonld: "Can be generated independently of HTML", rdfa: "Must update HTML and data together" },
    { aspect: "Adoption", jsonld: "Google's recommended format; most common today", rdfa: "Widely supported but declining in new usage" },
    { aspect: "Survives redesign?", jsonld: "Yes — data block is independent of markup", rdfa: "No — data is woven into the markup structure" },
    { aspect: "CMS integration", jsonld: "Easy to inject from templates or APIs", rdfa: "Requires modifying HTML templates" },
  ];
</script>

<section>
  <div class="prose prose-gray max-w-none dark:prose-invert">
    <h3 class="text-lg font-bold">Embedding Structured Data in Web Pages</h3>
  </div>

  <p class="mt-3 text-sm text-gray-700 dark:text-gray-300">
    You've explored schema.org types and properties. But how does this structured data actually
    get <em>into</em> a web page so that search engines can read it? Let's start with a real example,
    then look at the two main embedding approaches.
  </p>

  <!-- Life of Pi Case Study -->
  <div class="mt-6">
    <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">
      Real-World Example: <em>Life of Pi</em> on Goodreads
    </h4>
    <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
      Goodreads embeds schema.org structured data in every book page. Here's what a human sees vs.
      what a search engine reads:
    </p>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Screenshot -->
      <div>
        <div class="mb-1 flex items-center gap-2">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">What you see (Goodreads page)</span>
        </div>
        <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <img
            src="/teaching/goodreads-life-of-pi.png"
            alt="Goodreads page for Life of Pi by Yann Martel, showing the book cover, title, author, 3.94 star rating from 1.7 million ratings, description, genres, 460 pages paperback, and publication date"
            class="w-full"
          />
        </div>
      </div>

      <!-- Annotated breakdown -->
      <div>
        <div class="mb-1 flex items-center gap-2">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">What a search engine reads (schema.org)</span>
          <button
            onclick={() => (showAnnotations = !showAnnotations)}
            class="text-[10px] text-blue-500 hover:text-blue-700 dark:text-blue-400"
          >
            {showAnnotations ? "collapse" : "expand"}
          </button>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          {#each annotations as group}
            <div class="mb-3">
              <div class="flex items-center gap-2">
                <span class="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  {group.label}
                </span>
                <span class="text-[10px] text-gray-400 dark:text-gray-500">{group.detail}</span>
              </div>
              {#if showAnnotations}
                <div class="mt-2 space-y-1.5">
                  {#each group.items as item}
                    <div class="flex items-start gap-2 rounded-md bg-gray-50 px-3 py-1.5 dark:bg-gray-900/50">
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-1.5">
                          <code class="text-xs font-bold text-purple-700 dark:text-purple-400">{item.property}</code>
                          <span class="text-[10px] text-gray-400 dark:text-gray-500">({item.source})</span>
                        </div>
                        <div class="mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span class="text-xs text-gray-700 dark:text-gray-300">{item.value}</span>
                          <span class="rounded bg-gray-200 px-1 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">{item.valueType}</span>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
          <p class="mt-2 text-[10px] text-gray-400 dark:text-gray-500">
            Notice how <code class="text-[10px]">author</code> and <code class="text-[10px]">aggregateRating</code> have
            Types as values, not just simple text — types can nest inside other types!
          </p>
        </div>
      </div>
    </div>

    <!-- Actual JSON-LD from Goodreads -->
    <div class="mt-4">
      <div class="mb-1 flex items-center gap-2">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">The actual JSON-LD embedded in the Goodreads page</span>
        <span class="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">Real data</span>
      </div>
      <pre
        class="max-h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >{goodreadsJsonLd}</pre>
      <p class="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
        This is hidden in the HTML source — invisible to readers, but Google, Bing, and other search engines parse it
        to power rich results (star ratings, author info, etc. in search results).
      </p>
    </div>
  </div>

  <!-- Embedding Methods -->
  <div class="mt-8">
    <h4 class="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">How Structured Data Gets Into Pages</h4>
    <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
      There are two main approaches to embedding schema.org data. We'll compare them using the
      same <em>Life of Pi</em> data:
    </p>
  </div>

  <!-- JSON-LD Section -->
  <div class="mt-4">
    <h4 class="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">JSON-LD: Data as a Separate Block</h4>
    <p class="mb-3 text-sm text-gray-700 dark:text-gray-300">
      JSON-LD (JSON for Linked Data) embeds structured data in a
      <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">&lt;script type="application/ld+json"&gt;</code>
      tag. The browser ignores it — but search engines read it. It uses
      <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">@context</code> to declare the vocabulary
      and <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">@type</code> to declare the schema.org type.
    </p>
    <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
      Key advantages: separate from HTML, machine-readable, easy to generate from templates or APIs,
      and <strong>Google's recommended format</strong>.
    </p>
  </div>

  <!-- RDFa Section -->
  <div class="mt-4">
    <h4 class="mb-2 text-base font-bold text-gray-900 dark:text-gray-100">RDFa: Data Woven into HTML</h4>
    <p class="mb-3 text-sm text-gray-700 dark:text-gray-300">
      RDFa (Resource Description Framework in Attributes) adds structured data directly to HTML elements
      using attributes like
      <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">vocab</code>,
      <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">typeof</code>, and
      <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">property</code>.
      The markup <em>is</em> the data — what users see and what machines read come from the same elements.
    </p>
    <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
      Key advantages: no duplication of content, data stays in sync with what's displayed,
      and the structure is visible in the page itself.
    </p>
  </div>

  <!-- Side-by-side code comparison -->
  <div class="mt-6">
    <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Side-by-Side: Same Data, Two Formats</h4>
    <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
      Both examples describe <em>Life of Pi</em> using schema.org. Notice how the same information
      is represented differently:
    </p>
    <div class="grid gap-4 lg:grid-cols-2">
      <div>
        <div class="mb-1 flex items-center gap-2">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">JSON-LD</span>
          <span class="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">Recommended</span>
        </div>
        <pre
          class="h-72 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >{jsonLdExample}</pre>
      </div>
      <div>
        <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">RDFa</div>
        <pre
          class="h-72 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >{rdfaExample}</pre>
      </div>
    </div>
  </div>

  <!-- Comparison table -->
  <div class="mt-6">
    <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Comparison</h4>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400"></th>
            <th class="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">JSON-LD</th>
            <th class="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">RDFa</th>
          </tr>
        </thead>
        <tbody>
          {#each comparisonRows as row}
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td class="py-2 pr-4 text-xs font-medium text-gray-700 dark:text-gray-300">{row.aspect}</td>
              <td class="py-2 pr-4 text-xs text-gray-600 dark:text-gray-400">{row.jsonld}</td>
              <td class="py-2 text-xs text-gray-600 dark:text-gray-400">{row.rdfa}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Google recommendation callout -->
  <div class="mt-6 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
    <p class="text-sm text-gray-700 dark:text-gray-300">
      <strong>Google's recommendation:</strong> "Google recommends using JSON-LD for structured data
      whenever possible." JSON-LD is easier to implement, doesn't require modifying HTML, and is the
      most commonly tested format in Google's tools. However, all three formats (JSON-LD, RDFa,
      Microdata) are supported.
    </p>
  </div>

  <!-- Microdata expandable — what Goodreads actually uses -->
  <div class="mt-4">
    <button
      onclick={() => (showMicrodata = !showMicrodata)}
      class="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    >
      <span class="transition-transform {showMicrodata ? 'rotate-90' : ''}">&rsaquo;</span>
      What about Microdata? (Third approach — what Goodreads used to use)
    </button>
    {#if showMicrodata}
      <div class="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <p class="mb-2 text-sm text-gray-700 dark:text-gray-300">
          <strong>Microdata</strong> is a third approach that uses
          <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">itemscope</code>,
          <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">itemtype</code>, and
          <code class="rounded bg-gray-200 px-1 text-xs dark:bg-gray-700">itemprop</code>
          attributes on HTML elements. It's similar to RDFa but with simpler, HTML5-native syntax.
          Goodreads historically used Microdata before switching to JSON-LD:
        </p>
        <pre class="overflow-auto rounded-lg bg-white p-3 text-sm dark:bg-gray-900 dark:text-gray-300">{`<div itemscope itemtype="https://schema.org/Book">
  <h1 itemprop="name">Life of Pi</h1>
  <span itemprop="author" itemscope
        itemtype="https://schema.org/Person">
    by <a itemprop="name"
          href="/author/show/811">Yann Martel</a>
  </span>
  <span itemprop="bookFormat">Paperback</span>,
  <span itemprop="numberOfPages">460</span> pages
</div>`}</pre>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Microdata was HTML5's native approach to structured data. It's still supported by search engines
          but has been largely superseded by JSON-LD for new implementations.
        </p>
      </div>
    {/if}
  </div>

</section>
