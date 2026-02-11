<script lang="ts">
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

  let checkedRules = $state<Set<number>>(new Set());
  let ruleNotes = $state<Record<number, string>>({});
  let projectDescription = $state("");

  const scenarios = [
    {
      title: "Climate Monitoring Network",
      desc: "A research team is deploying 50 weather sensors across Colorado to measure temperature, humidity, and air quality every 15 minutes for 3 years. The project is funded by NSF.",
    },
    {
      title: "Digital Humanities Archive",
      desc: "A library is digitizing 10,000 historical photographs from the 1800s, adding metadata and creating a searchable online collection. Funded by IMLS.",
    },
    {
      title: "Public Health Survey",
      desc: "Researchers are conducting a survey of 5,000 Denver residents about food access and nutrition. Data includes demographics, GPS coordinates of food stores, and health metrics. Funded by NIH.",
    },
  ];

  let selectedScenario = $state(0);

  function toggleRule(num: number) {
    const newSet = new Set(checkedRules);
    if (newSet.has(num)) {
      newSet.delete(num);
    } else {
      newSet.add(num);
    }
    checkedRules = newSet;
  }
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
  <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
    Check off the rules you'd include in your plan. Which ones seem most important for your scenario?
  </p>
  <div class="space-y-1.5">
    {#each rules as rule}
      <button
        class="flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all {checkedRules.has(
          rule.num,
        )
          ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'}"
        onclick={() => toggleRule(rule.num)}
      >
        <span
          class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs {checkedRules.has(
            rule.num,
          )
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-gray-300 dark:border-gray-600'}"
        >
          {checkedRules.has(rule.num) ? "✓" : ""}
        </span>
        <div>
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Rule {rule.num}: {rule.title}
          </span>
        </div>
      </button>
    {/each}
  </div>
  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
    {checkedRules.size} of {rules.length} rules selected
  </p>
</div>

<!-- Group Exercise: Mini-DMP -->
<div class="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">
    Group Exercise: Draft a Mini-DMP
  </h4>
  <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
    Choose a research scenario below (or use your own project idea). For each of Michener's rules,
    write 2-3 sentences about how you'd address it. Then compare with another group!
  </p>

  <div class="mb-4 grid gap-2 sm:grid-cols-3">
    {#each scenarios as scenario, i}
      <button
        class="rounded-lg border p-3 text-left transition-all {selectedScenario === i
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'}"
        onclick={() => (selectedScenario = i)}
      >
        <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{scenario.title}</div>
        <div class="mt-1 text-xs text-gray-600 dark:text-gray-400">{scenario.desc}</div>
      </button>
    {/each}
  </div>

  <div class="mb-4">
    <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
      >Or describe your own project:</label
    >
    <textarea
      bind:value={projectDescription}
      placeholder="Describe your research scenario..."
      class="h-16 w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    ></textarea>
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

  <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
    For a full DMP, try <a
      href="https://dmptool.org"
      target="_blank"
      rel="noopener noreferrer"
      class="text-blue-600 hover:underline dark:text-blue-400">DMPTool</a
    > &mdash; you can log in with your DU email.
  </div>
</div>
