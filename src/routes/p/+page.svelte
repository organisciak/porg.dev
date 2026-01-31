<script lang="ts">
  import { base } from "$app/paths";

  export let data;
</script>

<svelte:head>
  <title>Posts | porg.dev</title>
  <meta
    name="description"
    content="Posts from Peter Organisciak on AI, creativity, and information science"
  />
  <link rel="alternate" type="application/rss+xml" title="porg.dev posts" href="{base}/rss.xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Press+Start+2P&family=Space+Grotesk:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="blog-page">
  <div class="pixel-accent top"></div>

  <div class="content">
    <header class="blog-header">
      <h1>Posts</h1>
      <p class="subtitle">Thoughts on AI, creativity, and information science</p>
    </header>

    <div class="posts-grid">
      {#each data.posts as post, i}
        {#if post}
          <a href="{base}/p/{post.slug}" class="post-card" style="--card-delay: {i * 80}ms">
            <div class="card-content">
              <h2>{post.title}</h2>
              <time datetime={post.date}>{post.date}</time>
              {#if post.description}
                <p class="description">{post.description}</p>
              {/if}
            </div>
            <div class="card-arrow">→</div>
          </a>
        {/if}
      {/each}
    </div>
  </div>

  <div class="pixel-accent bottom"></div>
</div>

<style>
  .blog-page {
    min-height: 100vh;
    --ink: #15152b;
    --muted-ink: #5b5b70;
    --paper: #fbf7f1;
    --paper-shadow: rgba(21, 21, 43, 0.12);
    --accent-warm: #ff9f1c;
    --accent-cool: #00b4d8;
    --accent-ink: #7c3aed;
    color: var(--ink);
    background:
      radial-gradient(circle at 12% 12%, rgba(255, 159, 28, 0.12), transparent 45%),
      radial-gradient(circle at 88% 8%, rgba(124, 58, 237, 0.12), transparent 45%),
      linear-gradient(180deg, #fbf7f1 0%, #f1f1f7 100%);
    position: relative;
  }

  .pixel-accent {
    height: 4px;
    background: repeating-linear-gradient(
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
    );
    image-rendering: pixelated;
  }

  .pixel-accent.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .content {
    max-width: 800px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
    font-family: "Space Grotesk", system-ui, sans-serif;
  }

  .blog-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .blog-header h1 {
    font-family: "Fraunces", serif;
    font-size: 2.6rem;
    color: var(--ink);
    margin: 0 0 0.65rem;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 0 rgba(255, 159, 28, 0.3);
    display: inline-block;
    position: relative;
  }

  .blog-header h1::after {
    content: "";
    display: block;
    height: 6px;
    margin-top: 0.6rem;
    background: linear-gradient(90deg, var(--accent-warm), #ffd27a 40%, transparent 80%);
    border-radius: 999px;
  }

  .subtitle {
    font-size: 1rem;
    color: var(--muted-ink);
    margin: 0;
  }

  .posts-grid {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .post-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.6rem 1.75rem;
    background: linear-gradient(135deg, #ffffff 0%, #fbf7f2 100%);
    border: 2px solid #e6dfd5;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
    position: relative;
    box-shadow: 6px 6px 0 var(--paper-shadow);
    overflow: hidden;
    opacity: 0;
    transform: translateY(12px);
    animation: card-rise 0.5s ease forwards;
    animation-delay: var(--card-delay, 0ms);
  }

  .post-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: repeating-linear-gradient(
      90deg,
      var(--accent-warm) 0px,
      var(--accent-warm) 18px,
      var(--accent-ink) 18px,
      var(--accent-ink) 36px,
      var(--accent-cool) 36px,
      var(--accent-cool) 54px
    );
    opacity: 0.7;
  }

  .post-card:hover {
    border-color: #d7c8ba;
    transform: translateY(-2px);
    box-shadow: 10px 10px 0 rgba(21, 21, 43, 0.16);
  }

  .post-card:hover h2 {
    color: var(--accent-ink);
  }

  .card-content {
    flex: 1;
  }

  .post-card h2 {
    font-family: "Fraunces", serif;
    font-size: 1.55rem;
    font-weight: 600;
    color: var(--ink);
    margin: 0 0 0.6rem;
    transition: color 0.2s ease;
  }

  .post-card time {
    font-family: "Press Start 2P", monospace;
    font-size: 0.58rem;
    color: #6f6f7f;
    letter-spacing: 0.05em;
    display: inline-block;
    padding: 0.25rem 0.4rem;
    border-radius: 999px;
    background: rgba(255, 159, 28, 0.14);
  }

  .description {
    margin: 0.85rem 0 0;
    color: var(--muted-ink);
    font-size: 0.98rem;
    line-height: 1.6;
  }

  .card-arrow {
    font-family: "Press Start 2P", monospace;
    font-size: 0.9rem;
    color: #c0b3a4;
    transition: all 0.2s ease;
    margin-left: 1rem;
  }

  .post-card:hover .card-arrow {
    color: var(--accent-warm);
    transform: translateX(6px);
  }

  @keyframes card-rise {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .post-card {
      animation: none;
      opacity: 1;
      transform: none;
    }

    .post-card:hover {
      transform: none;
    }
  }

  @media (max-width: 640px) {
    .blog-header h1 {
      font-size: 2rem;
    }

    .post-card {
      padding: 1.2rem 1.3rem;
    }

    .post-card h2 {
      font-size: 1.25rem;
    }
  }
</style>
