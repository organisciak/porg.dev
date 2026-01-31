<script lang="ts">
  import { onMount } from "svelte";

  let currentColor: { name: string; hex: string } | null = null;

  async function fetchColor() {
    try {
      const res = await fetch("/api/random-color");
      currentColor = await res.json();
    } catch (e) {
      console.error("Failed to fetch color", e);
    }
  }

  onMount(() => {
    fetchColor();
  });
</script>

<div class="fun-card">
  <div class="fun-card-header">
    <span class="fun-card-title">COLOR SWATCH</span>
    <button class="refresh-btn" on:click={fetchColor} aria-label="Get new color">↻</button>
  </div>
  {#if currentColor}
    <div class="color-content">
      <div class="color-box" style="background-color: {currentColor.hex};"></div>
      <span class="color-name">{currentColor.name}</span>
      <span class="color-hex">{currentColor.hex}</span>
    </div>
  {:else}
    <div class="loading-text">LOADING...</div>
  {/if}
  <a href="/colors" class="fun-link">BROWSE ALL</a>
</div>

<style>
  .fun-card {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid #444;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-family: "Press Start 2P", monospace;
  }

  .fun-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fun-card-title {
    font-size: 0.5rem;
    color: #ffcc00;
  }

  .refresh-btn {
    background: none;
    border: 1px solid #555;
    color: #888;
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }

  .refresh-btn:hover {
    color: #ffcc00;
    border-color: #ffcc00;
  }

  .loading-text {
    font-size: 0.5rem;
    color: #666;
    text-align: center;
    padding: 1rem 0;
  }

  .color-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .color-box {
    width: 100%;
    height: 50px;
    border: 1px solid #555;
  }

  .color-name {
    font-size: 0.55rem;
    color: #fff;
    text-align: center;
  }

  .color-hex {
    font-size: 0.45rem;
    color: #888;
  }

  .fun-link {
    font-size: 0.45rem;
    color: #88ccff;
    text-decoration: none;
    text-align: center;
    margin-top: auto;
  }

  .fun-link:hover {
    color: #ffcc00;
  }

  :global(html:not(.dark)) .fun-card {
    background: #fffdf8;
    border-color: #e6dfd5;
    color: #5b5b70;
  }

  :global(html:not(.dark)) .fun-card-title {
    color: #7c3aed;
  }

  :global(html:not(.dark)) .refresh-btn {
    color: #7c3aed;
    border-color: #d7c8ba;
  }

  :global(html:not(.dark)) .refresh-btn:hover {
    color: #5b21b6;
    border-color: #5b21b6;
  }

  :global(html:not(.dark)) .loading-text {
    color: #7c7c90;
  }

  :global(html:not(.dark)) .color-name {
    color: #15152b;
  }

  :global(html:not(.dark)) .color-hex {
    color: #7c7c90;
  }

  :global(html:not(.dark)) .fun-link {
    color: #7c3aed;
  }

  :global(html:not(.dark)) .fun-link:hover {
    color: #5b21b6;
  }
</style>
