<script lang="ts">
  // Static promo card for etc.porg.dev
</script>

<a
  href="https://etc.porg.dev"
  target="_blank"
  rel="noopener noreferrer"
  class="fun-card etc-card"
>
  <div class="fun-card-header">
    <span class="fun-card-title etc-title">ETC.PORG.DEV</span>
  </div>
  <div class="etc-visual">
    <img
      src="https://etc.porg.dev/images/bloops.png"
      alt="etc.porg.dev toys"
      class="etc-img"
    />
  </div>
  <span class="etc-desc">WEB TOYS + EXPERIMENTS</span>
  <span class="etc-prompt">OPEN PORTAL</span>
</a>

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

  .etc-card {
    text-decoration: none;
    transition: all 0.2s;
    align-items: center;
  }

  .etc-card:hover {
    border-color: #00ccff;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.3);
  }

  .etc-title {
    color: #00ccff;
  }

  .etc-visual {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .etc-img {
    max-width: 110px;
    height: auto;
    image-rendering: pixelated;
  }

  .etc-desc {
    font-size: 0.45rem;
    color: #888;
    text-align: center;
  }

  .etc-prompt {
    font-size: 0.55rem;
    color: #ffcc00;
    text-shadow: 0 0 8px rgba(255, 204, 0, 0.6);
    letter-spacing: 0.02em;
  }

  :global(html:not(.dark)) .fun-card {
    background: #fffdf8;
    border-color: #e6dfd5;
    color: #5b5b70;
  }

  :global(html:not(.dark)) .fun-card-title {
    color: #7c3aed;
  }

  :global(html:not(.dark)) .etc-card:hover {
    border-color: #7c3aed;
    box-shadow: 0 0 10px rgba(124, 58, 237, 0.25);
  }

  :global(html:not(.dark)) .etc-title {
    color: #7c3aed;
  }

  :global(html:not(.dark)) .etc-desc {
    color: #5b5b70;
  }

  :global(html:not(.dark)) .etc-prompt {
    color: #2f9e44;
    text-shadow: none;
  }
</style>
