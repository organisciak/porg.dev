<script lang="ts">
  import ExerciseTimer from "$lib/teaching/ExerciseTimer.svelte";
  import { projects } from "$lib/teaching/dmp-projects";

  const STORAGE_KEY = "lis4220-dmp-applied";

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

  const questions = [
    {
      key: "products",
      label: "What datasets, code, or digital products will the project produce?",
    },
    {
      key: "form",
      label: "What form will the data exist in?",
      hint: "e.g. text, spreadsheets, surveys, images, audio, sensor readings, code...",
    },
    {
      key: "capture",
      label: "How might the data be captured?",
      hint: "Think about instruments, apps, manual entry, scraping, etc.",
    },
    {
      key: "size",
      label: "How big is the data?",
      hint: "Order of magnitude: megabytes, gigabytes, terabytes? How many records?",
    },
    {
      key: "preexisting",
      label: "What is the relationship of the data to pre-existing data?",
      hint: "Does it extend, complement, or replace existing datasets?",
    },
    {
      key: "formats",
      label: "What file formats would preserve the data?",
      hint: "Think about the format principles: non-proprietary, open, standard.",
    },
    {
      key: "distribution",
      label: "Where would the data be distributed?",
      hint: "What repository? Domain-specific or general-purpose? Any access restrictions?",
    },
    {
      key: "responsibility",
      label: "Who would be responsible for the preservation and redistribution of the data?",
      hint: "During the project? After it ends? What happens when the PI moves on?",
    },
    {
      key: "uses",
      label: "What are the foreseeable uses of the data?",
      hint: "Beyond the original research — who else might want this data, and why?",
    },
  ];

  let currentProject = $state(loadState("currentProject", 0));
  $effect(() => { saveState("currentProject", currentProject); });

  function shuffleProject() {
    let next;
    do {
      next = Math.floor(Math.random() * projects.length);
    } while (next === currentProject && projects.length > 1);
    currentProject = next;
  }

  function prevProject() {
    currentProject = (currentProject - 1 + projects.length) % projects.length;
  }

  function nextProject() {
    currentProject = (currentProject + 1) % projects.length;
  }

  let answers = $state<Record<string, string>>(
    loadState("answers", Object.fromEntries(questions.map(q => [q.key, ""]))),
  );
  $effect(() => { saveState("answers", answers); });
</script>

<!-- Intro -->
<div class="mb-6">
  <p class="mb-3 text-sm text-gray-700 dark:text-gray-300">
    In the previous DMP exercise, you thought about data management at a high level using Michener's 10 Rules.
    Now let's get specific: the questions below are the kind you'd encounter on an actual DMP form
    from a funder like NSF or NIH.
  </p>
  <div class="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
    <p class="text-sm text-gray-700 dark:text-gray-300">
      Read the project abstract below. Given the limited information, you'll have to make
      reasonable assumptions &mdash; that's part of the exercise. Real DMPs require the same kind
      of informed speculation early in a project.
    </p>
  </div>
</div>

<!-- Exercise -->
<div class="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
  <h4 class="mb-1 text-base font-bold text-gray-900 dark:text-gray-100">
    Exercise: Practical DMP Questions
  </h4>
  <ExerciseTimer phases={[{ label: "Read & answer", minutes: 12 }, { label: "Compare with group", minutes: 5 }]}>

  <!-- Project selector -->
  <div class="mb-5">
    <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div class="mb-2 flex items-start justify-between gap-3">
        <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">
          {projects[currentProject].title}
        </h5>
        <button
          onclick={shuffleProject}
          class="shrink-0 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Show another random project"
        >
          <svg class="mr-1 inline h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="4" y1="20" x2="21" y2="3"></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
          Shuffle
        </button>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {projects[currentProject].abstract}
      </p>
      <div class="mt-3 flex items-center justify-between">
        <button
          onclick={prevProject}
          class="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >&larr; Previous</button>
        <span class="text-xs text-gray-400 dark:text-gray-500">
          Project {currentProject + 1} of {projects.length}
        </span>
        <button
          onclick={nextProject}
          class="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >Next &rarr;</button>
      </div>
    </div>
  </div>

  <!-- Questions -->
  <div class="space-y-3">
    {#each questions as q, i}
      <div class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {i + 1}. {q.label}
        </div>
        {#if q.hint}
          <div class="mb-2 text-xs text-gray-500 italic dark:text-gray-400">{q.hint}</div>
        {/if}
        <textarea
          bind:value={answers[q.key]}
          placeholder="Your answer..."
          class="h-16 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        ></textarea>
      </div>
    {/each}
  </div>

  <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">Your work is saved automatically in your browser.</p>
  </ExerciseTimer>
</div>
