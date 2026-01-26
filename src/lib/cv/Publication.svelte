<script lang="ts">
  import type { CSLPublication } from './types';
  import { capitalizeString } from '$lib/utils/stringUtils';
  import { Newspaper, Trophy } from 'lucide-svelte';
  export let data: CSLPublication;

  let copied = false;

  function truncate_url(url: string, max_length: number = 50) {
    if (!url) return '';
    if (url.length > max_length) {
      const parts: string[] = url.split('/');
      return parts.slice(0,3).join('/')
    }
    return url
  }

  function urlToDOIShort(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) {
        const parts = url.split('doi.org/');
        return parts.length > 1 ? parts[1] : url;
    }
    return url;
  }

  function doiForceLong(doi: string): string {
    if (!doi) return '';
    if (!doi.startsWith('http')) {
        doi = 'https://doi.org/' + doi;
    }
    return doi;
  }

  function doiForceShort(doi: string): string {
    if (!doi) return '';
    if (doi.startsWith('http')) {
        const parts = doi.split('doi.org/');
        return parts.length > 1 ? parts[1] : doi;
    }
    return doi;
  }

  const customFieldsAsButtons: string[] = ['preprint', 'SSRN', 'Open Access'];

  function formatAPA(publication: CSLPublication, asHTML:boolean = false): string {
    if (!publication) return '';
    // Format authors
    let authors = publication.author?.map(a => `${a.family}, ${a.given.charAt(0)}.`).join(', ');

    // Format year
    let year = publication.issued?.['date-parts']?.[0]?.[0];

    // Format title
    let title = publication.title;

    // Special handling for book chapters with editors
    if (publication.type === 'chapter') {
      // Format editors as: G. Family, G. Family
      const editorsArr = publication.editor || [];
      const editorsFormatted = editorsArr
        .map(e => {
          const given = e.given ? e.given.trim() : '';
          // Use existing initials if provided (e.g., "R. L.") otherwise take first character
          const initials = given.includes('.') ? given : (given ? `${given.charAt(0)}.` : '');
          return `${initials} ${e.family}`.trim();
        })
        .join(', ');

      const edLabel = editorsArr.length === 1 ? 'Ed.' : 'Eds.';

      // Book title (container-title)
      let bookTitle = publication['container-title'] ? `${publication['container-title']}` : '';
      if (asHTML && bookTitle) {
        bookTitle = `<i>${bookTitle}</i>`;
      }

      // Pages
      const pagesPart = publication.page ? ` (pp. ${publication.page})` : '';

      // Publisher
      const publisher = publication.publisher ? `${publication.publisher}` : '';

      // DOI or URL
      let doiOrUrl: string = '';
      if (publication.DOI && publication.DOI.startsWith('http')) {
        doiOrUrl = publication.DOI;
      } else if (publication.DOI) {
        doiOrUrl = `doi:${publication.DOI}`;
      } else if (publication.URL) {
        doiOrUrl = `Retrieved from ${publication.URL}`;
      }

      // ISBN
      const isbnPart = publication.ISBN ? `ISBN: ${publication.ISBN}` : '';

      const inEditors = editorsFormatted ? ` In ${editorsFormatted} (${edLabel}), ` : ' ';
      const pubSection = [bookTitle + pagesPart, publisher].filter(Boolean).join('. ');
      const tail = [pubSection, doiOrUrl, isbnPart].filter(Boolean).join('. ');

      return `${authors} (${year}). ${title}.${inEditors}${tail}`.trim();
    }

    // Format journal name, volume, and issue
    let journal = publication['container-title'] ? `${publication['container-title']}` : '';
    let volume = publication.volume ? `${publication.volume}` : '';
    let issue = publication.issue ? `(${publication.issue})` : '';

    let event = publication.event ? publication.event : '';
    if (event !== '') {
      event = event + (publication.publisher ? `, ${publication.publisher}` : '');
      event = event + (publication['event-place'] ? `, ${publication['event-place']}` : '');
      event = event += '.';
    }

    if (volume !== '' || issue !== '') journal += ', ';

    if (asHTML) {
      journal = `<i>${journal}</i>`;
    }

    // Format page numbers
    let pages = publication.page ? `, ${publication.page}` : '';

    // Format DOI or URL
    let doiOrUrl: string = '';
    if (publication.DOI && publication.DOI.startsWith('http')) {
      doiOrUrl = publication.DOI;
    } else if (publication.DOI) {
      doiOrUrl = `doi:${publication.DOI}`;
    } else if (publication.URL) {
      doiOrUrl = `Retrieved from ${publication.URL}`;
    }

    // Special case for preprints
    if (publication.type === 'article-journal' && publication['container-title'] === 'arXiv') {
      journal = 'arXiv preprint';
      volume = '';
      issue = '';
      pages = '';
      doiOrUrl = publication.URL || '';
    }

    // Special case for SSRN
    if (publication.type === 'article-journal' && publication['container-title'] === 'SSRN') {
      journal = 'SSRN preprint';
      volume = '';
      issue = '';
      pages = '';
      doiOrUrl = publication.URL || '';
    }

    // Note for CSL with a status field of 'Under Review'
    if (publication.status === 'Under review') {
      doiOrUrl = 'Manuscript submitted for publication.' + doiOrUrl;
    }

  let journal_section = `${journal}${volume}${issue}${pages}`.trim();
  if (journal_section !== '') {
    journal_section = `${journal_section}. `;
  }

    // Combine all parts
    const base = `${authors} (${year}). ${title}. ${journal_section}${event} ${doiOrUrl}`.trim();
    const isbnPart = publication.ISBN ? `ISBN: ${publication.ISBN}` : '';
    if (!isbnPart) return base;
    const joiner = base.endsWith('.') ? ' ' : '. ';
    return `${base}${joiner}${isbnPart}`;
  }


  async function copyToClipboard(data: CSLPublication) {
    if (!data) return;
    const txt = formatAPA(data, false);
    const html = formatAPA(data, true);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([txt], { type: 'text/plain' })
        })
      ]);
      copied = true;
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }



  let showAbstract = false;

</script>
<!---
TODO allow customizing the itemtype
-->
<div class="text-sm publication flex-auto w-80 dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5" itemscope
  itemtype="http://schema.org/ScholarlyArticle">
  <div class="flex items-start">
  <h2 class="text-lg" itemprop="headline">
      {data?.title || 'Untitled'}
  </h2>
  <span class='text-sm ml-1 dark:text-slate-500 text-slate-400' itemprop="datePublished" >
    {data?.issued?.['date-parts']?.[0]?.[0] || 'Unknown Date'}
  </span>
  </div>
  
  {#if data?.event}
    <p class='italic text-sm text-slate-600 dark:text-slate-100' itemprop="locationCreated">
      {data.event}{#if data['publisher']}, {data['publisher']}{/if}{#if data['event-place']}, {data['event-place']}{/if}
    </p>
  {/if}
  {#if data?.['container-title']}
  <div class="italic text-sm text-slate-600 dark:text-slate-100" itemprop="isPartOf" itemscope itemtype="https://schema.org/PublicationIssue">
      <span itemscope itemtype="https://schema.org/Periodical" itemid="#periodical">
        <span itemprop="name">{data['container-title']}</span>
      </span>
  </div>
  {/if}

  {#if data?.author}
  <p itemprop="author" itemscope itemtype="http://schema.org/Person">
    <strong>Authors:</strong>
    {#each data.author as author}
    <span itemprop="name" class="{author.family == 'Organisciak' ? 'italic' : ''}">
      {author.given} {author.family}{@html author === data.author[data.author.length - 1] ? '.' : ', '}
    </span>
    {/each}
  </p>
  {/if}

  {#if data?.editor}
    <p itemprop="editor" itemscope itemtype="http://schema.org/Person">
      <strong>Editors:</strong>
      {#each data.editor as editor}
        <span itemprop="name">{editor.given} {editor.family}{@html editor === data.editor[data.editor.length - 1] ? '.' : ', '}</span>
      {/each}
    </p>
  {/if}

  {#if data?.volume}
    <p>
      <strong>Volume:</strong> <span itemprop="volumeNumber">{data.volume}</span>
    </p>
  {/if}

  {#if data?.edition}
    <p>
      <strong>Edition:</strong> <span itemprop="bookEdition">{data.edition}</span>
    </p>
  {/if}

  {#if data?.references}
    <p>
      <strong>References:</strong> <span itemprop="citation">{data.references}</span>
    </p>
  {/if}

  {#if data?.DOI}
  <p>
    <strong>DOI:</strong> <a href={doiForceLong(data.DOI)} target="_blank" rel="noopener noreferrer" itemprop="url">{doiForceShort(data.DOI)}</a>
  </p>
  {/if}
  {#if data?.URL && urlToDOIShort(data.URL) != data.DOI}
    <p>
      <strong>URL:</strong> <a href={data.URL} target="_blank" rel="noopener noreferrer" itemprop="url">{truncate_url(data.URL)}</a>
    </p>
  {/if}
  {#if data?.status}
    <p>
      <strong>Status:</strong>{data.status}
    </p>
  {/if}

  {#if data?.custom}
      <strong>Additional Info:</strong>
        <!-- Buttons, including select custom fields-->
        {#if data.custom}
          <p itemprop="additionalProperty" itemscope itemtype="http://schema.org/PropertyValue">
            {#each data.custom as field}
              {#if !customFieldsAsButtons.includes(field.key)}
                {#if field.key.toLowerCase() === 'award'}
                  <Trophy class='inline w-5 h-5' />
                {:else if field.key.toLowerCase() === 'feature'}
                  <Newspaper class='inline w-5 h-5' />
                {:else}
                  <span itemprop="name">{capitalizeString(field.key)}</span>:
                {/if}
                {#if field.key.startsWith('http')}
                  <a href={field.value} target="_blank" rel="noopener noreferrer" itemprop="value">{capitalizeString(field.value)}</a>
                {:else}
                  <span itemprop="value">{field.value}</span>
                {/if}
                <br/>
              {/if}
            {/each}
          </p>
        {/if}
  {/if}

  <!-- Buttons, including select custom fields-->
  <div class="flex flex-row">
    {#if data?.custom}
        {#each data.custom as field}
          {#if customFieldsAsButtons.includes(field.key)}
            <button class='pub-button' itemprop="additionalProperty" itemscope itemtype="http://schema.org/PropertyValue">
              <a href={field.value} target="_blank" rel="noopener noreferrer" itemprop="name">{capitalizeString(field.key)}</a>
              <meta itemprop="value" content="{field.value}" />
            </button>
          {/if}
        {/each}
    {/if}

    <!-- Abstract -->
    {#if data?.abstract}
      <button on:click={() => showAbstract = !showAbstract}
        class='pub-button'>
        ↓ Abstract
      </button>
    {/if}

    <!--Copy APA -->
    <button on:click={() => copyToClipboard(data)} class='pub-button'>Copy APA</button>
    {#if copied}<p class='text-xs italic inline-block text-slate-500 m-1 p-1'>Copied</p>{/if}
</div>

  {#if data?.abstract && showAbstract}
    <div class="text-sm leading-relaxed rounded-lg dark:bg-slate-800 bg-slate-100 text-slate-800 dark:text-slate-100 p-4 mt-2 border border-slate-400 dark:border-slate-600">
      {data.abstract}
    </div>
  {/if}
</div>

<style lang='postcss'>
  .pub-button {
    @apply dark:bg-slate-600 bg-slate-300;
    @apply hover:dark:bg-slate-500 hover:bg-slate-400;
    @apply text-xs text-slate-200 font-bold;
    @apply inline-block leading-tight p-1 rounded-lg m-1;
  }

  .pub-button a {
    @apply text-xs text-slate-200 font-bold;
  }
</style>
