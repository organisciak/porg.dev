<script lang="ts">
  export let score: number = 0;
  export let tooltip: string | null = null;
  export let maxScore: number = 10;

  export let colorStart: string = "rgb(139 92 246)";
  // If you want to mark the first of the remaining bars, set this
  export let markCurrent: boolean = false;

  let remaining: number;
  $: remaining = score < maxScore ? maxScore - score : 0;

  export let size: "base" | "lg" = "base";
  const sizedStyles = {
    base: "w-1 h-5 rounded-full m-px",
    lg: "w-1.5 h-10 rounded-md m-0.5",
  };
  const tailwindstyles = sizedStyles[size];
  const remainingClassBg = "bg-gray-300 dark:bg-gray-500";
  const beHelpful: boolean = true;

  let currentClassBg = remainingClassBg;
  $: if (markCurrent) {
    currentClassBg = "bg-violet-300 dark:bg-violet-500";
  }
</script>

<div class="flex flex-row flex-wrap justify-center" title={tooltip ? tooltip : undefined}>
  {#if score > 0}
    {#each Array(Math.round(score + (beHelpful ? 0.4 : 0))) as _}
      <div class={tailwindstyles} style="background-color:{colorStart}"></div>
    {/each}
  {/if}
  {#if remaining > 0}
    {#each Array(1) as _}
      <div class="{tailwindstyles} {currentClassBg}"></div>
    {/each}
  {/if}
  {#if remaining > 1}
    {#each Array(remaining - 1) as _}
      <div class="{tailwindstyles} {remainingClassBg}"></div>
    {/each}
  {/if}
</div>
