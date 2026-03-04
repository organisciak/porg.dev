<script lang="ts">
  import ExerciseTimer from "$lib/teaching/ExerciseTimer.svelte";

  const STORAGE_KEY = "lis4220-data-reporting";

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
    } catch {
      /* quota exceeded */
    }
  }

  const datasetCases = [
    {
      id: "forrest-gump",
      title: "Lies, irony, and contradiction in Forrest Gump",
      summary:
        "Movie annotations by multiple coders for semantic conflict events (lies, irony, sarcasm), with frequency and inter-observer reliability.",
      source: "https://f1000research.com/articles/5-2375/v1",
      audienceHint: "Cognitive science researchers, annotation methodologists, digital humanists",
    },
    {
      id: "uk-apc",
      title: "Article Processing Charges paid by UK universities (2014)",
      summary:
        "6,943 APC records from 25 institutions. Aggregated and normalized CSV focused on open access spending patterns.",
      source: "https://openhumanitiesdata.metajnl.com/articles/10.5334/johd.2/",
      audienceHint: "Research administrators, OA policy teams, budgeting analysts",
    },
    {
      id: "wifi-fingerprint",
      title: "Wi-Fi crowdsourced fingerprinting for indoor positioning",
      summary:
        "4,648 fingerprints from 21 devices collected in a university building for positioning benchmarks. Openly released with software.",
      source: "http://www.mdpi.com/2306-5729/2/4/32",
      audienceHint: "ML researchers, indoor navigation engineers, reproducibility reviewers",
    },
    {
      id: "amazon-reviews",
      title: "Amazon product review data",
      summary:
        "Large-scale product reviews with user/product metadata, ratings, and review text over 18 years, with known duplicate product caveats.",
      source: "https://snap.stanford.edu/data/web-Amazon.html",
      audienceHint: "NLP researchers, recommendation system teams, market analysts",
    },
    {
      id: "reddit-pizza",
      title: "Reddit Random Acts of Pizza requests",
      summary:
        "5,671 textual requests with known outcomes and metadata (votes, account age, edits, comments) for success analysis.",
      source: "https://snap.stanford.edu/data/web-RedditPizzaRequests.html",
      audienceHint: "Social computing researchers, causal inference classes, ethics reviewers",
    },
  ] as const;

  let currentCase = $state(loadState("currentCase", 0));
  $effect(() => {
    saveState("currentCase", currentCase);
  });

  function shuffleCase() {
    let next = currentCase;
    if (datasetCases.length < 2) return;
    while (next === currentCase) {
      next = Math.floor(Math.random() * datasetCases.length);
    }
    currentCase = next;
  }

  function prevCase() {
    currentCase = (currentCase - 1 + datasetCases.length) % datasetCases.length;
  }

  function nextCase() {
    currentCase = (currentCase + 1) % datasetCases.length;
  }

  let notes = $state<Record<string, string>>(
    loadState("notes", {
      userStory1: "",
      userStory2: "",
      userStory3: "",
      summaryStats: "",
      visualPlan: "",
      validityChecks: "",
      risks: "",
      shareout: "",
    }),
  );
  $effect(() => {
    saveState("notes", notes);
  });
</script>

<div class="mb-6">
  <p class="mb-3 text-sm text-gray-700 dark:text-gray-300">
    Reporting is where data curation decisions become visible. This activity starts with audience
    and use case, then works toward appropriate summaries, visualizations, and risk framing.
  </p>
  <div
    class="mt-3 rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800 dark:bg-purple-900/20"
  >
    <p class="text-sm text-gray-700 dark:text-gray-300">
      Do the
      <a
        href="/teaching/lis4220/visualization"
        class="text-blue-600 hover:underline dark:text-blue-400"
      >
        Visualization module
      </a>
      first, then bring your chart rationale here.
    </p>
  </div>
</div>

<div
  class="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20"
>
  <h4 class="mb-1 text-base font-bold text-gray-900 dark:text-gray-100">
    Exercise: Planning Data Reporting
  </h4>
  <ExerciseTimer
    phases={[
      { label: "Pick case", minutes: 2 },
      { label: "Plan report", minutes: 9 },
      { label: "Share out", minutes: 4 },
    ]}
  >
    <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
      Use the prompts below to design a reporting strategy for one dataset. Prioritize clarity,
      validity, and audience fit over "fancy" visuals.
    </p>

    <div
      class="mb-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="mb-2 flex items-start justify-between gap-3">
        <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">
          {datasetCases[currentCase].title}
        </h5>
        <button
          onclick={shuffleCase}
          class="shrink-0 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Show another random dataset case"
        >
          Shuffle
        </button>
      </div>

      <p class="text-sm text-gray-600 dark:text-gray-400">
        {datasetCases[currentCase].summary}
      </p>
      <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
        <strong>Likely audiences:</strong>
        {datasetCases[currentCase].audienceHint}
      </p>
      <a
        href={datasetCases[currentCase].source}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 inline-block text-xs text-blue-600 hover:underline dark:text-blue-400"
      >
        Source dataset and documentation
      </a>
      <div class="mt-3 flex items-center justify-between">
        <button
          onclick={prevCase}
          class="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >&larr; Previous</button
        >
        <span class="text-xs text-gray-400 dark:text-gray-500">
          Case {currentCase + 1} of {datasetCases.length}
        </span>
        <button
          onclick={nextCase}
          class="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >Next &rarr;</button
        >
      </div>
    </div>

    <div
      class="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
    >
      <h5 class="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
        1) User stories (write 2-3)
      </h5>
      <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
        Pattern: <em>As a [role], I want [something], so that [benefit].</em>
      </p>
      <div class="space-y-2">
        <textarea
          bind:value={notes.userStory1}
          placeholder="As a ..., I want ..., so that ..."
          class="h-14 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        ></textarea>
        <textarea
          bind:value={notes.userStory2}
          placeholder="As a ..., I want ..., so that ..."
          class="h-14 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        ></textarea>
        <textarea
          bind:value={notes.userStory3}
          placeholder="Optional third user story"
          class="h-14 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        ></textarea>
      </div>
    </div>

    <div class="mb-4 grid gap-3 md:grid-cols-2">
      <div
        class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <label>
          <span class="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">
            2) Summary statistics to include
          </span>
          <textarea
            bind:value={notes.summaryStats}
            placeholder="Counts, rates, central tendency, spread, confidence intervals..."
            class="h-24 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          ></textarea>
        </label>
      </div>
      <div
        class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <label>
          <span class="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">
            3) Visualization plan
          </span>
          <textarea
            bind:value={notes.visualPlan}
            placeholder="Which chart(s), for which audience question, and why?"
            class="h-24 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          ></textarea>
        </label>
      </div>
    </div>

    <div class="mb-4 grid gap-3 md:grid-cols-2">
      <div
        class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <label>
          <span class="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">
            4) Validity checks before interpretation
          </span>
          <textarea
            bind:value={notes.validityChecks}
            placeholder="Missingness? Sampling bias? Measurement drift? Inter-coder reliability? Duplicates?"
            class="h-24 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          ></textarea>
        </label>
      </div>
      <div
        class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <label>
          <span class="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">
            5) Risks and limitations to disclose
          </span>
          <textarea
            bind:value={notes.risks}
            placeholder="Possible misuse, representational limits, ethical/legal constraints..."
            class="h-24 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          ></textarea>
        </label>
      </div>
    </div>

    <div
      class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
    >
      <label>
        <span class="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">
          Share-out draft (30-45 second report summary)
        </span>
        <textarea
          bind:value={notes.shareout}
          placeholder="Audience, key finding, chosen chart, one caveat."
          class="h-20 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        ></textarea>
      </label>
    </div>

    <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">
      Your work is saved automatically in your browser.
    </p>
  </ExerciseTimer>
</div>
