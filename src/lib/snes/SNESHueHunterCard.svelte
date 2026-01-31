<script lang="ts">
  // No dynamic data needed - this is a static promotional card
</script>

<a href="/huehunter" class="fun-card hue-hunter-card">
  <div class="fun-card-header">
    <span class="fun-card-title hue-hunter-title">HUE HUNTER</span>
  </div>
  <div class="hue-hunter-visual">
    <img src="/huehunter-assets/color-mix_RGBmix.webp" alt="Hue Hunter" class="hue-hunter-img" />
  </div>
  <span class="hue-hunter-desc">COLOR GUESSING GAME</span>
  <span class="play-prompt">▶ PLAY</span>
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

  .hue-hunter-card {
    text-decoration: none;
    transition: all 0.2s;
    align-items: center;
  }

  .hue-hunter-card:hover {
    border-color: #ffcc00;
    box-shadow: 0 0 10px rgba(255, 204, 0, 0.3);
  }

  .hue-hunter-title {
    background: linear-gradient(90deg, #ff0066, #ffcc00, #00ccff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .hue-hunter-visual {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .hue-hunter-img {
    max-width: 80px;
    height: auto;
    image-rendering: pixelated;
  }

  .hue-hunter-desc {
    font-size: 0.45rem;
    color: #888;
    text-align: center;
  }

  .play-prompt {
    font-size: 0.55rem;
    color: #00ff00;
    text-shadow: 0 0 8px #00ff00;
    animation: pulse-play 1.5s ease-in-out infinite;
  }

  :global(html:not(.dark)) .fun-card {
    background: #fffdf8;
    border-color: #e6dfd5;
    color: #5b5b70;
  }

  :global(html:not(.dark)) .fun-card-title {
    color: #7c3aed;
  }

  :global(html:not(.dark)) .hue-hunter-card {
    border-color: #e6dfd5;
  }

  :global(html:not(.dark)) .hue-hunter-card:hover {
    border-color: #7c3aed;
    box-shadow: 0 0 10px rgba(124, 58, 237, 0.25);
  }

  :global(html:not(.dark)) .hue-hunter-desc {
    color: #5b5b70;
  }

  :global(html:not(.dark)) .play-prompt {
    color: #2f9e44;
    text-shadow: none;
  }

  @keyframes pulse-play {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
