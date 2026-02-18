<script lang="ts">
  const STORAGE_KEY = "lis4220-git-tutorial";

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

  let current = $state(loadState("slide", 0));
  $effect(() => { saveState("slide", current); });

  function prev() { if (current > 0) current--; }
  function next() { if (current < slides.length - 1) current++; }
  function goTo(i: number) { current = i; }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  }

  interface Slide {
    title?: string;
    id: string;
  }

  const slides: Slide[] = [
    { id: "title", title: "Git" },
    { id: "what", title: "What is Git?" },
    { id: "why", title: "Why Git?" },
    { id: "versions", title: "How Versions Work" },
    { id: "three-states", title: "Three States" },
    { id: "git-vs-github", title: "Git vs. GitHub" },
    { id: "verbs-1", title: "Basic Verbs" },
    { id: "verbs-2", title: "More Verbs" },
    { id: "clone", title: "Cloning" },
    { id: "explore", title: "Explore History" },
    { id: "change", title: "Make a Change" },
    { id: "commit", title: "Commit" },
    { id: "see-change", title: "See Your Change" },
    { id: "branching", title: "Branching" },
    { id: "create-branch", title: "Create a Branch" },
    { id: "try-merge", title: "Try It" },
    { id: "conflicts", title: "Conflicts" },
    { id: "resolve", title: "Resolving Conflicts" },
    { id: "questions", title: "Questions to Explore" },
    { id: "large-files", title: "Large Files" },
    { id: "git-lfs", title: "Git LFS" },
  ];
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Slide container -->
<div class="relative">
  <!-- Navigation bar -->
  <div class="mb-4 flex items-center justify-between">
    <button
      onclick={prev}
      disabled={current === 0}
      class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {current === 0
        ? 'text-gray-300 dark:text-gray-600'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}"
    >&larr; Prev</button>
    <span class="text-xs text-gray-400 dark:text-gray-500">
      {current + 1} / {slides.length}
    </span>
    <button
      onclick={next}
      disabled={current === slides.length - 1}
      class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {current === slides.length - 1
        ? 'text-gray-300 dark:text-gray-600'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}"
    >Next &rarr;</button>
  </div>

  <!-- Progress dots -->
  <div class="mb-4 flex justify-center gap-1">
    {#each slides as _, i}
      <button
        onclick={() => goTo(i)}
        class="h-1.5 rounded-full transition-all {i === current
          ? 'w-4 bg-blue-500'
          : 'w-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'}"
        aria-label="Go to slide {i + 1}"
      ></button>
    {/each}
  </div>

  <!-- Slide content -->
  <div class="min-h-[24rem] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-12">
    {#if slides[current].id === "title"}
      <!-- Title slide -->
      <div class="flex h-full min-h-[20rem] flex-col items-center justify-center text-center">
        <h2 class="text-5xl font-black tracking-tight text-gray-900 dark:text-gray-100">Git</h2>
        <p class="mt-4 text-xl text-gray-500 dark:text-gray-400">Distributed Version Control</p>
        <p class="mt-8 text-sm text-gray-400 dark:text-gray-500">Use arrow keys or buttons to navigate</p>
      </div>

    {:else if slides[current].id === "what"}
      <h2 class="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">What is Git?</h2>
      <div class="space-y-4 text-lg text-gray-700 dark:text-gray-300">
        <p><strong>Track changes</strong> to a project (dataset or otherwise)</p>
        <p><strong>Distribute</strong> with full version history</p>
        <p><strong>Branch and merge</strong> for concurrent collaboration</p>
        <p>If something breaks, you can <strong>rewind</strong></p>
        <p>Every version gets a <strong>persistent identifier</strong> and comments</p>
      </div>

    {:else if slides[current].id === "why"}
      <h2 class="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">Why Git?</h2>
      <div class="space-y-6 text-lg text-gray-700 dark:text-gray-300">
        <p>Git offers one way of thinking about <strong>version control</strong></p>
        <p>Not always useful for data, but <strong>concepts transfer</strong></p>
        <p class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          When is it useful? For <strong>simple data formats</strong> &mdash; ones that can <em>diff</em> nicely
        </p>
      </div>

    {:else if slides[current].id === "versions"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">How Versions Work</h2>
      <p class="mb-6 text-gray-600 dark:text-gray-400">Each version is a snapshot. Only changed files get new entries.</p>
      <!-- Simple version diagram -->
      <div class="overflow-x-auto">
        <div class="flex items-start gap-3 text-xs sm:text-sm">
          {#each [
            { v: "v1", files: ["A", "B", "C"], changed: ["A", "B", "C"] },
            { v: "v2", files: ["A1", "B", "C1"], changed: ["A1", "C1"] },
            { v: "v3", files: ["A1", "B", "C2"], changed: ["C2"] },
            { v: "v4", files: ["A2", "B1", "C2"], changed: ["A2", "B1"] },
            { v: "v5", files: ["A2", "B2", "C3"], changed: ["B2", "C3"] },
          ] as version}
            <div class="flex flex-col items-center gap-2">
              <div class="rounded-lg bg-amber-100 px-3 py-1.5 font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">{version.v}</div>
              {#each version.files as file}
                <div class="rounded border px-2.5 py-1 text-center font-mono {version.changed.includes(file)
                  ? 'border-blue-300 bg-blue-50 font-semibold text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'border-dashed border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500'}"
                >{file}</div>
              {/each}
            </div>
            {#if version.v !== "v5"}
              <div class="mt-4 text-gray-300 dark:text-gray-600">&rarr;</div>
            {/if}
          {/each}
        </div>
      </div>
      <p class="mt-4 text-xs text-gray-400 dark:text-gray-500">
        Solid = changed in this version. Dashed = unchanged.
        <span class="ml-2 italic">After Chacon &amp; Straub, Pro Git</span>
      </p>

    {:else if slides[current].id === "three-states"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Three States</h2>
      <div class="flex flex-col items-center gap-4 sm:flex-row sm:gap-0">
        <!-- Working Directory -->
        <div class="flex-1 rounded-xl border-2 border-orange-300 bg-orange-50 p-5 text-center dark:border-orange-700 dark:bg-orange-900/20">
          <div class="text-lg font-bold text-orange-700 dark:text-orange-400">Working Directory</div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Edit your files here</p>
        </div>
        <div class="px-2 text-2xl text-gray-400 sm:py-4">&rarr;</div>
        <!-- Staging Area -->
        <div class="flex-1 rounded-xl border-2 border-teal-300 bg-teal-50 p-5 text-center dark:border-teal-700 dark:bg-teal-900/20">
          <div class="text-lg font-bold text-teal-700 dark:text-teal-400">Staging Area</div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Ready files for a version</p>
        </div>
        <div class="px-2 text-2xl text-gray-400 sm:py-4">&rarr;</div>
        <!-- Repository -->
        <div class="flex-1 rounded-xl border-2 border-blue-300 bg-blue-50 p-5 text-center dark:border-blue-700 dark:bg-blue-900/20">
          <div class="text-lg font-bold text-blue-700 dark:text-blue-400">Repository</div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">"Save" your changes</p>
        </div>
      </div>
      <div class="mt-6 flex justify-around text-sm font-medium text-gray-500 dark:text-gray-400">
        <span><code class="rounded bg-gray-100 px-1.5 text-xs dark:bg-gray-700">git add</code></span>
        <span><code class="rounded bg-gray-100 px-1.5 text-xs dark:bg-gray-700">git commit</code></span>
      </div>

    {:else if slides[current].id === "git-vs-github"}
      <h2 class="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">Git vs. GitHub</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
          <div class="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">git</div>
          <p class="text-gray-600 dark:text-gray-400">The version control <strong>system</strong></p>
          <div class="mt-4 space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <p>Like: a document</p>
            <p>Like: an email</p>
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
          <div class="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">GitHub</div>
          <p class="text-gray-600 dark:text-gray-400">A <strong>place</strong> to save/share repositories</p>
          <div class="mt-4 space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <p>Like: Google Docs</p>
            <p>Like: Gmail</p>
          </div>
        </div>
      </div>
      <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Not <em>the</em> place, just <em>a</em> place. Others: GitLab, Bitbucket, Codeberg...
      </p>

    {:else if slides[current].id === "verbs-1"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Basic Verbs</h2>
      <div class="space-y-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <div class="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">Starting a repository</div>
          <p class="font-mono text-sm"><strong>git init</strong> <span class="text-gray-400">&mdash; initialize from scratch</span></p>
          <p class="font-mono text-sm"><strong>git clone</strong> &lt;url&gt; <span class="text-gray-400">&mdash; copy from another location</span></p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <div class="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">Staging</div>
          <p class="font-mono text-sm"><strong>git add</strong> &lt;file&gt; <span class="text-gray-400">&mdash; add to the staging area</span></p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <div class="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">Committing</div>
          <p class="font-mono text-sm"><strong>git commit</strong> -m "message" <span class="text-gray-400">&mdash; save the staging area</span></p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <div class="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400">Version history</div>
          <p class="font-mono text-sm"><strong>git log</strong> <span class="text-gray-400">&mdash; browse the log</span></p>
          <p class="font-mono text-sm"><strong>git checkout</strong> &lt;version&gt; <span class="text-gray-400">&mdash; go to an older version</span></p>
        </div>
      </div>

    {:else if slides[current].id === "verbs-2"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">More Verbs</h2>
      <div class="space-y-4">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <p class="font-mono text-sm"><strong>git status</strong> <span class="text-gray-400">&mdash; see the state of your repository</span></p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <p class="font-mono text-sm"><strong>git rm</strong> &lt;file&gt; <span class="text-gray-400">&mdash; stage a file removal</span></p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <p class="font-mono text-sm"><strong>git branch</strong> <span class="text-gray-400">&mdash; branch away from the main path</span></p>
        </div>
      </div>
      <div class="mt-6 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          You don't need to memorize commands for GitHub Desktop, but <strong>know the verbs</strong> to understand what's going on!
        </p>
      </div>

    {:else if slides[current].id === "clone"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Cloning a Repository</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-400">Copy a repository to your computer:</p>
      <div class="rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
        git clone https://github.com/dariusk/corpora
      </div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">
        In <strong>GitHub Desktop</strong>: File &rarr; Clone Repository &rarr; paste the URL.
      </p>
      <div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <div class="text-xs font-bold uppercase tracking-wide text-gray-400">Try it</div>
        <p class="mt-1 text-sm text-gray-700 dark:text-gray-300">
          Clone <code class="rounded bg-gray-200 px-1.5 text-xs dark:bg-gray-700">https://github.com/dariusk/corpora</code> &mdash; a fun collection of JSON data files (foods, animals, occupations, etc.)
        </p>
      </div>

    {:else if slides[current].id === "explore"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Explore the History</h2>
      <p class="mb-6 text-gray-600 dark:text-gray-400">After cloning, look at the <strong>History</strong> tab.</p>
      <div class="space-y-3">
        <div class="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <span class="mt-0.5 h-3 w-3 shrink-0 rounded-full bg-blue-500"></span>
          <div>
            <div class="font-semibold text-gray-900 dark:text-gray-100">Each commit shows:</div>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Name, description, changed files, the diff, and a unique identifier</p>
          </div>
        </div>
      </div>
      <div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <div class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Example: a real commit</div>
        <div class="font-mono text-sm">
          <div class="font-semibold text-gray-900 dark:text-gray-100">"Fixing humans/occupations typos"</div>
          <div class="mt-2 text-red-500">- "cement masonchanneling machine operator"</div>
          <div class="text-green-500">+ "cement mason",</div>
          <div class="text-green-500">+ "channeling machine operator",</div>
        </div>
      </div>

    {:else if slides[current].id === "change"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Make a Change</h2>
      <div class="space-y-4 text-lg text-gray-700 dark:text-gray-300">
        <p><strong>1.</strong> Open the project folder on your computer</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 ml-6">Tip: Repository &rarr; Show in Explorer/Finder</p>
        <p><strong>2.</strong> Edit a file</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 ml-6">e.g. remove "hot dog" from sandwiches.json</p>
        <p><strong>3.</strong> Go back to GitHub Desktop &mdash; see the <strong>Changes</strong> tab</p>
      </div>
      <div class="mt-6 rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
        git status
      </div>

    {:else if slides[current].id === "commit"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Commit the Change</h2>
      <div class="space-y-4 text-lg text-gray-700 dark:text-gray-300">
        <p><strong>1.</strong> Check the files you want to commit</p>
        <p><strong>2.</strong> Write a summary (required) and description (optional)</p>
        <p><strong>3.</strong> Click <strong>Commit</strong></p>
      </div>
      <div class="mt-6 space-y-2">
        <div class="rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
          git add data/foods/sandwiches.json
        </div>
        <div class="rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
          git commit -m "Hot dog is not a sandwich"
        </div>
      </div>

    {:else if slides[current].id === "see-change"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">See Your Change</h2>
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
        <div class="mb-3 flex items-center gap-3">
          <span class="h-3 w-3 rounded-full bg-blue-500"></span>
          <span class="font-semibold text-gray-900 dark:text-gray-100">Hot dog is not a sandwich</span>
          <span class="text-xs text-gray-400">1 minute ago</span>
        </div>
        <div class="font-mono text-sm">
          <div class="text-red-500">- "Hot dog"</div>
          <div class="text-red-500">- "A cooked sausage...served in a sliced bun"</div>
        </div>
      </div>
      <div class="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <p>This change is <strong>just on your computer</strong>.</p>
        <p>If this were your repository, you could <strong>Push</strong> to send it to GitHub.</p>
        <p>Your entire history travels with the repository.</p>
      </div>

    {:else if slides[current].id === "branching"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Branching</h2>
      <p class="mb-6 text-lg text-gray-700 dark:text-gray-300">
        A <strong>branch</strong> splits off from the main project, letting you experiment on the side.
      </p>
      <!-- Simple branch diagram -->
      <div class="flex items-center justify-center gap-1 py-4">
        <span class="h-4 w-4 rounded-full bg-gray-400"></span>
        <span class="h-0.5 w-6 bg-gray-400"></span>
        <span class="h-4 w-4 rounded-full bg-gray-400"></span>
        <span class="relative h-0.5 w-6 bg-gray-400">
          <span class="absolute -top-5 left-0 h-0.5 w-6 rotate-[-30deg] bg-purple-500"></span>
        </span>
        <span class="relative">
          <span class="h-4 w-4 rounded-full bg-gray-400 block"></span>
          <span class="absolute -top-6 left-3 h-4 w-4 rounded-full bg-purple-500"></span>
        </span>
        <span class="relative h-0.5 w-6 bg-gray-400">
          <span class="absolute -top-5 left-0 h-0.5 w-6 bg-purple-500"></span>
        </span>
        <span class="relative">
          <span class="absolute -top-6 left-0 h-4 w-4 rounded-full bg-purple-500"></span>
          <span class="absolute -top-3 left-4 h-0.5 w-5 rotate-[30deg] bg-purple-500"></span>
        </span>
        <span class="h-0.5 w-4 bg-gray-400"></span>
        <span class="h-4 w-4 rounded-full bg-purple-500"></span>
      </div>
      <div class="mt-4 flex justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
        <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-gray-400"></span> main</span>
        <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-purple-500"></span> branch</span>
      </div>
      <p class="mt-6 text-sm text-gray-600 dark:text-gray-400">
        The main track is usually called <code class="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700">main</code>.
        Branches can be <strong>merged</strong> back.
      </p>

    {:else if slides[current].id === "create-branch"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Create a Branch</h2>
      <div class="space-y-4 text-lg text-gray-700 dark:text-gray-300">
        <p>In GitHub Desktop:</p>
        <p class="ml-4">Current Branch &rarr; <strong>New Branch</strong> &rarr; name it (e.g. "experimental")</p>
      </div>
      <div class="mt-6 rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
        git branch experimental<br/>
        git checkout experimental
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Now any changes you make are on the <strong>experimental</strong> branch, not main.
      </p>

    {:else if slides[current].id === "try-merge"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Try It</h2>
      <div class="space-y-4">
        <div class="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p class="font-semibold text-gray-900 dark:text-gray-100">1. Change a file</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">On your experimental branch, edit and commit a change.</p>
        </div>
        <div class="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p class="font-semibold text-gray-900 dark:text-gray-100">2. Switch back to main</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Check the file you changed. What does it look like?</p>
        </div>
        <div class="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p class="font-semibold text-gray-900 dark:text-gray-100">3. Merge</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Branch &rarr; Merge into current branch &rarr; select experimental. What does the file look like now?</p>
        </div>
      </div>

    {:else if slides[current].id === "conflicts"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Conflicts</h2>
      <p class="mb-6 text-lg text-gray-700 dark:text-gray-300">
        What happens when <strong>two branches edit the same thing</strong>?
      </p>
      <div class="space-y-4">
        <div class="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <p class="text-sm text-gray-700 dark:text-gray-300"><strong>On experimental:</strong> capitalize beer types &rarr; "Belgian and French Ale"</p>
        </div>
        <div class="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
          <p class="text-sm text-gray-700 dark:text-gray-300"><strong>On main:</strong> remove some beer types entirely</p>
        </div>
      </div>
      <div class="mt-6 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center dark:border-red-700 dark:bg-red-900/20">
        <p class="font-semibold text-red-700 dark:text-red-400">Merge conflict!</p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Git can't decide which change to keep.</p>
      </div>

    {:else if slides[current].id === "resolve"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Resolving Conflicts</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-400">Open the conflicted file. Git marks the disagreement:</p>
      <div class="rounded-lg bg-gray-900 p-5 font-mono text-sm leading-relaxed text-gray-300">
        <span class="text-red-400">&lt;&lt;&lt;&lt;&lt;&lt;&lt; main</span><br/>
        "British ale",<br/>
        "German ale",<br/>
        <span class="text-yellow-400">=========</span><br/>
        "British Ale",<br/>
        "German Ale",<br/>
        "International Ale",<br/>
        <span class="text-green-400">&gt;&gt;&gt;&gt;&gt;&gt;&gt; experimental</span>
      </div>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <strong>You decide</strong> which parts to keep. Delete the markers, save, and commit.
      </p>

    {:else if slides[current].id === "questions"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Questions to Explore</h2>
      <div class="space-y-4">
        <div class="rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <p class="font-medium text-gray-900 dark:text-gray-100">What if I change something, then switch branches without committing?</p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The file stays changed &mdash; changes live in the working directory.</p>
        </div>
        <div class="rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <p class="font-medium text-gray-900 dark:text-gray-100">How many branches can I create?</p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">As many as you need.</p>
        </div>
        <div class="rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <p class="font-medium text-gray-900 dark:text-gray-100">Can I merge non-main branches?</p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Sure! There's nothing special about main &mdash; all branches work the same way.</p>
        </div>
      </div>

    {:else if slides[current].id === "large-files"}
      <h2 class="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">Large Files &amp; Git</h2>
      <div class="space-y-4 text-lg text-gray-700 dark:text-gray-300">
        <p>Regular Git struggles with files <strong>&gt;100 MB</strong></p>
        <p>Large datasets cause <strong>repository bloat</strong> and slowdowns</p>
        <p><strong>Diff</strong> doesn't work well with large binary files</p>
      </div>

    {:else if slides[current].id === "git-lfs"}
      <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Git LFS</h2>
      <p class="mb-4 text-lg text-gray-600 dark:text-gray-400">Git Large File Storage</p>
      <div class="space-y-3">
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <p class="text-sm text-gray-700 dark:text-gray-300">Replaces large files with <strong>text pointers</strong> in the repository</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <p class="text-sm text-gray-700 dark:text-gray-300">Actual data stored <strong>separately</strong> on LFS server</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <p class="text-sm text-gray-700 dark:text-gray-300">Prevents bloat, improves performance, <strong>maintains versioning</strong></p>
        </div>
      </div>
      <p class="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Useful for datasets, images, audio, video &mdash; anything large that needs version tracking.
      </p>
    {/if}
  </div>

  <!-- Bottom navigation -->
  <div class="mt-4 flex items-center justify-between">
    <button
      onclick={prev}
      disabled={current === 0}
      class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {current === 0
        ? 'text-gray-300 dark:text-gray-600'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}"
    >&larr; Prev</button>
    <span class="text-xs text-gray-400 dark:text-gray-500">
      {slides[current].title}
    </span>
    <button
      onclick={next}
      disabled={current === slides.length - 1}
      class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {current === slides.length - 1
        ? 'text-gray-300 dark:text-gray-600'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}"
    >Next &rarr;</button>
  </div>
</div>
