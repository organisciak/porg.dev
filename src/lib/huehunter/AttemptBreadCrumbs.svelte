<script lang="ts">
  export let attempts: number = 0;
  export let maxAttempts: number = 5;

  let remaining: number;
  $: remaining = attempts < maxAttempts ? maxAttempts - attempts : 0;
</script>

<div
  class="crumbs"
  role="meter"
  aria-label="Attempts used"
  aria-valuemin={0}
  aria-valuemax={maxAttempts}
  aria-valuenow={attempts}
  aria-valuetext="{attempts} of {maxAttempts} attempts used"
>
  {#each Array(attempts) as _, i}
    <div class="crumb filled" aria-hidden="true"></div>
  {/each}
  {#if remaining > 0}
    <div class="crumb active" aria-hidden="true"></div>
  {/if}
  {#if remaining > 1}
    {#each Array(remaining - 1) as _, i}
      <div class="crumb" aria-hidden="true"></div>
    {/each}
  {/if}
</div>

<style>
  .crumbs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.3rem;
  }

  .crumb {
    width: 22px;
    height: 6px;
    border: 1px solid #2f2f58;
    background: #2a2a44;
    box-shadow: inset 0 0 0 1px #0a0a1a;
  }

  .crumb.filled {
    background: #5a5a7f;
  }

  .crumb.active {
    background: linear-gradient(90deg, #ffcc00, #ff0066);
  }
</style>
