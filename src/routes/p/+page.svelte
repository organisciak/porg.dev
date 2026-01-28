<script lang="ts">
  import { base } from '$app/paths';

  export let data;
</script>

<svelte:head>
  <title>Posts | porg.dev</title>
  <meta name="description" content="Posts from Peter Organisciak on AI, creativity, and information science" />
  <link rel="alternate" type="application/rss+xml" title="porg.dev posts" href="{base}/rss.xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</svelte:head>

<div class="blog-page">
  <div class="pixel-accent top"></div>

  <div class="content">
    <header class="blog-header">
      <h1>Posts</h1>
      <p class="subtitle">Thoughts on AI, creativity, and information science</p>
    </header>

    <div class="posts-grid">
      {#each data.posts as post}
        {#if post}
          <a href="{base}/p/{post.slug}" class="post-card">
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
    background: linear-gradient(180deg, #fafafa 0%, #f0f0f5 100%);
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
  }

  .blog-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .blog-header h1 {
    font-family: 'Press Start 2P', monospace;
    font-size: 1.5rem;
    color: #1a1a3a;
    margin: 0 0 1rem;
    letter-spacing: 0.05em;
    text-shadow: 2px 2px 0 rgba(204, 0, 255, 0.15);
  }

  .subtitle {
    font-size: 0.95rem;
    color: #666;
    margin: 0;
  }

  .posts-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .post-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    background: white;
    border: 2px solid #e0e0e8;
    border-left: 4px solid #cc00ff;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
    position: relative;
  }

  .post-card:hover {
    border-color: #cc00ff;
    background: #fafaff;
    transform: translateX(4px);
    box-shadow: -4px 0 0 #ffcc00;
  }

  .post-card:hover h2 {
    color: #7c3aed;
  }

  .card-content {
    flex: 1;
  }

  .post-card h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a3a;
    margin: 0 0 0.5rem;
    transition: color 0.2s ease;
  }

  .post-card time {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.6rem;
    color: #888;
    letter-spacing: 0.05em;
  }

  .description {
    margin: 0.75rem 0 0;
    color: #555;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .card-arrow {
    font-family: 'Press Start 2P', monospace;
    font-size: 1rem;
    color: #ccc;
    transition: all 0.2s ease;
    margin-left: 1rem;
  }

  .post-card:hover .card-arrow {
    color: #ffcc00;
    transform: translateX(4px);
  }

  @media (max-width: 640px) {
    .blog-header h1 {
      font-size: 1.1rem;
    }

    .post-card {
      padding: 1rem;
    }

    .post-card h2 {
      font-size: 1.1rem;
    }
  }
</style>
