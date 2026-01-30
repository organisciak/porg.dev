<script lang="ts">
  import { beforeNavigate, afterNavigate } from "$app/navigation";
  import { pageTransition } from "$lib/stores/pageTransition";

  let { children } = $props();

  let transitionActive = $state(false);
  let originX = $state(50);
  let originY = $state(50);

  // Track the last click position for link clicks
  let lastClickX = 0;
  let lastClickY = 0;

  function handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const link = target.closest("a");

    if (link) {
      // Calculate position relative to viewport
      lastClickX = (event.clientX / window.innerWidth) * 100;
      lastClickY = (event.clientY / window.innerHeight) * 100;
    }
  }

  beforeNavigate(({ to, from }) => {
    // Only animate for internal navigation
    if (to?.url.origin === from?.url.origin && to?.url.pathname !== from?.url.pathname) {
      originX = lastClickX || 50;
      originY = lastClickY || 50;
      transitionActive = true;
      pageTransition.trigger(originX, originY);
    }
  });

  afterNavigate(() => {
    transitionActive = false;
    pageTransition.reset();
  });
</script>

<svelte:window onclick={handleClick} />

<div
  class="page-transition-wrapper"
  class:transitioning={transitionActive}
  style="--origin-x: {originX}%; --origin-y: {originY}%;"
>
  {@render children()}
</div>

<style>
  .page-transition-wrapper {
    transform-origin: var(--origin-x, 50%) var(--origin-y, 50%);
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, opacity;
  }

  .page-transition-wrapper.transitioning {
    transform: scale(1.08);
    opacity: 0;
  }
</style>
