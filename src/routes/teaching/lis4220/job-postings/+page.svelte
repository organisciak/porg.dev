<script lang="ts">
  import JobPostings from "$lib/teaching/JobPostings.svelte";
  import ModulePrevNext from "$lib/teaching/ModulePrevNext.svelte";
</script>

<svelte:head>
  <title>Job Postings | LIS 4220 | Data Curation</title>
  <meta
    name="description"
    content="Analyze real data curation job postings to identify in-demand skills, tools, and qualifications."
  />
</svelte:head>

<section class="prose prose-gray max-w-none dark:prose-invert">
  <p>
    What does a data curation career actually look like? Review real job postings from the
    <a href="https://jobs.code4lib.org/" target="_blank" rel="noopener noreferrer">Code4Lib job board</a>
    — the main posting site for library and information technology jobs — and identify the skills, tools,
    and qualifications employers are asking for.
  </p>
</section>

<div class="mt-6">
  <JobPostings />
</div>

<ModulePrevNext />
