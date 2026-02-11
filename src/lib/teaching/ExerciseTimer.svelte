<script lang="ts">
  import { onDestroy } from "svelte";
  import type { Snippet } from "svelte";

  interface Phase {
    label: string;
    minutes: number;
  }

  let { phases = [], children }: { phases?: Phase[]; children: Snippet } = $props();

  let totalMinutes = $derived(phases.reduce((sum, p) => sum + p.minutes, 0));

  let started = $state(false);
  let startTime = $state(0);
  let elapsed = $state(0);
  let intervalId: ReturnType<typeof setInterval> | undefined;

  function start() {
    if (started) return;
    started = true;
    startTime = Date.now();
    intervalId = setInterval(() => {
      elapsed = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
  }

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });

  let displayTime = $derived.by(() => {
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  });

  let elapsedMinutes = $derived(elapsed / 60);

  let activePhaseIndex = $derived.by(() => {
    let cumulative = 0;
    for (let i = 0; i < phases.length; i++) {
      cumulative += phases[i].minutes;
      if (elapsedMinutes < cumulative) return i;
    }
    return -1;
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onfocusin={start}>
  {#if phases.length > 0}
    <div class="mb-3">
      {#if !started}
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">~{totalMinutes} min suggested:</span>
          {#each phases as phase, i}
            {#if i > 0}<span class="text-gray-300 dark:text-gray-600">&rarr;</span>{/if}
            <span>{phase.label} ({phase.minutes} min)</span>
          {/each}
        </div>
        <p class="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">Timer starts when you begin. These are suggestions &mdash; adjust to your pace.</p>
      {:else}
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <svg class="h-3.5 w-3.5 shrink-0 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-mono text-sm font-medium tabular-nums text-gray-700 dark:text-gray-200">{displayTime}</span>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          {#each phases as phase, i}
            {#if i > 0}<span class="text-gray-300 dark:text-gray-600">&rarr;</span>{/if}
            <span
              class="rounded-full px-2 py-0.5 transition-colors {activePhaseIndex === i
                ? 'bg-blue-100 font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                : activePhaseIndex === -1 || i < activePhaseIndex
                  ? 'text-gray-400 line-through dark:text-gray-500'
                  : 'text-gray-500 dark:text-gray-400'}"
            >
              {phase.label} ({phase.minutes}m)
            </span>
          {/each}
          {#if activePhaseIndex === -1}
            <span class="text-xs text-green-600 dark:text-green-400">All done!</span>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
  {@render children()}
</div>
