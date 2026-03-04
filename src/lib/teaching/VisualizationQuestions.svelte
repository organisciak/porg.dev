<script lang="ts">
  import ExerciseTimer from "$lib/teaching/ExerciseTimer.svelte";

  const STORAGE_KEY = "lis4220-visualization-questions";

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

  const scenarios = [
    {
      id: "apc-compare",
      datasetTitle: "Article Processing Charges Paid by 25 UK Universities in 2014",
      source: "https://openhumanitiesdata.metajnl.com/articles/10.5334/johd.2/",
      abstract:
        "6,943 APC records from 25 higher-education institutions in the UK (2014), released as an aggregated and normalized CSV.",
      prompt: "Compare APC spending across universities in a single year.",
      context: "Audience: policy and budget stakeholders.",
      suggested: "Bar chart",
      why: "Clear categorical comparisons across institutions.",
    },
    {
      id: "pizza-trend",
      datasetTitle: "Web Data: Reddit Pizza Requests",
      source: "https://snap.stanford.edu/data/web-RedditPizzaRequests.html",
      abstract:
        "5,671 request posts from r/Random_Acts_Of_Pizza with known outcomes and metadata such as votes, account age, and comment activity.",
      prompt: "Show monthly success rates of pizza requests.",
      context: "Audience: community moderators.",
      suggested: "Line chart",
      why: "Best for temporal trend and turning points.",
    },
    {
      id: "amazon-distribution",
      datasetTitle: "Amazon Product Data",
      source: "https://snap.stanford.edu/data/web-Amazon.html",
      abstract:
        "Large-scale Amazon review data spanning about 18 years with product/user metadata, ratings, and review text; includes known duplicate caveats.",
      prompt: "Show the distribution of review scores.",
      context: "Audience: recommendation system team.",
      suggested: "Histogram",
      why: "Shows skew, spread, and concentration in ratings.",
    },
    {
      id: "pizza-relationship",
      datasetTitle: "Kaggle: New York City Airbnb Open Data",
      source: "https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data",
      abstract:
        "NYC Airbnb listing data (2019) with neighborhood, room type, price, reviews, and availability features used for exploratory analysis and prediction.",
      prompt: "Relate neighborhood and room type to listing price and show outliers.",
      context: "Audience: housing and urban policy researchers.",
      suggested: "Scatter plot",
      why: "Supports association inspection and outlier checks.",
    },
    {
      id: "netflix-trend",
      datasetTitle: "Kaggle: Netflix Movies and TV Shows",
      source: "https://www.kaggle.com/datasets/shivamb/netflix-shows",
      abstract:
        "Catalog of Netflix titles with fields such as type, country, release year, rating, duration, and listed genres.",
      prompt: "Show how title counts change by release year, split by movie vs TV show.",
      context: "Audience: content strategy team.",
      suggested: "Line chart",
      why: "Time-series by category makes change over time and divergence visible.",
    },
  ] as const;

  const chartOptions = [
    "Bar chart",
    "Line chart",
    "Histogram",
    "Scatter plot",
    "Box plot",
    "Heatmap",
    "Map",
    "Stacked bar chart",
    "Table only",
  ] as const;

  const scenarioFallback = Object.fromEntries(
    scenarios.map((scenario) => [scenario.id, { chart: "", why: "" }]),
  ) as Record<string, { chart: string; why: string }>;

  const savedScenarioAnswers = loadState<Record<string, { chart?: string; why?: string }>>(
    "scenarioAnswers",
    {},
  );

  const normalizedScenarioAnswers = Object.fromEntries(
    scenarios.map((scenario) => {
      const saved = savedScenarioAnswers[scenario.id];
      return [
        scenario.id,
        {
          chart: saved?.chart ?? "",
          why: saved?.why ?? "",
        },
      ];
    }),
  ) as Record<string, { chart: string; why: string }>;

  let scenarioAnswers = $state<Record<string, { chart: string; why: string }>>(
    Object.keys(savedScenarioAnswers).length ? normalizedScenarioAnswers : scenarioFallback,
  );
  $effect(() => {
    saveState("scenarioAnswers", scenarioAnswers);
  });

  let showSuggestions = $state(false);

  let defenseNote = $state(loadState("defenseNote", ""));
  let riskNote = $state(loadState("riskNote", ""));
  $effect(() => {
    saveState("defenseNote", defenseNote);
  });
  $effect(() => {
    saveState("riskNote", riskNote);
  });
</script>

<div class="mb-6">
  <p class="mb-3 text-sm text-gray-700 dark:text-gray-300">
    Before reporting, you need defensible chart choices. This module focuses on selecting a visual
    by analytical task, then defending that choice with audience and validity in mind.
  </p>
</div>

<div
  class="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20"
>
  <h4 class="mb-1 text-base font-bold text-gray-900 dark:text-gray-100">
    Exercise: Visualization Questions
  </h4>
  <ExerciseTimer
    phases={[
      { label: "Scenario matching", minutes: 10 },
      { label: "Defend choices", minutes: 5 },
    ]}
  >
    <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
      Choose a chart for each case, justify it, and prepare to defend your reasoning.
    </p>

    <div class="mb-4 space-y-3">
      {#each scenarios as scenario}
        <div
          class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
        >
          <div
            class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
          >
            {scenario.datasetTitle}
          </div>
          <a
            href={scenario.source}
            target="_blank"
            rel="noopener noreferrer"
            class="mb-1 inline-block text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            Dataset link
          </a>
          <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
            <strong>Abstract:</strong>
            {scenario.abstract}
          </p>
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {scenario.prompt}
          </div>
          <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">{scenario.context}</p>
          <div class="grid gap-2 md:grid-cols-2">
            <div>
              <label
                for={`chart-${scenario.id}`}
                class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Choose chart type
              </label>
              <select
                id={`chart-${scenario.id}`}
                bind:value={scenarioAnswers[scenario.id].chart}
                class="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select one</option>
                {#each chartOptions as chart}
                  <option value={chart}>{chart}</option>
                {/each}
              </select>
            </div>
            <div>
              <label
                for={`why-${scenario.id}`}
                class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Why does it fit?
              </label>
              <input
                id={`why-${scenario.id}`}
                type="text"
                bind:value={scenarioAnswers[scenario.id].why}
                placeholder="One-sentence rationale"
                class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          {#if showSuggestions}
            <p class="mt-2 text-xs text-green-700 dark:text-green-300">
              Suggested match: <strong>{scenario.suggested}</strong>. {scenario.why}
            </p>
          {/if}
        </div>
      {/each}
    </div>

    <button
      onclick={() => (showSuggestions = !showSuggestions)}
      class="mb-4 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      {showSuggestions
        ? "Hide suggested matches"
        : "Reveal suggested matches (only after the conversation!)"}
    </button>

    <div class="grid gap-3 md:grid-cols-2">
      <div
        class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <label
          for="defense-note"
          class="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100"
        >
          Defend one chart choice
        </label>
        <textarea
          id="defense-note"
          bind:value={defenseNote}
          placeholder="What would you say if someone challenged your choice?"
          class="h-20 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        ></textarea>
      </div>
      <div
        class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <label
          for="risk-note"
          class="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100"
        >
          Name one misleading alternative
        </label>
        <textarea
          id="risk-note"
          bind:value={riskNote}
          placeholder="Which chart would look dramatic but be less valid, and why?"
          class="h-20 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        ></textarea>
      </div>
    </div>

    <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">
      Your work is saved automatically in your browser.
    </p>
  </ExerciseTimer>
</div>
