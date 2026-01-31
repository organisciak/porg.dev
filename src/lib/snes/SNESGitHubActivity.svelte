<script lang="ts">
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faGithub } from "@fortawesome/free-brands-svg-icons";
  import {
    faCodeBranch,
    faCodePullRequest,
    faCircleExclamation,
    faStar,
  } from "@fortawesome/free-solid-svg-icons";

  interface ActivityItem {
    type: "commit" | "pr" | "issue" | "other";
    repo: string;
    repoUrl: string;
    description: string;
    repoDescription?: string;
    url?: string;
    date: string;
  }

  let activity: ActivityItem[] = [];
  let loading = true;
  let error = false;

  const typeIcons = {
    commit: faCodeBranch,
    pr: faCodePullRequest,
    issue: faCircleExclamation,
    other: faStar,
  };

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "TODAY";
    if (diffDays === 1) return "1D AGO";
    if (diffDays < 7) return `${diffDays}D AGO`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}W AGO`;
    return `${Math.floor(diffDays / 30)}M AGO`;
  }

  async function fetchActivity() {
    loading = true;
    error = false;
    try {
      const res = await fetch("/api/github-activity");
      const data = await res.json();
      if (data.activity) {
        activity = data.activity;
      } else {
        error = true;
      }
    } catch (e) {
      console.error("Failed to fetch GitHub activity", e);
      error = true;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchActivity();
  });
</script>

<div class="github-section">
  <h2 class="section-title">
    <Fa icon={faGithub} />
    NOW WORKING ON
  </h2>

  {#if loading}
    <div class="loading-text">LOADING...</div>
  {:else if error || activity.length === 0}
    <div class="error-text">
      <a href="https://github.com/organisciak" target="_blank" class="github-link">
        VIEW GITHUB PROFILE →
      </a>
    </div>
  {:else}
    <div class="activity-list">
      {#each activity as item}
        <div class="activity-item">
          <span class="activity-icon">
            <Fa icon={typeIcons[item.type]} />
          </span>
          <div class="activity-content">
            <div class="activity-header">
              <a href={item.repoUrl} target="_blank" class="repo-name">{item.repo}</a>
              <span class="activity-date">{formatDate(item.date)}</span>
            </div>
            {#if item.repoDescription}
              <span class="activity-desc">{item.repoDescription}</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .github-section {
    max-width: 500px;
    width: 100%;
    padding: 1rem;
    border: 2px solid #333;
    background: rgba(0, 0, 0, 0.3);
    font-family: "Press Start 2P", monospace;
  }

  .section-title {
    font-size: 0.6rem;
    color: #ffcc00;
    text-align: center;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .loading-text,
  .error-text {
    font-size: 0.5rem;
    color: #666;
    text-align: center;
    padding: 1rem 0;
  }

  .github-link {
    color: #88ccff;
    text-decoration: none;
  }

  .github-link:hover {
    color: #ffcc00;
    text-shadow: 0 0 8px #ffcc00;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .activity-item {
    display: flex;
    gap: 0.5rem;
    font-size: 0.5rem;
    line-height: 1.6;
  }

  .activity-icon {
    color: #ff6600;
    flex-shrink: 0;
    width: 1rem;
    text-align: center;
  }

  .activity-content {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
  }

  .activity-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .repo-name {
    color: #fff;
    text-decoration: none;
    font-size: 0.55rem;
  }

  .repo-name:hover {
    color: #ffcc00;
    text-shadow: 0 0 8px #ffcc00;
  }

  .activity-type {
    font-size: 0.4rem;
    color: #888;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.1rem 0.3rem;
    border-radius: 2px;
  }

  .activity-date {
    font-size: 0.4rem;
    color: #666;
    margin-left: auto;
  }

  .activity-desc {
    color: #aaa;
    font-size: 0.45rem;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  a.activity-desc:hover {
    color: #88ccff;
  }

  /* Light mode */
  :global(html:not(.dark)) .github-section {
    border-color: #e6dfd5;
    background: #fffdf8;
  }

  :global(html:not(.dark)) .section-title {
    color: #7c3aed;
    text-shadow: none;
  }

  :global(html:not(.dark)) .loading-text,
  :global(html:not(.dark)) .error-text {
    color: #7c7c90;
  }

  :global(html:not(.dark)) .github-link {
    color: #7c3aed;
  }

  :global(html:not(.dark)) .github-link:hover {
    color: #5b21b6;
    text-shadow: none;
  }

  :global(html:not(.dark)) .activity-icon {
    color: #ff9f1c;
  }

  :global(html:not(.dark)) .repo-name {
    color: #15152b;
  }

  :global(html:not(.dark)) .repo-name:hover {
    color: #7c3aed;
    text-shadow: none;
  }

  :global(html:not(.dark)) .activity-type {
    color: #5b5b70;
    background: rgba(0, 0, 0, 0.05);
  }

  :global(html:not(.dark)) .activity-date {
    color: #9a9aaa;
  }

  :global(html:not(.dark)) .activity-desc {
    color: #5b5b70;
  }

  :global(html:not(.dark)) a.activity-desc:hover {
    color: #7c3aed;
  }
</style>
