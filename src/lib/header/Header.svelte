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
  import * as ToggleGroup from "$lib/components/ui/toggle-group";

  let small = $derived($isCollapsed);
  let themeValue: string = $state("system");

  $effect(() => {
    themeValue = userPrefersMode.current ?? "system";
  });

  function handleThemeChange(value: string | undefined) {
    if (value) {
      setMode(value as "light" | "dark" | "system");
    }
  }

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
  <div class="theme-toggle" role="group" aria-label="Theme selection">
    <ToggleGroup.Root
      type="single"
      value={themeValue}
      onValueChange={handleThemeChange}
      class="toggle-group"
    >
      <ToggleGroup.Item value="light" aria-label="Light theme" class="toggle-item">
        <Fa icon={faSun} />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="system" aria-label="System theme" class="toggle-item">
        <Fa icon={faCircleHalfStroke} />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="dark" aria-label="Dark theme" class="toggle-item">
        <Fa icon={faMoon} />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  </div>
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

  .site-header.small .theme-toggle :global(.toggle-group) {
    padding: 0.1rem;
  }

  .site-header.small .theme-toggle :global(.toggle-item) {
    width: 1.3rem;
    height: 1.1rem;
  }

  .site-header.small .theme-toggle :global(.toggle-item svg) {
    width: 0.6rem;
    height: 0.6rem;
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
    z-index: 2;
  }

  .theme-toggle :global(.toggle-group) {
    display: inline-flex;
    align-items: center;
    gap: 0;
    border: 2px solid #3a3a6a;
    background: rgba(20, 20, 40, 0.85);
    padding: 0.15rem;
    border-radius: 4px;
  }

  .theme-toggle :global(.toggle-item) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.4rem;
    border: none;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.15s ease;
    border-radius: 2px;
    padding: 0;
  }

  .theme-toggle :global(.toggle-item:hover) {
    color: #999;
  }

  .theme-toggle :global(.toggle-item[data-state="on"]) {
    background: rgba(255, 204, 0, 0.2);
    color: #ffcc00;
    box-shadow: 0 0 6px rgba(255, 204, 0, 0.3);
  }

  .theme-toggle :global(.toggle-item svg) {
    width: 0.75rem;
    height: 0.75rem;
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

  :global(html:not(.dark)) .theme-toggle :global(.toggle-group) {
    background: #fffdf8;
    border-color: #e6dfd5;
    box-shadow: 3px 3px 0 rgba(21, 21, 43, 0.12);
  }

  :global(html:not(.dark)) .theme-toggle :global(.toggle-item) {
    color: #bbb;
  }

  :global(html:not(.dark)) .theme-toggle :global(.toggle-item:hover) {
    color: #888;
  }

  :global(html:not(.dark)) .theme-toggle :global(.toggle-item[data-state="on"]) {
    background: rgba(124, 58, 237, 0.15);
    color: #7c3aed;
    box-shadow: 0 0 4px rgba(124, 58, 237, 0.2);
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
    }

    .theme-toggle :global(.toggle-group) {
      padding: 0.1rem;
    }

    .theme-toggle :global(.toggle-item) {
      width: 1.4rem;
      height: 1.2rem;
    }

    .theme-toggle :global(.toggle-item svg) {
      width: 0.65rem;
      height: 0.65rem;
    }
  }

  /* Hide in PWA mode */
  @media (display-mode: standalone) {
    .site-header {
      display: none;
    }
  }
</style>
