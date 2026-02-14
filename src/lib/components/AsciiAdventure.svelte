<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  type Props = {
    mode?: "expanded" | "narrow";
    onNavigate?: (route: string) => void;
  };

  let { mode = "expanded", onNavigate }: Props = $props();

  // Map dimensions
  const MAP_W = 44;
  const MAP_H = 28;

  // Tile types
  const WALL = "#";
  const FLOOR = " ";
  const DOOR = "▒";
  const WATER = "~";
  const TREE = "♣";
  const PATH = "·";
  const SIGN = "!";
  const NPC = "?";

  // Zone definitions - where doors lead
  type Zone = {
    name: string;
    route: string;
    labelRow: number;
    labelCol: number;
    doors: [number, number][];
  };

  const zones: Zone[] = [
    {
      name: "LIBRARY",
      route: "/p",
      labelRow: 4,
      labelCol: 5,
      doors: [
        [8, 9],
        [8, 10],
      ],
    },
    {
      name: "OFFICE",
      route: "/cv",
      labelRow: 4,
      labelCol: 28,
      doors: [
        [8, 32],
        [8, 33],
      ],
    },
    {
      name: "ARCADE",
      route: "/huehunter",
      labelRow: 16,
      labelCol: 5,
      doors: [
        [20, 9],
        [20, 10],
      ],
    },
    {
      name: "LAB",
      route: "/colors",
      labelRow: 16,
      labelCol: 29,
      doors: [
        [20, 32],
        [20, 33],
      ],
    },
  ];

  // Build the map
  function buildMap(): string[][] {
    const map: string[][] = [];
    for (let r = 0; r < MAP_H; r++) {
      map[r] = [];
      for (let c = 0; c < MAP_W; c++) {
        map[r][c] = FLOOR;
      }
    }

    // Outer border
    for (let c = 0; c < MAP_W; c++) {
      map[0][c] = c === 0 ? "╔" : c === MAP_W - 1 ? "╗" : "═";
      map[MAP_H - 1][c] = c === 0 ? "╚" : c === MAP_W - 1 ? "╝" : "═";
    }
    for (let r = 1; r < MAP_H - 1; r++) {
      map[r][0] = "║";
      map[r][MAP_W - 1] = "║";
    }

    // Title
    const title = "PORG.DEV  WORLD";
    const titleStart = Math.floor((MAP_W - title.length) / 2);
    for (let i = 0; i < title.length; i++) {
      map[1][titleStart + i] = title[i];
    }

    // Buildings
    drawBuilding(map, 3, 4, 7, 14, "LIBRARY", "📚");
    drawBuilding(map, 3, 27, 7, 14, "OFFICE", "📋");
    drawBuilding(map, 15, 4, 7, 14, "ARCADE", "🕹️");
    drawBuilding(map, 15, 27, 7, 14, "LAB", "🔬");

    // Paths between buildings
    for (let c = 10; c <= 33; c++) {
      map[11][c] = PATH;
      map[12][c] = PATH;
    }
    for (let r = 9; r <= 19; r++) {
      map[r][21] = PATH;
      map[r][22] = PATH;
    }

    // Central plaza
    for (let r = 11; r <= 13; r++) {
      for (let c = 20; c <= 23; c++) {
        map[r][c] = PATH;
      }
    }
    map[12][21] = "★";
    map[12][22] = " ";

    // Pond
    for (let r = 23; r <= 25; r++) {
      for (let c = 19; c <= 25; c++) {
        if (r === 23 && (c === 19 || c === 25)) continue;
        if (r === 25 && (c === 19 || c === 25)) continue;
        map[r][c] = WATER;
      }
    }
    map[24][22] = "🐟"[0]; // just use ~

    // Trees / decoration
    const treePositions = [
      [2, 2],
      [2, 41],
      [26, 2],
      [26, 41],
      [10, 2],
      [10, 41],
      [14, 2],
      [14, 41],
      [22, 3],
      [22, 40],
      [22, 5],
      [22, 38],
      [26, 15],
      [26, 28],
      [23, 35],
      [25, 36],
      [24, 37],
      [23, 3],
      [25, 4],
      [24, 5],
    ];
    for (const [r, c] of treePositions) {
      if (
        r > 0 &&
        r < MAP_H - 1 &&
        c > 0 &&
        c < MAP_W - 1 &&
        map[r][c] === FLOOR
      ) {
        map[r][c] = TREE;
      }
    }

    // Signs
    map[10][10] = SIGN;
    map[10][33] = SIGN;
    map[22][10] = SIGN;
    map[22][33] = SIGN;

    // NPC in central plaza
    map[13][21] = NPC;

    return map;
  }

  function drawBuilding(
    map: string[][],
    startRow: number,
    startCol: number,
    height: number,
    width: number,
    label: string,
    _icon: string
  ) {
    const endRow = startRow + height - 1;
    const endCol = startCol + width - 1;

    // Top wall
    for (let c = startCol; c <= endCol; c++) {
      if (c === startCol) map[startRow][c] = "┌";
      else if (c === endCol) map[startRow][c] = "┐";
      else map[startRow][c] = "─";
    }

    // Bottom wall with door
    const doorLeft = startCol + Math.floor(width / 2) - 1;
    const doorRight = doorLeft + 1;
    for (let c = startCol; c <= endCol; c++) {
      if (c === startCol) map[endRow][c] = "└";
      else if (c === endCol) map[endRow][c] = "┘";
      else if (c === doorLeft || c === doorRight) map[endRow][c] = DOOR;
      else map[endRow][c] = "─";
    }

    // Side walls
    for (let r = startRow + 1; r < endRow; r++) {
      map[r][startCol] = "│";
      map[r][endCol] = "│";
    }

    // Interior floor
    for (let r = startRow + 1; r < endRow; r++) {
      for (let c = startCol + 1; c < endCol; c++) {
        map[r][c] = "░";
      }
    }

    // Label inside
    const labelStart = startCol + Math.floor((width - label.length) / 2);
    for (let i = 0; i < label.length; i++) {
      map[startRow + 2][labelStart + i] = label[i];
    }
  }

  const gameMap = buildMap();

  // Player state
  let playerRow = $state(12);
  let playerCol = $state(11);
  let message = $state("Use WASD or arrow keys to explore!");
  let messageTimeout: ReturnType<typeof setTimeout> | null = null;
  let navigating = $state(false);

  // Narrow mode viewport
  const NARROW_VIEW_W = 20;
  const NARROW_VIEW_H = 14;

  function isWalkable(r: number, c: number): boolean {
    if (r <= 0 || r >= MAP_H - 1 || c <= 0 || c >= MAP_W - 1) return false;
    const tile = gameMap[r][c];
    return (
      tile === FLOOR ||
      tile === PATH ||
      tile === DOOR ||
      tile === "★" ||
      tile === " "
    );
  }

  function showMessage(msg: string, duration = 3000) {
    message = msg;
    if (messageTimeout) clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
      message = "";
    }, duration);
  }

  function checkTile(r: number, c: number) {
    const tile = gameMap[r][c];

    // Door - navigate
    if (tile === DOOR) {
      for (const zone of zones) {
        for (const [dr, dc] of zone.doors) {
          if (dr === r && dc === c) {
            navigating = true;
            showMessage(`Entering ${zone.name}...`, 2000);
            setTimeout(() => {
              if (onNavigate) {
                onNavigate(zone.route);
              } else {
                goto(zone.route);
              }
            }, 600);
            return;
          }
        }
      }
    }
  }

  function checkAdjacent(r: number, c: number) {
    // Check adjacent tiles for signs and NPCs
    const adjacent = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    for (const [ar, ac] of adjacent) {
      if (ar < 0 || ar >= MAP_H || ac < 0 || ac >= MAP_W) continue;
      const tile = gameMap[ar][ac];
      if (tile === SIGN) {
        // Find nearest zone
        const nearestZone = zones.reduce((closest, z) => {
          const dist = Math.abs(z.labelRow - ar) + Math.abs(z.labelCol - ac);
          const closestDist =
            Math.abs(closest.labelRow - ar) + Math.abs(closest.labelCol - ac);
          return dist < closestDist ? z : closest;
        });
        showMessage(`${nearestZone.name} → ${nearestZone.route}`);
      }
      if (tile === NPC) {
        const npcMessages = [
          "Welcome to porg.dev! Explore the world!",
          "Try visiting the LIBRARY for blog posts!",
          "The ARCADE has fun games to play!",
          "Check out the LAB for color tools!",
          "The OFFICE has the full CV!",
        ];
        showMessage(
          npcMessages[Math.floor(Math.random() * npcMessages.length)]
        );
      }
    }
  }

  function move(dr: number, dc: number) {
    if (navigating) return;
    const newRow = playerRow + dr;
    const newCol = playerCol + dc;
    if (isWalkable(newRow, newCol)) {
      playerRow = newRow;
      playerCol = newCol;
      checkTile(newRow, newCol);
      checkAdjacent(newRow, newCol);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    // Don't capture if user is typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    )
      return;

    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        e.preventDefault();
        move(-1, 0);
        break;
      case "ArrowDown":
      case "s":
      case "S":
        e.preventDefault();
        move(1, 0);
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        e.preventDefault();
        move(0, -1);
        break;
      case "ArrowRight":
      case "d":
      case "D":
        e.preventDefault();
        move(0, 1);
        break;
    }
  }

  // Touch controls
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 20) return; // too small

    if (absDx > absDy) {
      move(0, dx > 0 ? 1 : -1);
    } else {
      move(dy > 0 ? 1 : -1, 0);
    }
  }

  onMount(() => {
    if (browser) {
      window.addEventListener("keydown", handleKeydown);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("keydown", handleKeydown);
    }
    if (messageTimeout) clearTimeout(messageTimeout);
  });

  // Render functions
  function getTileClass(tile: string): string {
    switch (tile) {
      case "═":
      case "║":
      case "╔":
      case "╗":
      case "╚":
      case "╝":
        return "tile-border";
      case "─":
      case "│":
      case "┌":
      case "┐":
      case "└":
      case "┘":
        return "tile-wall";
      case DOOR:
        return "tile-door";
      case WATER:
        return "tile-water";
      case TREE:
        return "tile-tree";
      case PATH:
        return "tile-path";
      case "░":
        return "tile-interior";
      case "★":
        return "tile-star";
      case SIGN:
        return "tile-sign";
      case NPC:
        return "tile-npc";
      default:
        if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ .".includes(tile))
          return "tile-label";
        return "tile-floor";
    }
  }

  function renderMap(): { char: string; cls: string }[][] {
    const rows: { char: string; cls: string }[][] = [];

    let startR = 0,
      startC = 0,
      endR = MAP_H,
      endC = MAP_W;

    if (mode === "narrow") {
      startR = Math.max(
        0,
        Math.min(playerRow - Math.floor(NARROW_VIEW_H / 2), MAP_H - NARROW_VIEW_H)
      );
      startC = Math.max(
        0,
        Math.min(playerCol - Math.floor(NARROW_VIEW_W / 2), MAP_W - NARROW_VIEW_W)
      );
      endR = Math.min(MAP_H, startR + NARROW_VIEW_H);
      endC = Math.min(MAP_W, startC + NARROW_VIEW_W);
    }

    for (let r = startR; r < endR; r++) {
      const row: { char: string; cls: string }[] = [];
      for (let c = startC; c < endC; c++) {
        if (r === playerRow && c === playerCol) {
          row.push({ char: "@", cls: "tile-player" });
        } else {
          const tile = gameMap[r][c];
          row.push({ char: tile, cls: getTileClass(tile) });
        }
      }
      rows.push(row);
    }
    return rows;
  }

  // Derive rendered map from player position (accessing playerRow/playerCol triggers reactivity)
  let renderedMap = $derived.by(() => {
    // Reference state vars so Svelte tracks them
    const _r = playerRow;
    const _c = playerCol;
    return renderMap();
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="adventure-container"
  class:narrow={mode === "narrow"}
  class:expanded={mode === "expanded"}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  role="application"
  aria-label="ASCII Adventure Game - use WASD or arrow keys to move"
  tabindex="0"
>
  <div class="game-frame">
    {#if mode === "expanded"}
      <div class="frame-title">
        <span class="frame-deco">[ </span>EXPLORE<span class="frame-deco"> ]</span>
      </div>
    {/if}

    <div class="map-viewport">
      <pre class="map">{#each renderedMap as row, ri}{#each row as cell}<span class={cell.cls}>{cell.char}</span>{/each}{#if ri < renderedMap.length - 1}
{/if}{/each}</pre>
    </div>

    {#if message}
      <div class="message-bar">
        <span class="msg-arrow">▸</span> {message}
      </div>
    {/if}

    <div class="controls-bar">
      <span class="key">W</span><span class="key">A</span><span class="key">S</span><span class="key">D</span>
      <span class="ctrl-text">MOVE</span>
      <span class="ctrl-sep">│</span>
      <span class="ctrl-text">WALK INTO ▒ TO ENTER</span>
    </div>

    {#if mode === "expanded"}
      <div class="legend">
        <span class="legend-item"><span class="tile-player">@</span> YOU</span>
        <span class="legend-item"><span class="tile-door">▒</span> DOOR</span>
        <span class="legend-item"><span class="tile-sign">!</span> SIGN</span>
        <span class="legend-item"><span class="tile-npc">?</span> NPC</span>
        <span class="legend-item"><span class="tile-star">★</span> PLAZA</span>
      </div>
    {/if}

    <!-- Mobile D-pad -->
    <div class="dpad">
      <button class="dpad-btn dpad-up" onclick={() => move(-1, 0)} aria-label="Move up">▲</button>
      <div class="dpad-mid">
        <button class="dpad-btn dpad-left" onclick={() => move(0, -1)} aria-label="Move left">◄</button>
        <div class="dpad-center"></div>
        <button class="dpad-btn dpad-right" onclick={() => move(0, 1)} aria-label="Move right">►</button>
      </div>
      <button class="dpad-btn dpad-down" onclick={() => move(1, 0)} aria-label="Move down">▼</button>
    </div>
  </div>
</div>

<style>
  .adventure-container {
    font-family: "Press Start 2P", monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    outline: none;
  }

  .adventure-container.expanded {
    padding: 1rem;
  }

  .adventure-container.narrow {
    padding: 0.5rem;
  }

  .game-frame {
    border: 3px solid #3a3a6a;
    background: #0a0a1a;
    padding: 0.5rem;
    position: relative;
    box-shadow:
      0 0 20px rgba(100, 100, 255, 0.1),
      inset 0 0 30px rgba(0, 0, 0, 0.5);
  }

  .game-frame::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.08) 0px,
      rgba(0, 0, 0, 0.08) 1px,
      transparent 1px,
      transparent 3px
    );
    z-index: 5;
  }

  .frame-title {
    text-align: center;
    font-size: 0.6rem;
    color: #ffcc00;
    padding: 0.25rem 0 0.5rem;
    letter-spacing: 0.2em;
    text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
  }

  .frame-deco {
    color: #3a3a6a;
  }

  .map-viewport {
    overflow: hidden;
    position: relative;
  }

  .map {
    margin: 0;
    padding: 0;
    line-height: 1.35;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    font-family: "Press Start 2P", monospace;
    position: relative;
    z-index: 1;
  }

  .narrow .map {
    font-size: 0.6rem;
    line-height: 1.3;
  }

  /* Tile colors */
  .tile-border {
    color: #4a4a8a;
  }

  .tile-wall {
    color: #8b7355;
  }

  .tile-door {
    color: #ffcc00;
    text-shadow: 0 0 6px rgba(255, 204, 0, 0.6);
    animation: door-glow 2s ease-in-out infinite;
  }

  @keyframes door-glow {
    0%, 100% { text-shadow: 0 0 4px rgba(255, 204, 0, 0.4); }
    50% { text-shadow: 0 0 10px rgba(255, 204, 0, 0.8); }
  }

  .tile-water {
    color: #4488cc;
    animation: water-shimmer 3s ease-in-out infinite;
  }

  @keyframes water-shimmer {
    0%, 100% { color: #4488cc; }
    50% { color: #66aaee; }
  }

  .tile-tree {
    color: #338833;
  }

  .tile-path {
    color: #555;
  }

  .tile-interior {
    color: #222233;
  }

  .tile-star {
    color: #ffcc00;
    text-shadow: 0 0 8px rgba(255, 204, 0, 0.6);
  }

  .tile-sign {
    color: #ff6600;
    text-shadow: 0 0 4px rgba(255, 102, 0, 0.4);
  }

  .tile-npc {
    color: #88ccff;
    animation: npc-bob 1.5s ease-in-out infinite;
  }

  @keyframes npc-bob {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .tile-label {
    color: #aaa;
  }

  .tile-floor {
    color: #1a1a2a;
  }

  .tile-player {
    color: #00ff88;
    text-shadow: 0 0 8px rgba(0, 255, 136, 0.7);
    font-weight: bold;
  }

  .message-bar {
    font-size: 0.55rem;
    color: #88ccff;
    padding: 0.4rem 0.5rem;
    border-top: 1px solid #2a2a4a;
    margin-top: 0.25rem;
    text-shadow: 0 0 6px rgba(136, 204, 255, 0.4);
    animation: msg-appear 0.2s ease-out;
    position: relative;
    z-index: 1;
  }

  @keyframes msg-appear {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg-arrow {
    color: #ffcc00;
  }

  .controls-bar {
    font-size: 0.45rem;
    color: #555;
    padding: 0.4rem 0.5rem 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    position: relative;
    z-index: 1;
  }

  .key {
    background: #1a1a2a;
    color: #888;
    padding: 0.15rem 0.3rem;
    border: 1px solid #3a3a5a;
    border-radius: 2px;
    font-size: 0.4rem;
  }

  .ctrl-text {
    color: #555;
  }

  .ctrl-sep {
    color: #333;
    margin: 0 0.25rem;
  }

  .legend {
    font-size: 0.4rem;
    color: #555;
    padding: 0.25rem 0.5rem;
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .legend-item {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  /* D-pad for mobile */
  .dpad {
    display: none;
    flex-direction: column;
    align-items: center;
    margin-top: 0.75rem;
    gap: 0;
    position: relative;
    z-index: 1;
  }

  .dpad-mid {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .dpad-btn {
    width: 2.5rem;
    height: 2.5rem;
    background: #1a1a2a;
    border: 2px solid #3a3a6a;
    color: #888;
    font-family: inherit;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s;
  }

  .dpad-btn:active {
    background: #2a2a4a;
    color: #ffcc00;
  }

  .dpad-center {
    width: 2.5rem;
    height: 2.5rem;
    background: #111122;
    border: 2px solid #2a2a4a;
  }

  .dpad-up { border-radius: 6px 6px 0 0; }
  .dpad-left { border-radius: 6px 0 0 6px; }
  .dpad-right { border-radius: 0 6px 6px 0; }
  .dpad-down { border-radius: 0 0 6px 6px; }

  @media (max-width: 640px) {
    .dpad {
      display: flex;
    }

    .map {
      font-size: 0.55rem;
    }

    .controls-bar {
      display: none;
    }
  }

  /* Light mode */
  :global(html:not(.dark)) .game-frame {
    border-color: #d4c8b8;
    background: #fffdf8;
    box-shadow:
      4px 4px 0 rgba(21, 21, 43, 0.1),
      inset 0 0 30px rgba(0, 0, 0, 0.03);
  }

  :global(html:not(.dark)) .game-frame::before {
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.02) 0px,
      rgba(0, 0, 0, 0.02) 1px,
      transparent 1px,
      transparent 3px
    );
  }

  :global(html:not(.dark)) .frame-title {
    color: #7c3aed;
    text-shadow: none;
  }

  :global(html:not(.dark)) .frame-deco {
    color: #d4c8b8;
  }

  :global(html:not(.dark)) .tile-border {
    color: #c0b3a4;
  }

  :global(html:not(.dark)) .tile-wall {
    color: #8b7355;
  }

  :global(html:not(.dark)) .tile-door {
    color: #ff9f1c;
    text-shadow: 0 0 4px rgba(255, 159, 28, 0.4);
  }

  :global(html:not(.dark)) .tile-water {
    color: #3388cc;
  }

  :global(html:not(.dark)) .tile-tree {
    color: #338833;
  }

  :global(html:not(.dark)) .tile-path {
    color: #c0b3a4;
  }

  :global(html:not(.dark)) .tile-interior {
    color: #eee8dd;
  }

  :global(html:not(.dark)) .tile-star {
    color: #ff9f1c;
    text-shadow: none;
  }

  :global(html:not(.dark)) .tile-sign {
    color: #ff6600;
    text-shadow: none;
  }

  :global(html:not(.dark)) .tile-npc {
    color: #7c3aed;
  }

  :global(html:not(.dark)) .tile-label {
    color: #5b5b70;
  }

  :global(html:not(.dark)) .tile-floor {
    color: #f5f0e8;
  }

  :global(html:not(.dark)) .tile-player {
    color: #7c3aed;
    text-shadow: 0 0 6px rgba(124, 58, 237, 0.4);
  }

  :global(html:not(.dark)) .message-bar {
    color: #5b5b70;
    border-color: #e6dfd5;
    text-shadow: none;
  }

  :global(html:not(.dark)) .msg-arrow {
    color: #ff9f1c;
  }

  :global(html:not(.dark)) .controls-bar {
    color: #7c7c90;
  }

  :global(html:not(.dark)) .key {
    background: #fff6ef;
    border-color: #e6dfd5;
    color: #5b5b70;
  }

  :global(html:not(.dark)) .legend {
    color: #7c7c90;
  }

  :global(html:not(.dark)) .dpad-btn {
    background: #fff6ef;
    border-color: #d4c8b8;
    color: #5b5b70;
  }

  :global(html:not(.dark)) .dpad-btn:active {
    background: #ffe8d4;
    color: #ff9f1c;
  }

  :global(html:not(.dark)) .dpad-center {
    background: #f5f0e8;
    border-color: #e6dfd5;
  }
</style>
