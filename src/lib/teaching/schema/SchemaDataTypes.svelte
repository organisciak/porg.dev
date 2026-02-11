<script lang="ts">
  const dataTypes = [
    { name: "Boolean", description: "True or False", example: "true", color: "amber" },
    { name: "Date", description: "A calendar date (ISO 8601)", example: "2026-01-15", color: "blue" },
    { name: "DateTime", description: "A date and time together", example: "2026-01-15T09:30:00", color: "blue" },
    { name: "Number", description: "Any numeric value", example: "42, 3.14", color: "green" },
    { name: "Text", description: "A string of characters", example: "\"Hello world\"", color: "purple" },
    { name: "Time", description: "A time of day", example: "09:30:00", color: "blue" },
    { name: "URL", description: "A web address", example: "https://schema.org", color: "rose" },
  ];
</script>

<section>
  <div class="prose prose-gray max-w-none dark:prose-invert">
    <h3>Basic Data Types</h3>
    <p>
      Before exploring schema.org's types, let's look at the <strong>building blocks</strong> &mdash;
      the basic data types that properties can hold. These are the atomic values everything else is built from.
    </p>
  </div>

  <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {#each dataTypes as dt}
      <a
        href="https://schema.org/{dt.name}"
        target="_blank"
        rel="noopener noreferrer"
        class="group rounded-lg border border-gray-200 bg-white p-4 no-underline transition-all hover:border-blue-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
      >
        <div class="mb-1 text-sm font-bold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {dt.name}
        </div>
        <div class="mb-2 text-xs text-gray-600 dark:text-gray-400">{dt.description}</div>
        <code class="text-xs text-gray-500 dark:text-gray-500">{dt.example}</code>
      </a>
    {/each}
  </div>
</section>
