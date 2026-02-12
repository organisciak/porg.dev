<script lang="ts">
  import ExerciseTimer from "$lib/teaching/ExerciseTimer.svelte";
  import SvelteMarkdown from "svelte-markdown";

  const STORAGE_KEY = "lis4220-markdown-playground";

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

  const syntaxReference = [
    { label: "Heading", md: "# Heading 1\n## Heading 2\n### Heading 3", desc: "Use 1–6 # symbols" },
    { label: "Bold", md: "**bold text**", desc: "Double asterisks or underscores" },
    { label: "Italic", md: "*italic text*", desc: "Single asterisks or underscores" },
    { label: "Link", md: "[link text](https://example.com)", desc: "Square brackets + parentheses" },
    { label: "Image", md: "![alt text](image.jpg)", desc: "Like a link, prefixed with !" },
    { label: "Unordered list", md: "- Item one\n- Item two\n- Item three", desc: "Dash, asterisk, or plus" },
    { label: "Ordered list", md: "1. First\n2. Second\n3. Third", desc: "Number followed by period" },
    { label: "Blockquote", md: "> This is a quote", desc: "Greater-than sign" },
    { label: "Code (inline)", md: "`some code`", desc: "Backticks" },
    { label: "Code block", md: "```\ncode here\n```", desc: "Triple backticks" },
    { label: "Horizontal rule", md: "---", desc: "Three dashes, asterisks, or underscores" },
  ];

  const challengeText = `Practicing Markdown

Markdown is a plain-text markup language. Formatting in Markdown can be rendered with bold, italics and other visual styles seen in word processors, but is also understandable in a plain text file. John Gruber, Markdown's creator, notes that:

The overriding design goal for Markdown's formatting syntax is to make it as readable as possible.

Exercise

Open a text editor on your computer. Try rewriting the text of this slide in Markdown. Instructions are available at the GitHub formatting guide. When you're done, test it at stackedit.io, and fix remaining problems.`;

  const challengeHint = `# Practicing Markdown

Markdown is a plain-text markup language. Formatting in Markdown can be rendered with **bold**, *italics* and other visual styles seen in word processors, but is also understandable in a plain text file. John Gruber, Markdown's creator, notes that:

> The overriding design goal for Markdown's formatting syntax is to make it as readable as possible.

## Exercise

1. Open a text editor on your computer
2. Try rewriting the text of this slide in Markdown. Instructions are available at the [GitHub formatting guide](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
3. When you're done, test it at [stackedit.io](https://stackedit.io), and fix remaining problems`;

  let editorText = $state(loadState("editor", "# Hello!\n\nStart writing **Markdown** here and see it rendered on the right.\n\n- Try a list\n- With multiple items\n\n> Or a blockquote"));
  $effect(() => { saveState("editor", editorText); });

  let showReference = $state(false);
  let showHint = $state(false);
  let activeTab: "editor" | "challenge" = $state("editor");

  let challengeText2 = $state(loadState("challenge", ""));
  $effect(() => { saveState("challenge", challengeText2); });

  // Copy reference syntax to clipboard
  function copySyntax(md: string) {
    navigator.clipboard.writeText(md);
  }
</script>

<!-- Why Markdown? -->
<section class="prose prose-gray max-w-none dark:prose-invert">
  <h3>Why Markdown?</h3>
  <p>
    Markdown is a <strong>plain-text markup language</strong>. Unlike a Word document, a Markdown file
    is just text &mdash; you can open it in any text editor, on any operating system, forever. But it
    still supports formatting: headings, bold, links, lists, and more.
  </p>
  <p>
    John Gruber, Markdown's creator, set a clear goal:
  </p>
  <blockquote>
    The overriding design goal for Markdown's formatting syntax is to make it as readable as possible.
  </blockquote>
  <p>
    Markdown is widely used in data curation: README files, data dictionaries, documentation, GitHub,
    and even some metadata standards. If you can write Markdown, you can document data anywhere.
  </p>
</section>

<!-- Syntax Quick Reference -->
<div class="mt-6 mb-6">
  <button
    onclick={() => (showReference = !showReference)}
    class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100"
  >
    <span class="transition-transform {showReference ? 'rotate-90' : ''}">&rsaquo;</span>
    Syntax Quick Reference
  </button>

  {#if showReference}
    <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {#each syntaxReference as ref}
        <button
          onclick={() => copySyntax(ref.md)}
          class="group rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
          title="Click to copy"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500 dark:text-gray-400">{ref.label}</span>
            <span class="text-[10px] text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-600">click to copy</span>
          </div>
          <pre class="mt-1 whitespace-pre-wrap text-xs text-gray-800 dark:text-gray-200">{ref.md}</pre>
          <div class="mt-1 text-[10px] text-gray-400 dark:text-gray-500">{ref.desc}</div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<!-- Live Editor -->
<div class="mb-8">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Live Editor</h4>

  <!-- Tab bar -->
  <div class="mb-3 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
    <button
      onclick={() => (activeTab = "editor")}
      class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all {activeTab === 'editor'
        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
    >
      Free Write
    </button>
    <button
      onclick={() => (activeTab = "challenge")}
      class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all {activeTab === 'challenge'
        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
    >
      Challenge
    </button>
  </div>

  {#if activeTab === "editor"}
    <!-- Free write mode -->
    <div class="grid gap-4 lg:grid-cols-2">
      <div>
        <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Markdown</div>
        <textarea
          bind:value={editorText}
          class="h-72 w-full resize-none rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-800"
          spellcheck="false"
        ></textarea>
      </div>
      <div>
        <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Preview</div>
        <div
          class="prose prose-sm prose-gray h-72 overflow-auto rounded-lg border border-gray-200 bg-white p-3 dark:prose-invert dark:border-gray-700 dark:bg-gray-900"
        >
          <SvelteMarkdown source={editorText} />
        </div>
      </div>
    </div>
    <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">Your text is saved automatically in your browser.</p>
  {:else}
    <!-- Challenge mode -->
    <div class="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
      <h5 class="mb-1 text-sm font-bold text-gray-900 dark:text-gray-100">
        Exercise: Convert Plain Text to Markdown
      </h5>
      <ExerciseTimer phases={[{ label: "Write Markdown", minutes: 5 }, { label: "Compare & refine", minutes: 3 }]}>
        <p class="mb-3 text-sm text-gray-700 dark:text-gray-300">
          The text below is plain, unformatted content from a lecture slide. Rewrite it in the editor using
          proper Markdown: headings, bold, italic, blockquotes, lists, and links where appropriate.
        </p>

        <!-- Source text to convert -->
        <div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div class="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Plain text to convert</div>
          <pre class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{challengeText}</pre>
        </div>

        <!-- Editor + preview side by side -->
        <div class="grid gap-4 lg:grid-cols-2">
          <div>
            <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Your Markdown</div>
            <textarea
              bind:value={challengeText2}
              placeholder="Rewrite the text above using Markdown..."
              class="h-56 w-full resize-none rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-800"
              spellcheck="false"
            ></textarea>
          </div>
          <div>
            <div class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Preview</div>
            <div
              class="prose prose-sm prose-gray h-56 overflow-auto rounded-lg border border-gray-200 bg-white p-3 dark:prose-invert dark:border-gray-700 dark:bg-gray-900"
            >
              {#if challengeText2.trim()}
                <SvelteMarkdown source={challengeText2} />
              {:else}
                <p class="text-gray-400 italic">Your preview will appear here...</p>
              {/if}
            </div>
          </div>
        </div>

        <div class="mt-3">
          <button
            onclick={() => (showHint = !showHint)}
            class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <span class="transition-transform {showHint ? 'rotate-90' : ''}">&rsaquo;</span>
            {showHint ? "Hide" : "Show"} example solution
          </button>
        </div>

        {#if showHint}
          <div class="mt-3 grid gap-4 lg:grid-cols-2">
            <div>
              <div class="mb-1 text-xs font-medium text-green-600 dark:text-green-400">Example Markdown</div>
              <pre
                class="h-56 overflow-auto rounded-lg border border-green-200 bg-green-50/50 p-3 text-xs dark:border-green-800 dark:bg-green-900/20 dark:text-gray-300"
              >{challengeHint}</pre>
            </div>
            <div>
              <div class="mb-1 text-xs font-medium text-green-600 dark:text-green-400">Rendered</div>
              <div
                class="prose prose-sm prose-gray h-56 overflow-auto rounded-lg border border-green-200 bg-green-50/50 p-3 dark:prose-invert dark:border-green-800 dark:bg-green-900/20"
              >
                <SvelteMarkdown source={challengeHint} />
              </div>
            </div>
          </div>
          <div class="mt-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              <strong>Note:</strong> There's no single "correct" answer &mdash; Markdown is flexible. The key
              is that your version is readable both as raw text <em>and</em> when rendered.
            </p>
          </div>
        {/if}

        <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">Your work is saved automatically in your browser.</p>
      </ExerciseTimer>
    </div>
  {/if}
</div>

<!-- Where Markdown is used -->
<div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
  <h4 class="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">Where You'll See Markdown</h4>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {#each [
      { name: "README files", desc: "Every GitHub repo starts with one" },
      { name: "Data dictionaries", desc: "Document fields and values in plain text" },
      { name: "Jupyter notebooks", desc: "Mix code, output, and Markdown narrative" },
      { name: "Documentation sites", desc: "Many docs are authored in Markdown" },
    ] as use}
      <div class="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{use.name}</div>
        <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{use.desc}</div>
      </div>
    {/each}
  </div>
</div>
