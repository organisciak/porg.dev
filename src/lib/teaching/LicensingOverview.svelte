<!-- Copyright & Data -->
<section class="prose prose-gray max-w-none dark:prose-invert">
  <h3>Copyright and Data</h3>
  <p>
    Under the <strong>Berne Convention</strong> (1886; US ratification 1989), copyright is automatically
    assigned to any original creative work &mdash; you don't need to register it.
  </p>
  <p>
    But <strong>facts themselves are not copyrightable</strong>. In <em>Feist Publications v. Rural
    Telephone</em> (1991), the Supreme Court established that copyright protects <em>originality</em>, not
    labor. For datasets, this creates a gray area: raw data may not be copyrightable, but a creative
    selection or arrangement of data may be.
  </p>
</section>

<!-- Licensing intro -->
<section class="mt-6 prose prose-gray max-w-none dark:prose-invert">
  <h3>What is Licensing?</h3>
  <p>
    When you own the copyright, you can grant permission through a <strong>license</strong>. An <em>open
    license</em> gives permission in advance &mdash; others don't need to ask as long as they follow the
    license conditions.
  </p>
</section>

<!-- License Conditions -->
<div class="mt-6">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Common License Conditions</h4>
  <div class="grid gap-2 sm:grid-cols-2">
    {#each [
      { name: "Attribution (BY)", desc: "Credit the original creator", icon: "BY" },
      { name: "Share-Alike (SA)", desc: "Derivatives must use the same license", icon: "SA" },
      { name: "Non-Commercial (NC)", desc: "No commercial use allowed", icon: "NC" },
      { name: "No Derivatives (ND)", desc: "Must share the work unchanged", icon: "ND" },
    ] as condition}
      <div class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center gap-2">
          <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-400">{condition.icon}</span>
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{condition.name}</span>
        </div>
        <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{condition.desc}</div>
      </div>
    {/each}
  </div>
</div>

<!-- Common Licenses table -->
<div class="mt-6">
  <h4 class="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Common Open Licenses</h4>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-gray-200 dark:border-gray-700">
          <th class="py-2 pr-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">License</th>
          <th class="py-2 pr-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Family</th>
          <th class="py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Conditions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
        {#each [
          { name: "CC-BY", family: "Creative Commons", conditions: "Attribution" },
          { name: "CC-BY-SA", family: "Creative Commons", conditions: "Attribution, Share-alike" },
          { name: "CC-BY-NC", family: "Creative Commons", conditions: "Attribution, Non-commercial" },
          { name: "ODbL", family: "Open Data Commons", conditions: "Attribution, Share-alike" },
          { name: "CC0", family: "Creative Commons", conditions: "None (public domain)" },
        ] as lic}
          <tr>
            <td class="py-2 pr-4 font-medium text-gray-900 dark:text-gray-100">{lic.name}</td>
            <td class="py-2 pr-4 text-gray-600 dark:text-gray-400">{lic.family}</td>
            <td class="py-2 text-gray-600 dark:text-gray-400">{lic.conditions}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- CC0 callout -->
<div class="mt-6 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
  <h4 class="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">Why CC0 for Datasets?</h4>
  <p class="mb-2 text-sm text-gray-700 dark:text-gray-300">
    <strong>CC0</strong> isn't a license &mdash; it's a declaration <em>waiving</em> all copyrights and related rights.
    For data, CC0 is often the best choice:
  </p>
  <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
    <li><strong>Clarity:</strong> If your data is in a copyright gray area, CC0 removes all ambiguity</li>
    <li><strong>Maximum reuse:</strong> No conditions means anyone can use your data for anything</li>
    <li><strong>Community norms:</strong> In research, attribution is expected by convention regardless of legal requirements</li>
    <li><strong>Avoids stacking:</strong> Combining many attributed datasets can become unwieldy</li>
  </ul>
</div>

<!-- Ownership & DUAs -->
<div class="mt-6 grid gap-4 sm:grid-cols-2">
  <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <h4 class="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">Who Owns the Data?</h4>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Copyright belongs to the creator &mdash; but <strong>work for hire</strong> means your employer may own
      what you create on the job. Institutional policies on research output ownership vary widely.
    </p>
  </div>
  <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <h4 class="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">Data Use Agreements</h4>
    <p class="text-sm text-gray-600 dark:text-gray-400">
      A <strong>DUA</strong> is a sharing agreement for sensitive or restricted data. It establishes
      expectations, liabilities, and terms &mdash; separate from copyright.
    </p>
  </div>
</div>

<!-- Discussion -->
<div class="mt-6 rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
  <h4 class="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">Think About It</h4>
  <p class="text-sm text-gray-700 dark:text-gray-300">
    You're publishing a dataset of public library program attendance across 50 U.S. cities.
    Which license would you choose, and why? What factors influence your decision?
  </p>
</div>
