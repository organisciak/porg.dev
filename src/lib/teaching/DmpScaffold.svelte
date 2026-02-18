<script lang="ts">
  import ExerciseTimer from "$lib/teaching/ExerciseTimer.svelte";
  import { projects } from "$lib/teaching/dmp-projects";

  const STORAGE_KEY = "lis4220-dmp-scaffold";

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

  const rules = [
    {
      num: 1,
      title: "Determine the Research Sponsor Requirements",
      prompt: "Who is funding this research? What are their data requirements?",
    },
    {
      num: 2,
      title: "Identify the Data to Be Collected",
      prompt: "What data will you collect or generate? What formats and volumes?",
    },
    {
      num: 3,
      title: "Define How the Data Will Be Organized",
      prompt: "How will files be named and structured? What directory hierarchy?",
    },
    {
      num: 4,
      title: "Explain How the Data Will Be Documented",
      prompt: "What metadata standards will you use? Will there be a data dictionary?",
    },
    {
      num: 5,
      title: "Describe How Data Quality Will Be Assured",
      prompt: "How will you validate data? What quality checks will you perform?",
    },
    {
      num: 6,
      title: "Present a Sound Data Storage and Preservation Strategy",
      prompt: "Where will data be stored? How many copies? What backup schedule?",
    },
    {
      num: 7,
      title: "Define the Project's Data Policies",
      prompt: "Who owns the data? What access restrictions apply? What license?",
    },
    {
      num: 8,
      title: "Describe How the Data Will Be Disseminated",
      prompt: "How will you share data? What repository? Any embargo periods?",
    },
    {
      num: 9,
      title: "Assign Roles and Responsibilities",
      prompt: "Who is responsible for data management? Who handles quality control?",
    },
    {
      num: 10,
      title: "Prepare a Realistic Budget",
      prompt: "What will data management cost? Storage, personnel, tools?",
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

  let ruleNotes = $state<Record<number, string>>(loadState("ruleNotes", {}));
  let projectDescription = $state(loadState("projectDescription", ""));

  $effect(() => { saveState("ruleNotes", ruleNotes); });
  $effect(() => { saveState("projectDescription", projectDescription); });
</script>

<!-- Intro -->
<div class="mb-6">
  <p class="mb-3 text-sm text-gray-700 dark:text-gray-300">
    A <strong>Data Management Plan (DMP)</strong> exists to anticipate the future of some data. Good DMPs address findability, accessibility, interoperability, and reusability (FAIR) before problems arise.
  </p>
  <div class="rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
    <h5 class="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Think about it first:</h5>
    <p class="text-sm text-gray-700 dark:text-gray-300">
      What hurdles to good data practices might occur? What information is needed in order to avoid or overcome those potential hurdles?
    </p>
  </div>
</div>

<!-- Michener's 10 Rules Checklist -->
<div class="mb-6">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">
    Michener's 10 Rules for Creating a Good DMP
  </h4>
  <div class="space-y-1.5">
    {#each rules as rule}
      <div class="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          {rule.num}
        </span>
        <div>
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{rule.title}</span>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{rule.prompt}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Group Exercise: Mini-DMP -->
<div class="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
  <h4 class="mb-1 text-base font-bold text-gray-900 dark:text-gray-100">
    Group Exercise: Draft a Mini-DMP
  </h4>
  <ExerciseTimer phases={[{ label: "Pick scenario", minutes: 2 }, { label: "Draft rules", minutes: 10 }, { label: "Compare with group", minutes: 5 }]}>
  <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
    A research scenario is shown below &mdash; shuffle for a different one, or describe your own project.
    For each of Michener's rules, write 2&ndash;3 sentences about how you'd address it.
  </p>

  <!-- Project randomizer -->
  <div class="mb-4">
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

  <div class="mb-4">
    <label>
      <span class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Or describe your own project:</span>
      <textarea
        bind:value={projectDescription}
        placeholder="Describe your research scenario..."
        class="h-16 w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      ></textarea>
    </label>
  </div>

  <div class="space-y-3">
    {#each rules as rule}
      <div class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Rule {rule.num}: {rule.title}
        </div>
        <div class="mb-2 text-xs text-gray-500 italic dark:text-gray-400">{rule.prompt}</div>
        <textarea
          bind:value={ruleNotes[rule.num]}
          placeholder="Your plan for this rule..."
          class="h-16 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        ></textarea>
      </div>
    {/each}
  </div>

  <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">Your work is saved automatically in your browser.</p>
  </ExerciseTimer>

  <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
    For a full DMP, try <a
      href="https://dmptool.org"
      target="_blank"
      rel="noopener noreferrer"
      class="text-blue-600 hover:underline dark:text-blue-400">DMPTool</a
    > &mdash; you can log in with your DU email.
  </div>
</div>
