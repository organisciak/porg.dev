<script lang="ts">
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import Fa from "svelte-fa";
  import {
    faHome,
    faBriefcase,
    faNewspaper,
    faSun,
    faMoon,
    faCircleHalfStroke,
  } from "@fortawesome/free-solid-svg-icons";
  import { isCollapsed } from "$lib/stores/headerCollapse";
  import { userPrefersMode, setMode } from "mode-watcher";

  let small = $derived($isCollapsed);
  let currentPreference: "light" | "dark" | "system" = "system";
  let nextPreference: "light" | "dark" | "system" = "light";
  let toggleLabel = "AUTO";
  let toggleIcon = faCircleHalfStroke;
  let ariaLabel = "Switch theme";

  const preferenceLabel = (value: "light" | "dark" | "system") =>
    value === "system" ? "AUTO" : value.toUpperCase();

  const getNextPreference = (value: "light" | "dark" | "system") =>
    value === "light" ? "dark" : value === "dark" ? "system" : "light";

  const cycleTheme = () => {
    setMode(nextPreference);
  };

  $effect(() => {
    currentPreference = (userPrefersMode.current ?? "system") as "light" | "dark" | "system";
    nextPreference = getNextPreference(currentPreference);
    toggleLabel = preferenceLabel(currentPreference);
    toggleIcon =
      currentPreference === "system"
        ? faCircleHalfStroke
        : currentPreference === "light"
          ? faSun
          : faMoon;
    ariaLabel = `Theme: ${toggleLabel}. Switch to ${preferenceLabel(nextPreference)}.`;
  });

  type Link = {
    name: string;
    url: string;
    always: boolean;
    icon?: any;
  };

  const links: Link[] = [
    { name: "HOME", url: "/", always: true, icon: faHome },
    { name: "CV", url: "/cv", always: true, icon: faBriefcase },
    { name: "POSTS", url: "/p", always: true, icon: faNewspaper },
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Press+Start+2P&family=Space+Grotesk:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<header class="site-header" class:small>
  <nav>
    <ul class:small>
      {#each links as link}
        {#if link.always || !small}
          <li class:active={$page.url.pathname === link.url}>
            <a href="{base}{link.url}" data-sveltekit-prefetch title={link.name}>
              {#if small && link.icon}
                <Fa class="icon" icon={link.icon} />
              {:else}
                {link.name}
              {/if}
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </nav>
  <button type="button" class="theme-toggle" aria-label={ariaLabel} on:click={cycleTheme}>
    <Fa class="icon" icon={toggleIcon} />
    <span class="toggle-label">{toggleLabel}</span>
  </button>
</header>

<style>
  .site-header {
    font-family: "Press Start 2P", monospace;
    background: linear-gradient(180deg, #1a1a3a 0%, #0a0a1a 100%);
    border-bottom: 4px solid;
    border-image: repeating-linear-gradient(
        90deg,
        #ffcc00 0px,
        #ffcc00 8px,
        #ff6600 8px,
        #ff6600 16px,
        #ff0066 16px,
        #ff0066 24px,
        #cc00ff 24px,
        #cc00ff 32px,
        #00ccff 32px,
        #00ccff 40px
      )
      1;
    padding: 0.75rem 1rem;
    position: relative;
    z-index: 120;
  }

  .site-header.small {
    padding: 0.4rem 0.75rem;
  }

  .site-header.small .theme-toggle {
    padding: 0.2rem 0.35rem;
    font-size: 0.5rem;
  }

  /* Scanline effect */
  .site-header::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1) 0px,
      rgba(0, 0, 0, 0.1) 1px,
      transparent 1px,
      transparent 2px
    );
  }

  nav {
    position: relative;
    z-index: 1;
  }

  .theme-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: 2px solid #3a3a6a;
    background: rgba(20, 20, 40, 0.85);
    color: #ffcc00;
    font-family: inherit;
    font-size: 0.55rem;
    letter-spacing: 0.08em;
    padding: 0.3rem 0.45rem;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 2;
  }

  .theme-toggle:hover {
    background: rgba(30, 30, 60, 0.95);
    color: #fff;
    box-shadow: 0 0 10px rgba(255, 204, 0, 0.35);
  }

  .theme-toggle :global(.icon) {
    color: inherit;
  }

  .theme-toggle .toggle-label {
    display: inline-block;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 2rem;
    height: 2.5rem;
    align-items: center;
  }

  ul.small {
    gap: 1rem;
    height: 1.5rem;
  }

  li {
    position: relative;
  }

  a {
    color: #888;
    text-decoration: none;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    padding: 0.5rem 0.25rem;
    display: block;
    position: relative;
    transition: color 0.15s ease;
  }

  ul.small a {
    font-size: 0.55rem;
    padding: 0.25rem;
  }

  a :global(.icon) {
    color: #a78bfa;
  }

  /* Wavy squiggle underline - blends pixel aesthetic with wave animation */
  a::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    background-repeat: repeat-x;
    background-size: 20px 6px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='6' viewBox='0 0 20 6'><path d='M0 3 C 3 0 7 6 10 3 C 13 0 17 6 20 3' fill='none' stroke='%23ffcc00' stroke-width='2' stroke-linecap='square'/></svg>");
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.2s ease;
    image-rendering: pixelated;
  }

  /* Hover state */
  a:hover {
    color: #fff;
    text-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
  }

  a:hover::after {
    transform: scaleX(1);
    animation: wave-shift 0.8s linear infinite;
  }

  /* Active page */
  li.active a {
    color: #ffcc00;
    text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
  }

  li.active a::after {
    transform: scaleX(1);
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='6' viewBox='0 0 20 6'><path d='M0 3 C 3 0 7 6 10 3 C 13 0 17 6 20 3' fill='none' stroke='%23ff6600' stroke-width='2' stroke-linecap='square'/></svg>");
  }

  li.active a:hover::after {
    animation: wave-shift 1s linear infinite;
  }

  @keyframes wave-shift {
    from {
      background-position-x: 0;
    }
    to {
      background-position-x: 20px;
    }
  }

  /* Glow pulse on hover */
  li:hover::before {
    content: "";
    position: absolute;
    inset: -4px;
    background: radial-gradient(ellipse at center, rgba(255, 204, 0, 0.15) 0%, transparent 70%);
    pointer-events: none;
    animation: glow-pulse 1s ease-in-out infinite;
  }

  @keyframes glow-pulse {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }

  :global(html:not(.dark)) .site-header {
    font-family: "Space Grotesk", system-ui, sans-serif;
    background: linear-gradient(180deg, #fff6ef 0%, #fbf7f1 100%);
    border-image: repeating-linear-gradient(
        90deg,
        #ff9f1c 0px,
        #ff9f1c 14px,
        #7c3aed 14px,
        #7c3aed 28px,
        #00b4d8 28px,
        #00b4d8 42px
      )
      1;
  }

  :global(html:not(.dark)) .site-header::before {
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.04) 0px,
      rgba(0, 0, 0, 0.04) 1px,
      transparent 1px,
      transparent 2px
    );
  }

  :global(html:not(.dark)) .site-header a {
    color: #5b5b70;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  :global(html:not(.dark)) .site-header a:hover {
    color: #7c3aed;
    text-shadow: none;
  }

  :global(html:not(.dark)) .site-header li.active a {
    color: #7c3aed;
    text-shadow: none;
  }

  :global(html:not(.dark)) .site-header a::after {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='6' viewBox='0 0 20 6'><path d='M0 3 C 3 0 7 6 10 3 C 13 0 17 6 20 3' fill='none' stroke='%237c3aed' stroke-width='2' stroke-linecap='square'/></svg>");
  }

  :global(html:not(.dark)) .theme-toggle {
    font-family: "Space Grotesk", system-ui, sans-serif;
    background: #fffdf8;
    border-color: #e6dfd5;
    color: #7c3aed;
    box-shadow: 4px 4px 0 rgba(21, 21, 43, 0.12);
  }

  :global(html:not(.dark)) .theme-toggle:hover {
    background: #fff0e1;
    color: #5b21b6;
    box-shadow: 6px 6px 0 rgba(21, 21, 43, 0.16);
  }

  /* Responsive */
  @media (max-width: 640px) {
    ul {
      gap: 1rem;
    }

    a {
      font-size: 0.55rem;
    }

    .theme-toggle {
      right: 0.6rem;
      font-size: 0.5rem;
      padding: 0.25rem 0.35rem;
    }

    .theme-toggle .toggle-label {
      display: none;
    }
  }

  /* Hide in PWA mode */
  @media (display-mode: standalone) {
    .site-header {
      display: none;
    }
  }
</style>
