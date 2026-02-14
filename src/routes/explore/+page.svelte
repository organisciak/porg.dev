<script lang="ts">
  import AsciiAdventure from "$lib/components/AsciiAdventure.svelte";
  import { MetaTags } from "svelte-meta-tags";
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
    rel="stylesheet"
  />
  <MetaTags
    title="Explore | porg.dev"
    description="Navigate porg.dev as an ASCII adventure"
    openGraph={{
      title: "Explore | porg.dev",
      description: "Navigate porg.dev as an ASCII adventure",
      type: "website",
    }}
  />
</svelte:head>

<div class="explore-page">
  <AsciiAdventure mode="expanded" />
</div>

<style>
  .explore-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);
    font-family: "Press Start 2P", monospace;
  }

  :global(html:not(.dark)) .explore-page {
    background:
      radial-gradient(circle at 12% 12%, rgba(255, 159, 28, 0.08), transparent 45%),
      radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.08), transparent 45%),
      linear-gradient(180deg, #fbf7f1 0%, #f1f1f7 100%);
  }
</style>
