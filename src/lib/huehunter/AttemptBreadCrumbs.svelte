<script lang="ts">
  export let attempts: number = 0;
  export let maxAttempts: number = 5;

  let remaining: number;
  $: remaining = attempts < maxAttempts ? maxAttempts - attempts : 0;
</script>

<div class="crumbs">
  {#each Array(attempts) as _, i}
    <div class="crumb filled"></div>
  {/each}
  {#if remaining > 0}
    <div class="crumb active"></div>
  {/if}
  {#if remaining > 1}
    {#each Array(remaining - 1) as _, i}
      <div class="crumb"></div>
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
