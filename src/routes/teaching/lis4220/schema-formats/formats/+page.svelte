<script lang="ts">
  import JsonPlayground from "$lib/teaching/JsonPlayground.svelte";
  import ExerciseTimer from "$lib/teaching/ExerciseTimer.svelte";

  const STORAGE_KEY = "lis4220-format-chooser";

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

  const categories = [
    { key: "image", label: "Image", placeholder: "What image formats would you recommend?" },
    { key: "text", label: "Text", placeholder: "What text/document formats?" },
    { key: "audio", label: "Audio", placeholder: "What audio formats?" },
    { key: "containers", label: "Containers", placeholder: "Formats for bundling files together?" },
    { key: "databases", label: "Databases", placeholder: "How would you export/share database data?" },
  ] as const;

  const answers: Record<string, { formats: string; note?: string }> = {
    image: { formats: "JPEG, JPEG 2000, PNG, TIFF" },
    text: { formats: "Plain text (.txt), HTML, XML, PDF/A" },
    audio: { formats: "AIFF, WAVE" },
    containers: { formats: "TAR, GZIP, ZIP" },
    databases: { formats: "XML or CSV", note: "Prefer these over native binary database formats for interoperability" },
  };

  let formatChoices = $state<Record<string, string>>(
    loadState("choices", { image: "", text: "", audio: "", containers: "", databases: "" }),
  );
  $effect(() => { saveState("choices", formatChoices); });

  let showAnswers = $state(false);
</script>

<svelte:head>
  <title>Formats | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Interactive activities for JSON, XML, CSV, and other data formats."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h2 class="text-xl">Module B: Formats</h2>

  <p>
    A <strong>file format</strong> is the way that information is encoded into a computer file. How is
    that different from a <strong>schema</strong>?
  </p>

  <p>
    Think of it like the
    <a href="https://cuberule.com/" target="_blank" rel="noopener noreferrer">"Cube Rule of Food"</a
    >: all dishes can be classified by where the starch goes. A hot dog and a taco have the same
    <em>format</em> (starch on three sides) &mdash; but nobody would confuse the two. The format is
    the <em>container</em>; the content and expectations are separate.
  </p>
</section>

<figure class="my-6">
  <a href="https://cuberule.com/" target="_blank" rel="noopener noreferrer">
    <img
      src="/teaching/cube-rule.png"
      alt="The Cube Rule of Food: classifying dishes by where the starch is. Toast (bottom), Sandwich (top and bottom), Taco (bottom and sides), Sushi (three sides), Quiche/Bread Bowl (four sides), Calzone (all six sides)."
      class="mx-auto max-w-2xl rounded-lg border border-gray-200 shadow-sm dark:border-gray-700"
    />
  </a>
  <figcaption class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
    The Cube Rule of Food &mdash; classifying dishes by starch location.
    <a href="https://cuberule.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">cuberule.com</a>
  </figcaption>
</figure>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h3>Choosing a Format</h3>
  <p>When choosing a format, prefer formats that are:</p>
  <ul>
    <li>
      <strong>Non-proprietary</strong> &mdash; no single company controls the format; the specification
      for reading and writing it is publicly available
    </li>
    <li>
      <strong>Open</strong> &mdash; anyone is legally permitted to use the format without licensing
      fees or restrictions (a format can be publicly documented yet still require a license to use)
    </li>
    <li><strong>Standard</strong> &mdash; the target community uses the format</li>
  </ul>
</section>

<!-- Choosing Appropriate Formats Exercise -->
<div class="mt-6 mb-8 rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
  <h4 class="mb-1 text-base font-bold text-gray-900 dark:text-gray-100">
    Exercise: Choosing Appropriate Formats
  </h4>
  <ExerciseTimer phases={[{ label: "Brainstorm", minutes: 3 }, { label: "Reveal & compare", minutes: 3 }]}>
    <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
      Based on <strong>what you already know</strong>, for each type of data below, what format(s) would
      you recommend for <strong>long-term preservation and sharing</strong>? Don't worry about getting
      the "right" answer &mdash; just use your best intuition. We'll compare with expert recommendations after.
    </p>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {#each categories as cat}
        <div>
          <label>
            <span class="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">{cat.label}</span>
            <input
              type="text"
              bind:value={formatChoices[cat.key]}
              placeholder={cat.placeholder}
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-800"
            />
          </label>
        </div>
      {/each}
    </div>

    <div class="mt-4">
      <button
        onclick={() => (showAnswers = !showAnswers)}
        class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <span class="transition-transform {showAnswers ? 'rotate-90' : ''}">&rsaquo;</span>
        {showAnswers ? "Hide" : "Reveal"} recommended formats
      </button>
    </div>

    {#if showAnswers}
      <div class="mt-4 rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <h5 class="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
          Examples of Preferred Format Choices
        </h5>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {#each categories as cat}
            <div class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">{cat.label}</div>
              <div class="mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                {answers[cat.key].formats}
              </div>
              {#if answers[cat.key].note}
                <div class="mt-1 text-xs text-gray-500 italic dark:text-gray-400">{answers[cat.key].note}</div>
              {/if}
            </div>
          {/each}
        </div>

        <p class="mt-3 text-sm text-gray-700 dark:text-gray-300">
          How do your choices compare? Look up any unfamiliar formats at
          <a href="http://fileformats.archiveteam.org" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">fileformats.archiveteam.org</a>
          or <a href="https://www.wikipedia.org" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline dark:text-blue-400">Wikipedia</a>.
        </p>

        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <em>Source: Data Management General Guidance, DMPTool</em>
        </p>
      </div>

      <div class="mt-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          <strong>Key takeaway:</strong> Remembering the exact recommended formats matters less than knowing
          <em>what to look for</em> &mdash; non-proprietary, open, and standard. The internet is a great reference,
          if you know to check!
        </p>
      </div>
    {/if}

    <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">Your notes are saved automatically in your browser.</p>
  </ExerciseTimer>
</div>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <h3>JSON (JavaScript Object Notation)</h3>
  <p>
    JSON is a lightweight, text-based format for structured data. It's human-readable and widely
    supported. Let's explore its building blocks and try writing some.
  </p>
</section>

<div class="mt-6">
  <JsonPlayground />
</div>

<!-- Vocabulary Ladder (after students have worked with JSON, XML, JSON-LD) -->
<section class="prose prose-gray mt-10 max-w-none dark:prose-invert">
  <h3>Putting It All Together: Format vs. Schema</h3>
</section>

<div class="my-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
  <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Format</div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">JSON</div>
    <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
      A general-purpose data format &mdash; curly braces, key-value pairs, arrays.
      Defines <em>how</em> data is written, not what it means.
    </p>
  </div>
  <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Format + Linking</div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">JSON-LD</div>
    <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
      JSON for Linked Data. Still valid JSON, but adds <code class="text-[10px]">@context</code> and
      <code class="text-[10px]">@type</code> so machines know what the data <em>means</em>.
    </p>
  </div>
  <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Schema</div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Schema.org</div>
    <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
      A shared vocabulary of types and properties (<em>Person</em>, <em>name</em>, <em>Book</em>, <em>author</em>).
      The agreed-upon dictionary that gives JSON-LD its meaning.
    </p>
  </div>
  <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Concept</div>
    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">A schema</div>
    <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
      Any structured plan for organizing information &mdash; Dublin Core, DDI, MARC, or Schema.org.
      The <em>blueprint</em> that says what fields exist and what they mean.
    </p>
  </div>
</div>

<div class="mb-8 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
  <p class="text-sm text-gray-700 dark:text-gray-300">
    <strong>In short:</strong> JSON and XML are <em>formats</em> (containers). Schema.org is a <em>schema</em>
    (vocabulary). JSON-LD is a format that carries schema-based meaning. You can explore how schemas
    and formats work together in
    <a href="./schema" class="text-blue-600 hover:underline dark:text-blue-400">Module A: Schema.org</a>,
    including how JSON-LD and RDFa embed structured data into web pages.
  </p>
</div>
