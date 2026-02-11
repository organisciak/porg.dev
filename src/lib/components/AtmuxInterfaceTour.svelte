<script lang="ts">
  import { onDestroy } from "svelte";

  export let autoplay = true;
  export let intervalMs = 6200;

  const panels = [
    {
      id: "launch",
      eyebrow: "Default Launch",
      title: "The `atmux` landing switcher",
      body: "A quick launch view: resume current project, attach active sessions, or jump into recent sessions before you commit to anything.",
    },
    {
      id: "sessions",
      eyebrow: "Sessions",
      title: "`atmux sessions`",
      body: "A UI for flipping through active and recent sessions, with fast attach/jump controls and beads tracking in-line.",
    },
    {
      id: "browse",
      eyebrow: "Browse",
      title: "`atmux browse`",
      body: "A UI for flipping through panes and windows of your sessions, and optionally sending inputs without jumping in. The real TUI is denser in terminal.",
    },
  ];

  let activeIndex = 0;
  let panel = panels[activeIndex];
  let isPlaying = autoplay;
  let timer: ReturnType<typeof setInterval> | null = null;

  $: panel = panels[activeIndex];

  $: if (isPlaying && panels.length > 1) {
    startAutoplay();
  } else {
    stopAutoplay();
  }

  onDestroy(stopAutoplay);

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => {
      next(true);
    }, intervalMs);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function resetAutoplay() {
    if (isPlaying) {
      startAutoplay();
    }
  }

  function prev() {
    activeIndex = (activeIndex - 1 + panels.length) % panels.length;
    resetAutoplay();
  }

  function next(fromAuto = false) {
    activeIndex = (activeIndex + 1) % panels.length;
    if (!fromAuto) resetAutoplay();
  }

  function goTo(index: number) {
    activeIndex = index;
    resetAutoplay();
  }

  function toggleAutoplay() {
    isPlaying = !isPlaying;
  }
</script>

<section class="not-prose tour">
  <div class="tour-shell">
    <div class="tour-header">
      <div>
        <p class="eyebrow">{panel.eyebrow}</p>
        <h3 class="title">{panel.title}</h3>
        <p class="body">{panel.body}</p>
      </div>
      <div class="controls">
        <button type="button" class="btn" on:click={prev}>Prev</button>
        <button type="button" class="btn" on:click={() => next()}>Next</button>
        <button type="button" class="btn ghost" on:click={toggleAutoplay}>
          {#if isPlaying}Pause autoplay{:else}Play autoplay{/if}
        </button>
      </div>
    </div>

    {#if panel.id === "launch"}
      <div class="ui-frame launch">
        <div class="launch-brand">atmux</div>

        <div class="resume-row">
          <span class="caret">▶</span>
          <span class="label">Resume session:</span>
          <span class="value">agent-web-app</span>
        </div>

        <div class="section">
          <h4>Attach Active Session</h4>
          <p class="line active">1. agent-web-app: 3 windows (attached)</p>
          <p class="line active">2. agent-api-service: 1 windows (attached)</p>
          <p class="line">3. agent-docs-site: 3 windows</p>
          <p class="line">4. agent-data-pipeline: 2 windows</p>
        </div>

        <div class="section">
          <h4>Recent Sessions</h4>
          <p class="line">web-app (15h ago) /workspace/projects/web-app</p>
          <p class="line">api-service (2d ago) /workspace/projects/api-service</p>
          <p class="line">docs-site (2d ago) /workspace/projects/docs-site</p>
          <p class="line muted">Show more (10)</p>
        </div>

        <div class="section">
          <h4>Defaults</h4>
          <p class="line">[ ] Start/Resume session directly (skip this page)</p>
          <p class="line">[ ] List sessions (`atmux sessions`)</p>
          <p class="line active">[x] Show this landing page</p>
        </div>
      </div>
    {:else if panel.id === "sessions"}
      <div class="ui-frame sessions-frame">
        <p class="sessions-shell-title">Sessions</p>
        <p class="sessions-hint">↑↓ select, digits jump, Enter attach, x kill, q quit</p>

        <div class="sessions-section">
          <h4>Active</h4>
          <p class="line selected">
            <span class="line-prefix">▶ 1.</span>
            <span>agent-web-app: 3 windows</span>
            <span class="bd-badge">bd:2</span>
          </p>
          <p class="line">2. agent-api-service: 1 windows</p>
          <p class="line">3. agent-docs-site: 3 windows</p>
          <p class="line">4. agent-data-pipeline: 2 windows</p>
        </div>

        <div class="sessions-section">
          <h4>Recent</h4>
          <p class="line">web-app (13m ago) /workspace/projects/web-app</p>
          <p class="line">api-service (48m ago) /workspace/projects/api-service</p>
          <p class="line">docs-site (1h ago) /workspace/projects/docs-site</p>
          <p class="line">data-pipeline (1h ago) /workspace/projects/data-pipeline</p>
          <p class="line muted">Tip: Tab cycles between sections</p>
        </div>
      </div>
    {:else}
      <div class="ui-frame browse">
        <div class="browse-command">
          <span class="command-label">Command:</span>
          <span class="command-input">› Enter command to send...</span>
        </div>

        <div class="browse-main">
          <div class="tree">
            <p class="tree-line root">[-] agent-web-app</p>
            <p class="tree-line">[-] agents</p>
            <p class="tree-line">
              [*] claude-code <span class="send">SEND</span> <span class="esc">ESC</span>
            </p>
            <p class="tree-line">
              [ ] codex <span class="send">SEND</span> <span class="esc">ESC</span>
            </p>
            <p class="tree-line root">[-] agent-api-service</p>
            <p class="tree-line">[-] agents</p>
            <p class="tree-line">
              [*] shell <span class="send">SEND</span> <span class="esc">ESC</span>
            </p>
            <p class="tree-line root recent">[Recent]</p>
            <p class="tree-line">web-app (15h ago)</p>
            <p class="tree-line">docs-site (2d ago)</p>
          </div>

          <div class="preview">
            <h5>agent-web-app:0.0</h5>
            <p>
              Render mini terminal-style feature slides with color-highlighting command/output
              lines.
            </p>
            <p>Supports:</p>
            <ul>
              <li>Prev / Next controls</li>
              <li>dot navigation</li>
              <li>autoplay toggle</li>
            </ul>
            <p class="muted">Focus: Tree | Mouse: off | Target: agent-web-app:0.0</p>
          </div>
        </div>
      </div>
    {/if}

    <div class="dots">
      {#each panels as item, idx (item.id)}
        <button
          type="button"
          class={`dot ${idx === activeIndex ? "active" : ""}`}
          aria-label={`Go to ${item.title}`}
          on:click={() => goTo(idx)}
        ></button>
      {/each}
    </div>
  </div>
</section>

<style>
  .tour {
    margin: 2.2rem 0;
  }

  .tour-shell {
    border: 1px solid rgb(148 163 184 / 0.35);
    border-radius: 0.95rem;
    padding: 1rem;
    background: linear-gradient(
      155deg,
      rgb(14 116 144 / 0.05) 0%,
      rgb(15 23 42 / 0.05) 40%,
      rgb(255 255 255 / 0.85) 100%
    );
  }

  .tour-header {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 0.9rem;
  }

  .eyebrow {
    margin: 0;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgb(14 116 144);
    font-weight: 700;
  }

  .title {
    margin: 0.3rem 0 0;
    font-size: 1.28rem;
    line-height: 1.2;
    color: rgb(15 23 42);
  }

  .body {
    margin: 0.45rem 0 0;
    max-width: 62ch;
    color: rgb(51 65 85);
  }

  .controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .btn {
    border: 1px solid rgb(148 163 184 / 0.65);
    border-radius: 9999px;
    background: white;
    color: rgb(30 41 59);
    font-size: 0.85rem;
    padding: 0.44rem 0.74rem;
    line-height: 1;
    cursor: pointer;
  }

  .btn:hover {
    border-color: rgb(14 116 144 / 0.7);
    color: rgb(14 116 144);
  }

  .btn.ghost {
    border-style: dashed;
  }

  .ui-frame {
    font-family:
      "SFMono-Regular", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    border: 1px solid rgb(148 163 184 / 0.45);
    border-radius: 0.7rem;
    background: rgb(248 250 252);
    padding: 0.72rem;
    color: rgb(31 41 55);
  }

  .launch-brand {
    text-align: center;
    color: rgb(59 130 246);
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .resume-row {
    border: 1px solid rgb(96 165 250 / 0.8);
    border-radius: 0.45rem;
    padding: 0.48rem 0.6rem;
    display: flex;
    gap: 0.4rem;
    align-items: center;
    margin-bottom: 0.65rem;
    color: rgb(30 41 59);
  }

  .resume-row .caret {
    color: rgb(59 130 246);
    font-weight: 700;
  }

  .resume-row .label {
    color: rgb(59 130 246);
    font-weight: 700;
  }

  .resume-row .value {
    font-weight: 600;
  }

  .section {
    border: 1px dashed rgb(148 163 184 / 0.8);
    border-radius: 0.45rem;
    padding: 0.55rem 0.65rem;
    margin-bottom: 0.55rem;
    background: white;
  }

  .section:last-child {
    margin-bottom: 0;
  }

  .sessions-shell-title {
    margin: 0 0 0.24rem;
    font-weight: 800;
    font-size: 1.32rem;
    color: rgb(15 23 42);
  }

  .sessions-hint {
    margin: 0 0 0.62rem;
    color: rgb(100 116 139);
    font-size: 0.92rem;
  }

  .sessions-section {
    border: 1px dashed rgb(148 163 184 / 0.8);
    border-radius: 0.45rem;
    padding: 0.55rem 0.65rem;
    margin-bottom: 0.55rem;
    background: white;
  }

  .sessions-section:last-child {
    margin-bottom: 0;
  }

  .section h4 {
    margin: 0 0 0.38rem;
    font-size: 1.05rem;
    color: rgb(216 70 239);
  }

  .line {
    margin: 0.08rem 0;
    line-height: 1.28;
  }

  .line.active {
    color: rgb(101 163 13);
  }

  .line.selected {
    display: flex;
    gap: 0.48rem;
    align-items: center;
    background: rgb(15 23 42);
    color: white;
    padding: 0.1rem 0.26rem;
    border-radius: 0.24rem;
  }

  .line-prefix {
    font-weight: 700;
  }

  .bd-badge {
    margin-left: auto;
    color: rgb(251 191 36);
    font-weight: 700;
  }

  .line.muted {
    color: rgb(100 116 139);
  }

  .browse-command {
    border: 1px dashed rgb(148 163 184 / 0.7);
    border-radius: 0.45rem;
    padding: 0.5rem 0.6rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.6rem;
    background: white;
  }

  .command-label {
    font-weight: 700;
    color: rgb(15 23 42);
  }

  .command-input {
    color: rgb(100 116 139);
  }

  .browse-main {
    display: grid;
    grid-template-columns: minmax(210px, 0.95fr) minmax(230px, 1.55fr);
    gap: 0.55rem;
  }

  .tree,
  .preview {
    border: 1px dashed rgb(148 163 184 / 0.8);
    border-radius: 0.45rem;
    padding: 0.5rem 0.58rem;
    background: white;
    min-height: 13.4rem;
  }

  .tree-line {
    margin: 0.08rem 0;
    line-height: 1.23;
    font-size: 0.84rem;
    color: rgb(30 41 59);
  }

  .tree-line.root {
    color: rgb(59 130 246);
    font-weight: 700;
  }

  .tree-line.recent {
    margin-top: 0.45rem;
    color: rgb(100 116 139);
    font-weight: 700;
  }

  .send {
    background: rgb(59 130 246);
    color: white;
    border-radius: 0.2rem;
    padding: 0.02rem 0.24rem;
    margin-left: 0.25rem;
  }

  .esc {
    background: rgb(239 68 68);
    color: white;
    border-radius: 0.2rem;
    padding: 0.02rem 0.24rem;
    margin-left: 0.15rem;
  }

  .preview h5 {
    margin: 0 0 0.4rem;
    color: rgb(59 130 246);
    font-size: 1rem;
  }

  .preview p {
    margin: 0.2rem 0;
    line-height: 1.35;
    font-size: 0.88rem;
  }

  .preview ul {
    margin: 0.18rem 0 0.3rem 1.15rem;
    padding: 0;
    font-size: 0.86rem;
    color: rgb(51 65 85);
  }

  .preview .muted {
    color: rgb(100 116 139);
    margin-top: 0.45rem;
  }

  .dots {
    margin-top: 0.75rem;
    display: flex;
    gap: 0.35rem;
    justify-content: center;
  }

  .dot {
    width: 0.64rem;
    height: 0.64rem;
    border-radius: 9999px;
    border: 0;
    background: rgb(148 163 184 / 0.45);
    cursor: pointer;
    padding: 0;
  }

  .dot.active {
    background: rgb(14 165 233);
    transform: scale(1.1);
  }

  @media (max-width: 780px) {
    .browse-main {
      grid-template-columns: 1fr;
    }

    .tree,
    .preview {
      min-height: auto;
    }
  }
</style>
