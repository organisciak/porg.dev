<script lang="ts">
  import NotoMoon from "$lib/components/NotoMoon.svelte";
  import { moonCount } from "$lib/huehunter/colorGuesser";

  export let score: number = 0;
  export let tooltip: string | null = null;
  export let maxScore: number = 10;

  let adjustedScore: number;
  let moons: { full: number; partial: number; new: number };

  $: {
    adjustedScore = Math.min(maxScore, score + (beHelpful ? 0.2 : 0));
    moons = moonCount(adjustedScore, maxScore);
  }
  const beHelpful: boolean = true;
</script>

<div class="flex flex-row justify-center" title={tooltip ? tooltip : undefined}>
  {#if moons.full > 0}
    {#each Array(moons.full) as _}
      <div>
        <NotoMoon proportion={1} />
      </div>
    {/each}
  {/if}

  {#if moons.partial > 0}
    <div>
      <NotoMoon proportion={moons.partial} />
    </div>
  {/if}

  {#if moons.new > 0}
    {#each Array(moons.new) as _}
      <div><NotoMoon proportion={0} /></div>
    {/each}
  {/if}
</div>
