import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { env } from "$env/dynamic/private";

interface GitHubEvent {
  type: string;
  repo: { name: string; url: string };
  payload: {
    commits?: { message: string }[];
    action?: string;
    pull_request?: { title: string; html_url: string };
    issue?: { title: string; html_url: string };
    ref?: string;
    ref_type?: string;
  };
  created_at: string;
}

interface ActivityItem {
  type: "commit" | "pr" | "issue" | "other";
  repo: string;
  repoUrl: string;
  description: string;
  repoDescription?: string;
  url?: string;
  date: string;
}

export const GET: RequestHandler = async ({ fetch }) => {
  const username = "organisciak";
  const orgs = ["massivetexts", "neuristics"];
  const excludedRepos = ["organisciak/porg.dev"];

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "porg.dev",
    };

    // Use token if available for higher rate limits
    if (env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${env.GITHUB_TOKEN}`;
    }

    // Fetch user events and org events in parallel
    const eventPromises = [
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
      ...orgs.map((org) =>
        fetch(`https://api.github.com/orgs/${org}/events?per_page=50`, { headers })
      ),
    ];

    const responses = await Promise.all(eventPromises);

    // Collect all events
    let allEvents: GitHubEvent[] = [];
    for (const response of responses) {
      if (response.ok) {
        const events = await response.json();
        allEvents = allEvents.concat(events);
      }
    }

    // Sort by date (most recent first)
    allEvents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const events: GitHubEvent[] = allEvents;

    // Process and deduplicate by repo
    const repoActivity = new Map<string, ActivityItem>();

    for (const event of events) {
      const fullRepoName = event.repo.name;
      const repoName = fullRepoName.replace(`${username}/`, "");
      const repoUrl = `https://github.com/${fullRepoName}`;

      // Skip excluded repos
      if (excludedRepos.includes(fullRepoName)) continue;

      // Skip if we already have activity for this repo
      if (repoActivity.has(fullRepoName)) continue;

      let item: ActivityItem | null = null;

      switch (event.type) {
        case "PushEvent": {
          // Public events API may not include commits array
          const branch = event.payload.ref?.replace("refs/heads/", "") || "main";
          if (event.payload.commits && event.payload.commits.length > 0) {
            const latestCommit = event.payload.commits[event.payload.commits.length - 1];
            item = {
              type: "commit",
              repo: repoName,
              repoUrl,
              description: latestCommit.message.split("\n")[0].slice(0, 60),
              date: event.created_at,
            };
          } else {
            // Fallback when commits aren't included
            item = {
              type: "commit",
              repo: repoName,
              repoUrl,
              description: `Pushed to ${branch}`,
              date: event.created_at,
            };
          }
          break;
        }

        case "PullRequestEvent":
          if (event.payload.pull_request) {
            item = {
              type: "pr",
              repo: repoName,
              repoUrl,
              description: event.payload.pull_request.title.slice(0, 60),
              url: event.payload.pull_request.html_url,
              date: event.created_at,
            };
          }
          break;

        case "IssuesEvent":
          if (event.payload.issue) {
            item = {
              type: "issue",
              repo: repoName,
              repoUrl,
              description: event.payload.issue.title.slice(0, 60),
              url: event.payload.issue.html_url,
              date: event.created_at,
            };
          }
          break;

        case "CreateEvent":
          if (event.payload.ref_type === "repository") {
            item = {
              type: "other",
              repo: repoName,
              repoUrl,
              description: "Created new repository",
              date: event.created_at,
            };
          }
          break;
      }

      if (item) {
        repoActivity.set(fullRepoName, item);
      }

      // Limit to 5 unique repos
      if (repoActivity.size >= 5) break;
    }

    // Fetch repo descriptions in parallel
    const repoDescPromises = Array.from(repoActivity.keys()).map(async (fullRepoName) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${fullRepoName}`, { headers });
        if (res.ok) {
          const repoData = await res.json();
          return { fullRepoName, description: repoData.description };
        }
      } catch {
        // Ignore errors fetching repo info
      }
      return { fullRepoName, description: null };
    });

    const repoDescs = await Promise.all(repoDescPromises);
    const descMap = new Map(repoDescs.map((r) => [r.fullRepoName, r.description]));

    // Add descriptions to activity items
    const activityWithDescs = Array.from(repoActivity.values()).map((item) => {
      const fullName = Array.from(repoActivity.entries()).find(([, v]) => v === item)?.[0];
      if (fullName && descMap.get(fullName)) {
        return { ...item, repoDescription: descMap.get(fullName) };
      }
      return item;
    });

    return json({
      activity: activityWithDescs,
      updated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return json(
      {
        activity: [],
        error: "Failed to fetch GitHub activity",
        updated: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
};
