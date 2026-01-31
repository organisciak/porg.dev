<script lang="ts">
  const rawMap = [
    "#########################################",
    "#..CV...............##........BLOG....#",
    "#...................##...............#",
    "#...........##########...............#",
    "#....................................#",
    "#..GAMES........ETC..................#",
    "#....................................#",
    "#########################################",
  ];

  const mapWidth = Math.max(...rawMap.map((row) => row.length));
  const mapRows = rawMap.map((row) => row.padEnd(mapWidth, "#").split(""));
  const mapHeight = mapRows.length;

  const locations = [
    {
      name: "CV",
      href: "/cv",
      hint: "Curriculum Vitae",
      x1: 2,
      x2: 10,
      y1: 1,
      y2: 2,
    },
    {
      name: "BLOG",
      href: "/p",
      hint: "Posts & writing",
      x1: 26,
      x2: 36,
      y1: 1,
      y2: 2,
    },
    {
      name: "GAMES",
      href: "/huehunter",
      hint: "Play Hue Hunter",
      x1: 2,
      x2: 12,
      y1: 5,
      y2: 6,
    },
    {
      name: "ETC",
      href: "https://etc.porg.dev",
      hint: "Experiments hub",
      x1: 14,
      x2: 22,
      y1: 5,
      y2: 6,
    },
  ];

  let player = { x: 6, y: 4 };
  let compactMode = false;
  let mapEl: HTMLDivElement | null = null;

  const compactWidth = 23;
  const compactHeight = 9;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function isWalkable(x: number, y: number) {
    if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) return false;
    return mapRows[y][x] !== "#";
  }

  function move(dx: number, dy: number) {
    const next = { x: player.x + dx, y: player.y + dy };
    if (!isWalkable(next.x, next.y)) return;
    player = next;
  }

  function findLocation() {
    return locations.find(
      (loc) => player.x >= loc.x1 && player.x <= loc.x2 && player.y >= loc.y1 && player.y <= loc.y2
    );
  }

  function enterLocation() {
    const loc = findLocation();
    if (!loc) return;
    if (loc.href.startsWith("http")) {
      window.open(loc.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = loc.href;
    }
  }

  function warpTo(locIndex: number) {
    const loc = locations[locIndex];
    player = {
      x: Math.floor((loc.x1 + loc.x2) / 2),
      y: loc.y1,
    };
    mapEl?.focus();
  }

  function toggleMode() {
    compactMode = !compactMode;
    mapEl?.focus();
  }

  function handleKeydown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    let handled = true;

    if (key === "arrowup" || key === "w") {
      move(0, -1);
    } else if (key === "arrowdown" || key === "s") {
      move(0, 1);
    } else if (key === "arrowleft" || key === "a") {
      move(-1, 0);
    } else if (key === "arrowright" || key === "d") {
      move(1, 0);
    } else if (key === "enter") {
      enterLocation();
    } else if (key === "m") {
      toggleMode();
    } else {
      handled = false;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  function buildDisplayRows() {
    const grid = mapRows.map((row) => row.slice());
    if (grid[player.y] && grid[player.y][player.x]) {
      grid[player.y][player.x] = "@";
    }

    const full = grid.map((row) => row.join(""));
    if (!compactMode || mapWidth <= compactWidth || mapHeight <= compactHeight) {
      return full;
    }

    const maxStartX = Math.max(0, mapWidth - compactWidth);
    const maxStartY = Math.max(0, mapHeight - compactHeight);
    const startX = clamp(player.x - Math.floor(compactWidth / 2), 0, maxStartX);
    const startY = clamp(player.y - Math.floor(compactHeight / 2), 0, maxStartY);

    return full.slice(startY, startY + compactHeight).map((row) => row.slice(startX, startX + compactWidth));
  }

  $: activeLocation = findLocation();
  $: displayRows = buildDisplayRows();
</script>

<section class="ascii-nav" data-ascii-nav>
  <div class="ascii-header">
    <div class="ascii-title">ADVENTURE NAV</div>
    <button class="mode-toggle" on:click={toggleMode} type="button">
      {compactMode ? "FULL VIEW" : "WORLD VIEW"}
    </button>
  </div>

  <div class="ascii-map" bind:this={mapEl} tabindex="0" on:keydown={handleKeydown}>
    <pre>{displayRows.join("\n")}</pre>
  </div>

  <div class="ascii-hud">
    <div class="hud-line">
      LOCATION:
      <span class="hud-value">{activeLocation ? activeLocation.name : "WILDERNESS"}</span>
    </div>
    <div class="hud-line">
      {#if activeLocation}
        <span class="hud-value">PRESS ENTER</span> to travel → {activeLocation.hint}
      {:else}
        <span class="hud-value">WASD / ARROWS</span> to move · <span class="hud-value">M</span> to toggle view
      {/if}
    </div>
  </div>

  <div class="ascii-warp">
    {#each locations as loc, index}
      <button class="warp-button" type="button" on:click={() => warpTo(index)}>
        {loc.name}
      </button>
    {/each}
  </div>

  <div class="ascii-note">
    Click the map to focus, then explore.
  </div>
</section>

<style>
  .ascii-nav {
    width: 100%;
    max-width: 640px;
    border: 2px solid #333;
    background: rgba(0, 0, 0, 0.35);
    padding: 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .ascii-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .ascii-title {
    font-size: 0.6rem;
    color: #ffcc00;
    letter-spacing: 0.08em;
  }

  .mode-toggle {
    background: none;
    border: 1px solid #555;
    color: #88ccff;
    font-family: inherit;
    font-size: 0.5rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
  }

  .mode-toggle:hover {
    color: #ffcc00;
    border-color: #ffcc00;
  }

  .ascii-map {
    background: #0c0c18;
    border: 1px solid #555;
    padding: 0.6rem;
    color: #88ccff;
    font-size: 0.45rem;
    line-height: 1.3;
    text-shadow: 0 0 8px rgba(136, 204, 255, 0.25);
    cursor: pointer;
  }

  .ascii-map:focus {
    outline: 2px solid #ffcc00;
    box-shadow: 0 0 10px rgba(255, 204, 0, 0.3);
  }

  pre {
    margin: 0;
    font-family: "Press Start 2P", monospace;
    white-space: pre;
  }

  .ascii-hud {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.5rem;
    color: #888;
  }

  .hud-value {
    color: #ff6600;
  }

  .ascii-warp {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .warp-button {
    background: none;
    border: 1px solid #444;
    color: #aaa;
    font-family: inherit;
    font-size: 0.5rem;
    padding: 0.2rem 0.4rem;
    cursor: pointer;
  }

  .warp-button:hover {
    color: #ffcc00;
    border-color: #ffcc00;
  }

  .ascii-note {
    font-size: 0.45rem;
    color: #555;
    text-align: center;
  }

  :global(html:not(.dark)) .ascii-nav {
    background: #fffdf8;
    border-color: #e6dfd5;
  }

  :global(html:not(.dark)) .ascii-title {
    color: #7c3aed;
  }

  :global(html:not(.dark)) .mode-toggle {
    color: #7c3aed;
    border-color: #d7c8ba;
  }

  :global(html:not(.dark)) .mode-toggle:hover {
    color: #5b21b6;
    border-color: #5b21b6;
  }

  :global(html:not(.dark)) .ascii-map {
    background: #faf7f2;
    border-color: #e6dfd5;
    color: #5b5b70;
    text-shadow: none;
  }

  :global(html:not(.dark)) .ascii-map:focus {
    outline-color: #7c3aed;
    box-shadow: 0 0 8px rgba(124, 58, 237, 0.25);
  }

  :global(html:not(.dark)) .ascii-hud {
    color: #7c7c90;
  }

  :global(html:not(.dark)) .hud-value {
    color: #ff9f1c;
  }

  :global(html:not(.dark)) .warp-button {
    color: #5b5b70;
    border-color: #d7c8ba;
  }

  :global(html:not(.dark)) .warp-button:hover {
    color: #5b21b6;
    border-color: #5b21b6;
  }

  :global(html:not(.dark)) .ascii-note {
    color: #9b8f82;
  }
</style>
