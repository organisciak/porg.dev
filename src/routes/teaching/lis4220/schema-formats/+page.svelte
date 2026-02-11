<script lang="ts">
  import SchemaExplorer from "$lib/teaching/SchemaExplorer.svelte";
  import JsonPlayground from "$lib/teaching/JsonPlayground.svelte";
  import DmpScaffold from "$lib/teaching/DmpScaffold.svelte";

  let activeModule: "schema" | "formats" | "dmp" = $state("schema");
</script>

<svelte:head>
  <title>Schema, Formats & DMPs | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Interactive activities for Schema.org, data formats, and data management plans."
  />
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-8">
  <!-- Page Header -->
  <div class="mb-8">
    <h1
      class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
    >
      Schema, Formats &amp; Data Management Plans
    </h1>
    <p class="text-base text-gray-600 dark:text-gray-400">
      LIS 4220: Data Curation &middot; Week 5 Activities
    </p>
  </div>

  <!-- Module Navigation -->
  <nav
    class="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-gray-800"
  >
    {#each [
      { id: "schema" as const, label: "A: Schema.org Explorer", time: "~40 min" },
      { id: "formats" as const, label: "B: Format Playground", time: "~30 min" },
      { id: "dmp" as const, label: "C: DMP Quick-Plan", time: "~30 min" },
    ] as mod}
      <button
        class="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap {activeModule ===
        mod.id
          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100'
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
        onclick={() => (activeModule = mod.id)}
      >
        {mod.label}
        <span class="ml-1 text-xs text-gray-400 dark:text-gray-500">{mod.time}</span>
      </button>
    {/each}
  </nav>

  <!-- Module Content -->
  {#if activeModule === "schema"}
    <section class="prose prose-gray max-w-none dark:prose-invert">
      <h2 class="text-xl">Module A: Schema.org Explorer</h2>

      <p>
        <a href="https://schema.org" target="_blank" rel="noopener noreferrer">Schema.org</a>
        is a collaborative vocabulary for describing entities on the web. It was created by Google,
        Microsoft, Yahoo, and Yandex to help search engines understand web content.
      </p>

      <p>
        Schema.org is built around three key concepts:
      </p>
      <ul>
        <li><strong>Types</strong> &mdash; What kind of thing is it? (e.g. Book, Person, Event). Types are organized in a hierarchy: a <em>Restaurant</em> is a type of <em>LocalBusiness</em>, which is a type of <em>Organization</em>, which is a type of <em>Thing</em>.</li>
        <li><strong>Properties</strong> &mdash; What attributes can it have? Properties are inherited from parent types. A Book has <code>isbn</code> (specific to Book) but also <code>name</code> (inherited from Thing).</li>
        <li><strong>Values</strong> &mdash; What are those attributes set to? Values can be basic data types (Text, Number, Boolean, Date) or other schema.org types (e.g. the <code>author</code> property expects a <code>Person</code>).</li>
      </ul>

      <p>
        Why does this matter for data curation? Schema.org provides a <strong>shared vocabulary</strong> for describing data.
        Rather than every organization inventing their own field names, schema.org gives us a common language that both humans and machines can understand.
      </p>

      <h3>Explore the Types</h3>
      <p>Click a type below to see its properties, hierarchy, and expected value types.</p>
    </section>

    <div class="mt-6">
      <SchemaExplorer />
    </div>
  {:else if activeModule === "formats"}
    <section class="prose prose-gray max-w-none dark:prose-invert">
      <h2 class="text-xl">Module B: Format Playground</h2>

      <p>
        A <strong>file format</strong> is the way that information is encoded into a computer file.
        How is that different from a <strong>schema</strong>?
      </p>

      <p>
        Think of it like the
        <a href="https://cuberule.com/" target="_blank" rel="noopener noreferrer">"Cube Rule of Food"</a>:
        a taco and a hot dog have the same <em>format</em> (starch on three sides), but very different
        <em>content and expectations</em>. Similarly, JSON and XML are formats &mdash; containers for data &mdash;
        while schema.org is a schema that tells you what to put inside.
      </p>

      <p>When choosing a format, prefer formats that are:</p>
      <ul>
        <li><strong>Non-proprietary</strong> &mdash; the specification for reading the file is public and known</li>
        <li><strong>Open</strong> &mdash; the format is documented, and anybody has permission to use it</li>
        <li><strong>Standard</strong> &mdash; the target community uses the format</li>
      </ul>

      <h3>JSON (JavaScript Object Notation)</h3>
      <p>
        JSON is a lightweight, text-based format for structured data. It's human-readable and widely
        supported. Let's explore its building blocks and try writing some.
      </p>
    </section>

    <div class="mt-6">
      <JsonPlayground />
    </div>
  {:else if activeModule === "dmp"}
    <section class="prose prose-gray max-w-none dark:prose-invert">
      <h2 class="text-xl">Module C: DMP Quick-Plan</h2>

      <p>
        A <strong>Data Management Plan</strong> anticipates the future of your data. It's a living
        document that addresses how data will be collected, organized, documented, stored, shared,
        and preserved throughout a research project.
      </p>

      <p>
        The emphasis is on <em>plan</em>: DMPs exist to anticipate challenges to
        <strong>findable, accessible, interoperable, reusable</strong> (FAIR) data before they happen.
        Different funders (NSF, NIH, IMLS, NEH) have different requirements &mdash; always follow their format!
      </p>
    </section>

    <div class="mt-6">
      <DmpScaffold />
    </div>
  {/if}
</div>
