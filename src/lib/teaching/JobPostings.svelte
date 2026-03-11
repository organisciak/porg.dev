<script lang="ts">
  const STORAGE_KEY = "lis4220-job-postings";

  type Group = {
    id: number;
    label: string;
    theme: string;
    jobs: Job[];
  };

  type Job = {
    title: string;
    org: string;
    location: string;
    salary?: string;
    url: string;
    originalUrl: string;
    snippet: string;
  };

  const groups: Group[] = [
    {
      id: 1,
      label: "Research Data",
      theme: "blue",
      jobs: [
        {
          title: "Research Data Librarian",
          org: "University of North Carolina Wilmington Library",
          location: "Wilmington, NC",
          salary: "$60,000–64,000",
          url: "https://jobs.code4lib.org/jobs/65958-research-data-librarian",
          originalUrl: "https://jobs.uncw.edu/postings/38622",
          snippet:
            "Serve as a campus expert in accessing, using, analyzing, visualizing, managing, and sharing data… assist researchers in meeting funders' or publishers' requirements for research data sharing.",
        },
        {
          title: "Computational Research Librarian, Social Sciences & Humanities",
          org: "Carnegie Mellon University",
          location: "Pittsburgh, PA",
          url: "https://jobs.code4lib.org/jobs/65942-computational-research-librarian-social-sciences-and-humanities",
          originalUrl: "https://apply.interfolio.com/181421",
          snippet:
            "Serve as a collaborative research partner to faculty, students, and staff… supporting computational and data-intensive scholarship in the social sciences and humanities.",
        },
      ],
    },
    {
      id: 2,
      label: "Digital Preservation",
      theme: "emerald",
      jobs: [
        {
          title: "Digital Preservation Archivist",
          org: "Georgia State University",
          location: "Atlanta, GA",
          salary: "$61,000–72,600",
          url: "https://jobs.code4lib.org/jobs/65955-digital-preservation-archivist",
          originalUrl: "https://facultycareers.gsu.edu/postings/6601",
          snippet:
            "Provide leadership and expertise in digital preservation… manage the long-term preservation of digital materials for all collecting areas and handling materials in all formats.",
        },
        {
          title: "Born-Digital Collections Coordinator",
          org: "Library of Virginia",
          location: "Richmond, VA",
          salary: "$78,000–88,000",
          url: "https://jobs.code4lib.org/jobs/65980-born-digital-collections-coordinator",
          originalUrl: "https://www.jobs.virginia.gov/jobs/born-digital-collections-coordinator-00220-richmond-virginia-united-states",
          snippet:
            "Lead agency-wide planning and technical management of born-digital government and manuscript records… develop policies, procedures, and technologies that support sustainability and public access.",
        },
      ],
    },
    {
      id: 3,
      label: "Collections & Metadata",
      theme: "purple",
      jobs: [
        {
          title: "Authorities & Entity Management Metadata Specialist",
          org: "Getty Research Institute",
          location: "Los Angeles, CA",
          salary: "$83,743–110,972",
          url: "https://jobs.code4lib.org/jobs/65927-authorities-entity-management-metadata-specialist",
          originalUrl: "https://jobs-getty.icims.com/jobs/4723/authorities-%26-entity-mgmt-metadata-specialist-for-dismo/job",
          snippet:
            "Shape metadata governance, identity management, and data cleanup projects spanning archival and bibliographic data… enhance bibliographic linked data, improve data quality in Alma to better align with BIBFRAME, and apply linked data principles to strengthen interoperability.",
        },
        {
          title: "Metadata Strategies Librarian",
          org: "UC Berkeley Library",
          location: "Berkeley, CA",
          salary: "$102,121–119,820",
          url: "https://jobs.code4lib.org/jobs/65972-metadata-strategies-librarian",
          originalUrl: "https://aprecruit.berkeley.edu/JPF04956",
          snippet:
            "Improve and transform discovery of library resources by evaluating and implementing new workflows, standards, and technologies… implement linked data and AI-assisted metadata workflows.",
        },
      ],
    },
    {
      id: 4,
      label: "Emerging Roles",
      theme: "amber",
      jobs: [
        {
          title: "Knowledge Management Strategist",
          org: "Vanguard",
          location: "Malvern, PA",
          url: "https://jobs.code4lib.org/jobs/65947-knowledge-management-strategist",
          originalUrl: "https://www.vanguardjobs.com/job/23042488/knowledge-management-strategist-malvern-pa/",
          snippet:
            "Lead complex, cross-functional initiatives that connect archives, data, and storytelling… provide governance and direction for knowledge and information management practices.",
        },
        {
          title: "Head Librarian for AI, Digital Initiatives & Scholarship",
          org: "Drew University",
          location: "Madison, NJ",
          salary: "$70,000–75,000",
          url: "https://jobs.code4lib.org/jobs/65981-head-librarian-for-ai-digital-initiatives-scholarship",
          originalUrl: "https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=1a7897cc-04a2-40ac-93ee-a63f004602a5&ccId=19000101_000001&jobId=529224&lang=en_US",
          snippet:
            "Lead computational cultural initiatives including text analysis, digital exhibits, spatial humanities, and digital archives… responsible integration of AI across the research and teaching lifecycle.",
        },
      ],
    },
  ];

  const analysisPrompts = [
    { label: "Skills", q: "What specific competencies are listed?" },
    { label: "Qualifications", q: "Degree level, years of experience, required vs. preferred?" },
    { label: "Tools & Standards", q: "What software, platforms, or standards are named?" },
    { label: "Breadth", q: "Narrow specialist or broad generalist role?" },
    { label: "Surprises", q: "Anything unexpected for an info/library job?" },
    { label: "Course Connections", q: "What from LIS 4220 is directly relevant?" },
  ];

  const themeClasses: Record<string, { border: string; bg: string; badge: string; badgeTxt: string; tab: string; tabActive: string }> = {
    blue: {
      border: "border-blue-200 dark:border-blue-800",
      bg: "bg-blue-50/50 dark:bg-blue-900/10",
      badge: "bg-blue-100 dark:bg-blue-900/30",
      badgeTxt: "text-blue-700 dark:text-blue-400",
      tab: "hover:text-blue-600 dark:hover:text-blue-400",
      tabActive: "bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-400 shadow-sm",
    },
    emerald: {
      border: "border-emerald-200 dark:border-emerald-800",
      bg: "bg-emerald-50/50 dark:bg-emerald-900/10",
      badge: "bg-emerald-100 dark:bg-emerald-900/30",
      badgeTxt: "text-emerald-700 dark:text-emerald-400",
      tab: "hover:text-emerald-600 dark:hover:text-emerald-400",
      tabActive: "bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-400 shadow-sm",
    },
    purple: {
      border: "border-purple-200 dark:border-purple-800",
      bg: "bg-purple-50/50 dark:bg-purple-900/10",
      badge: "bg-purple-100 dark:bg-purple-900/30",
      badgeTxt: "text-purple-700 dark:text-purple-400",
      tab: "hover:text-purple-600 dark:hover:text-purple-400",
      tabActive: "bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-400 shadow-sm",
    },
    amber: {
      border: "border-amber-200 dark:border-amber-800",
      bg: "bg-amber-50/50 dark:bg-amber-900/10",
      badge: "bg-amber-100 dark:bg-amber-900/30",
      badgeTxt: "text-amber-700 dark:text-amber-400",
      tab: "hover:text-amber-600 dark:hover:text-amber-400",
      tabActive: "bg-white dark:bg-gray-900 text-amber-700 dark:text-amber-400 shadow-sm",
    },
  };

  function loadState<T>(key: string, fallback: T): T {
    if (typeof localStorage === "undefined") return fallback;
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveState(key: string, value: unknown) {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  let activeGroup = $state(loadState<number>(`${STORAGE_KEY}-group`, 1));
  let notes = $state(loadState<Record<string, string>>(`${STORAGE_KEY}-notes`, {}));

  $effect(() => {
    saveState(`${STORAGE_KEY}-group`, activeGroup);
  });

  $effect(() => {
    saveState(`${STORAGE_KEY}-notes`, notes);
  });

  function updateNote(key: string, value: string) {
    notes = { ...notes, [key]: value };
  }

  const currentGroup = $derived(groups.find((g) => g.id === activeGroup)!);
</script>

<!-- Group selector -->
<div class="mb-6 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
  <div class="grid grid-cols-2 gap-1 sm:grid-cols-4">
    {#each groups as group}
      {@const tc = themeClasses[group.theme]}
      {@const isActive = activeGroup === group.id}
      <button
        onclick={() => (activeGroup = group.id)}
        class="rounded-lg px-3 py-2 text-center text-sm font-medium transition-all {isActive
          ? tc.tabActive
          : `text-gray-500 dark:text-gray-400 ${tc.tab}`}"
      >
        <span class="block font-semibold">Group {group.id}</span>
        <span class="block text-[11px] opacity-75">{group.label}</span>
      </button>
    {/each}
  </div>
</div>

<!-- Analysis framework -->
<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
  <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
    What to look for in each posting
  </h3>
  <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
    {#each analysisPrompts as prompt}
      <div class="text-sm">
        <span class="font-medium text-gray-800 dark:text-gray-200">{prompt.label}:</span>
        <span class="text-gray-600 dark:text-gray-400"> {prompt.q}</span>
      </div>
    {/each}
  </div>
</div>

<!-- Job postings for selected group -->
{#if currentGroup}
  {@const tc = themeClasses[currentGroup.theme]}
  <div class="space-y-4">
    {#each currentGroup.jobs as job, i}
      <div class="rounded-lg border {tc.border} {tc.bg} p-5">
        <div class="mb-3 flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="mb-1 flex items-center gap-2">
              <span class="rounded px-2 py-0.5 text-xs font-bold {tc.badge} {tc.badgeTxt}">
                Posting {i + 1}
              </span>
              {#if job.salary}
                <span class="text-xs text-gray-500 dark:text-gray-400">{job.salary}</span>
              {/if}
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-gray-100">{job.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{job.org} — {job.location}</p>
          </div>
          <div class="flex shrink-0 flex-col gap-1.5">
            <a
              href={job.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-center text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Original posting ↗
            </a>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              class="text-center text-xs text-gray-400 no-underline hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
            >
              via code4lib
            </a>
          </div>
        </div>

        <blockquote class="mb-4 border-l-2 border-gray-300 pl-3 text-sm italic text-gray-600 dark:border-gray-600 dark:text-gray-400">
          "{job.snippet}"
        </blockquote>

        <div>
          <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Your notes on this posting
          </label>
          <textarea
            rows="4"
            placeholder="Skills, tools, qualifications, surprises, course connections…"
            value={notes[`${currentGroup.id}-${i}`] ?? ""}
            oninput={(e) => updateNote(`${currentGroup.id}-${i}`, (e.target as HTMLTextAreaElement).value)}
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-gray-400 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
          ></textarea>
        </div>
      </div>
    {/each}
  </div>
{/if}

<!-- Share out section -->
<div class="mt-8 rounded-lg border border-purple-200 bg-purple-50/50 p-5 dark:border-purple-800 dark:bg-purple-900/10">
  <h3 class="mb-1 font-semibold text-purple-900 dark:text-purple-200">Share Out</h3>
  <p class="mb-3 text-sm text-purple-700 dark:text-purple-400">Each group will report back. Be ready.</p>
  <ol class="space-y-1.5 text-sm text-purple-800 dark:text-purple-300">
    <li>1. What were the key skills and tools in your postings?</li>
    <li>2. What surprised you — what didn't fit your expectations of a library job?</li>
    <li>3. What from this course is most directly relevant to these roles?</li>
    <li>4. What would you need to learn to be competitive for one of these?</li>
  </ol>
</div>

<div class="mt-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/10">
  <p class="text-sm text-blue-800 dark:text-blue-300">
    <strong>Discussion:</strong> What patterns cut across all four groups? How have library and data jobs changed — and what's still the same?
    Browse the full job board at <a href="https://jobs.code4lib.org/" target="_blank" rel="noopener noreferrer" class="underline">jobs.code4lib.org</a>.
  </p>
</div>
