<script lang="ts">
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  type Tone = "prompt" | "command" | "path" | "success" | "warning" | "muted" | "plain";

  type Segment = {
    text: string;
    tone?: Tone;
  };

  type SlideLine = {
    role?: "command" | "output" | "note";
    segments: Segment[];
  };

  type Slide = {
    id: string;
    eyebrow?: string;
    title: string;
    body: string;
    lines: SlideLine[];
    bullets?: string[];
  };

  export let slides: Slide[] = [];
  export let intervalMs = 5200;
  export let autoplay = true;

  let activeIndex = 0;
  let isPlaying = autoplay;
  let timer: ReturnType<typeof setInterval> | null = null;

  $: if (!browser || slides.length <= 1 || !isPlaying) {
    stopAutoplay();
  } else {
    startAutoplay();
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
    if (isPlaying && slides.length > 1) {
      startAutoplay();
    }
  }

  function prev() {
    if (!slides.length) return;
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    resetAutoplay();
  }

  function next(fromAuto = false) {
    if (!slides.length) return;
    activeIndex = (activeIndex + 1) % slides.length;
    if (!fromAuto) {
      resetAutoplay();
    }
  }

  function goTo(index: number) {
    if (index < 0 || index >= slides.length) return;
    activeIndex = index;
    resetAutoplay();
  }

  function toggleAutoplay() {
    isPlaying = !isPlaying;
  }

  function toneClass(tone?: Tone) {
    switch (tone) {
      case "prompt":
        return "text-emerald-300";
      case "command":
        return "text-cyan-200";
      case "path":
        return "text-amber-300";
      case "success":
        return "text-emerald-300";
      case "warning":
        return "text-orange-300";
      case "muted":
        return "text-slate-400";
      case "plain":
      default:
        return "text-slate-100";
    }
  }

  function lineRoleClass(role?: SlideLine["role"]) {
    switch (role) {
      case "command":
        return "font-medium";
      case "note":
        return "italic text-slate-400";
      case "output":
      default:
        return "";
    }
  }
</script>

<section class="not-prose feature-flip">
  {#if slides.length > 0}
    {@const active = slides[activeIndex]}
    <div class="feature-shell">
      <div class="feature-header">
        <div class="feature-header-copy">
          <p class="eyebrow">
            {active.eyebrow ?? `Feature ${activeIndex + 1} of ${slides.length}`}
          </p>
          <h3 class="feature-title">{active.title}</h3>
          <p class="feature-body">{active.body}</p>
        </div>
        <div class="feature-controls">
          <button type="button" class="btn" on:click={prev} aria-label="Previous feature"
            >Prev</button
          >
          <button type="button" class="btn" on:click={() => next()} aria-label="Next feature"
            >Next</button
          >
          <button
            type="button"
            class="btn btn-ghost"
            on:click={toggleAutoplay}
            aria-pressed={isPlaying}
          >
            {#if isPlaying}
              Pause autoplay
            {:else}
              Play autoplay
            {/if}
          </button>
        </div>
      </div>

      <div class="terminal">
        <div class="terminal-chrome">
          <div class="dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-amber"></span>
            <span class="dot dot-green"></span>
          </div>
          <p class="terminal-title">atmux-demo</p>
        </div>
        <div class="terminal-body">
          {#each active.lines as line}
            <p class={`terminal-line ${lineRoleClass(line.role)}`}>
              {#each line.segments as segment}
                <span class={toneClass(segment.tone)}>{segment.text}</span>
              {/each}
            </p>
          {/each}
        </div>
      </div>

      {#if active.bullets?.length}
        <ul class="bullet-list">
          {#each active.bullets as bullet}
            <li>{bullet}</li>
          {/each}
        </ul>
      {/if}

      <div class="progress-dots" role="tablist" aria-label="Feature slides">
        {#each slides as slide, idx (slide.id)}
          <button
            type="button"
            role="tab"
            aria-selected={idx === activeIndex}
            aria-label={`Go to ${slide.title}`}
            class={`progress-dot ${idx === activeIndex ? "active" : ""}`}
            on:click={() => goTo(idx)}
          ></button>
        {/each}
      </div>
    </div>
  {/if}
</section>

<style>
  .feature-flip {
    margin: 2.5rem 0;
  }

  .feature-shell {
    border: 1px solid rgb(148 163 184 / 0.35);
    border-radius: 0.9rem;
    padding: 1rem;
    background: linear-gradient(
      145deg,
      rgb(15 23 42 / 0.06) 0%,
      rgb(15 23 42 / 0.02) 45%,
      rgb(255 255 255 / 0.8) 100%
    );
  }

  .feature-header {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .eyebrow {
    margin: 0;
    font-size: 0.75rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgb(15 118 110);
    font-weight: 650;
  }

  .feature-title {
    margin: 0.35rem 0 0;
    font-size: 1.35rem;
    line-height: 1.25;
    color: rgb(15 23 42);
  }

  .feature-body {
    margin: 0.5rem 0 0;
    color: rgb(51 65 85);
    max-width: 60ch;
  }

  .feature-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .btn {
    border-radius: 9999px;
    border: 1px solid rgb(148 163 184 / 0.6);
    background: white;
    color: rgb(30 41 59);
    font-size: 0.85rem;
    line-height: 1;
    padding: 0.45rem 0.75rem;
    cursor: pointer;
  }

  .btn:hover {
    border-color: rgb(14 116 144 / 0.7);
    color: rgb(14 116 144);
  }

  .btn-ghost {
    border-style: dashed;
  }

  .terminal {
    margin-top: 1rem;
    border-radius: 0.8rem;
    border: 1px solid rgb(30 41 59 / 0.55);
    overflow: hidden;
    background: rgb(2 6 23);
    box-shadow: 0 12px 30px rgb(2 6 23 / 0.22);
  }

  .terminal-chrome {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.45rem 0.7rem;
    border-bottom: 1px solid rgb(100 116 139 / 0.35);
    background: rgb(15 23 42);
  }

  .dots {
    display: flex;
    gap: 0.4rem;
  }

  .dot {
    width: 0.58rem;
    height: 0.58rem;
    border-radius: 9999px;
    display: inline-block;
  }

  .dot-red {
    background: rgb(248 113 113);
  }

  .dot-amber {
    background: rgb(251 191 36);
  }

  .dot-green {
    background: rgb(52 211 153);
  }

  .terminal-title {
    margin: 0;
    color: rgb(148 163 184);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .terminal-body {
    padding: 0.9rem 0.85rem 1rem;
    font-family:
      "SFMono-Regular", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-size: 0.86rem;
    line-height: 1.45;
  }

  .terminal-line {
    margin: 0 0 0.16rem;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .bullet-list {
    margin: 0.9rem 0 0;
    padding: 0 0 0 1.15rem;
    color: rgb(51 65 85);
    display: grid;
    gap: 0.35rem;
  }

  .bullet-list li {
    margin: 0;
  }

  .progress-dots {
    margin-top: 0.8rem;
    display: flex;
    gap: 0.38rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .progress-dot {
    border: 0;
    width: 0.62rem;
    height: 0.62rem;
    border-radius: 9999px;
    background: rgb(148 163 184 / 0.45);
    cursor: pointer;
    padding: 0;
  }

  .progress-dot.active {
    background: rgb(20 184 166);
    transform: scale(1.12);
  }
</style>
