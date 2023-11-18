<script lang="ts">
  import type { CSLPublication } from './types';
  export let data: CSLPublication;

  let copied = false;

  function truncate_url(url: string, max_length: number = 50) {
    if (url.length > max_length) {
      const parts: string[] = url.split('/');
      return parts.slice(0,3).join('/')
    }
    return url
  }

  function urlToDOIShort(url: string): string {
    if (url.startsWith('http')) {
        url = url.split('doi.org/')[1];
    }
    return url;
}
  function doiForceLong(doi: string): string {
    if (!doi.startsWith('http')) {
        doi = 'https://doi.org/' + doi;
    }
    return doi;
  }

  function doiForceShort(doi: string): string {
    if (doi.startsWith('http')) {
        doi = doi.split('doi.org/')[1];
    }
    return doi;
  }

  // written by ChatGPT: https://chat.openai.com/c/0fa52fa7-f4b4-4ad4-b317-39ca82a4b048
  function formatAPA(publication: CSLPublication, asHTML:boolean = false): string {
    // Format authors
    let authors = publication.author.map(a => `${a.family}, ${a.given.charAt(0)}.`).join(', ');

    // Format year
    let year = publication.issued['date-parts'][0][0];

    // Format title
    let title = publication.title;

    // Format journal name, volume, and issue
    let journal = publication['container-title'] ? `${publication['container-title']}` : '';
    let volume = publication.volume ? `${publication.volume}` : '';
    let issue = publication.issue ? `(${publication.issue})` : '';
    if (volume !== '' || issue !== '') journal += ', ';

    if (asHTML) {
      journal = `<i>${journal}</i>`;
    }

    // Format page numbers
    let pages = publication.page ? `, ${publication.page}` : '';

    // Format DOI or URL
    let doiOrUrl = ''
    if (publication.DOI && publication.DOI.startsWith('http')) {
      doiOrUrl = publication.DOI;
    } else if (publication.DOI) {
      doiOrUrl = `doi:${publication.DOI}`;
    } else if (publication.URL) {
      doiOrUrl = `Retrieved from ${publication.URL}`;
    }
    

    // Combine all parts
    return `${authors} (${year}). ${title}. ${journal}${volume}${issue}${pages}. ${doiOrUrl}`;
  }


  async function copyToClipboard(data: CSLPublication) {
    console.log(data);
    const txt = formatAPA(data, false);
    const html = formatAPA(data, true);
    console.log(txt, html);
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
<div class="text-sm publication flex-auto w-80  dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5" itemscope itemtype="http://schema.org/ScholarlyArticle">
  <h2 class="flex text-lg" itemprop="headline">{data.title}</h2>
  
  {#if data.event}
    <p class='italic text-sm text-slate-600 dark:text-slate-100' itemprop="locationCreated">{data.event}</p>
  {/if}

  <p itemprop="author" itemscope itemtype="http://schema.org/Person">
    <strong>Authors:</strong>
    {#each data.author as author}
    <span itemprop="name" class="{author.family == 'Organisciak' ? 'italic' : ''}">{author.given} {author.family}{@html author === data.author[data.author.length - 1] ? '.' : ', '}</span>
    {/each}
  </p>

  {#if data.editor}
    <p itemprop="editor" itemscope itemtype="http://schema.org/Person">
      <strong>Editors:</strong>
      {#each data.editor as editor}
        <span itemprop="name">{editor.given} {editor.family}{@html editor === data.editor[data.editor.length - 1] ? '.' : ', '}</span>
      {/each}
    </p>
  {/if}

  <p>
    <strong>Year:</strong> <span itemprop="datePublished">{data.issued['date-parts'][0][0]}</span>
  </p>

  {#if data.volume}
    <p>
      <strong>Volume:</strong> <span itemprop="volumeNumber">{data.volume}</span>
    </p>
  {/if}

  {#if data.edition}
    <p>
      <strong>Edition:</strong> <span itemprop="bookEdition">{data.edition}</span>
    </p>
  {/if}

  {#if data.references}
    <p>
      <strong>References:</strong> <span itemprop="citation">{data.references}</span>
    </p>
  {/if}

  {#if data.DOI}
  <p>
    <strong>DOI:</strong> <a href={doiForceLong(data.DOI)} target="_blank" rel="noopener noreferrer" itemprop="url">{doiForceShort(data.DOI)}</a>
  </p>
  {/if}
  {#if data.URL && urlToDOIShort(data.URL) != data.DOI}
    <p>
      <strong>URL:</strong> <a href={data.URL} target="_blank" rel="noopener noreferrer" itemprop="url">{truncate_url(data.URL)}</a>
    </p>
  {/if}

  {#if data.custom}
    <p itemprop="additionalProperty" itemscope itemtype="http://schema.org/PropertyValue">
      <strong>Additional Info:</strong>
      {#each data.custom as field}
        <span itemprop="name">{field.key}</span>: 
        <!-- only include an <a> tag if field.value starts with http-->
        {#if field.key.startsWith('http') }
        <a href={field.value} target="_blank" rel="noopener noreferrer" itemprop="value">{field.value}</a>
        {:else}
        <span itemprop="value">{field.value}</span>
        {/if}
        <br/>
      {/each}
    </p>
  {/if}
  {#if data.abstract}
    <button on:click={() => showAbstract = !showAbstract}
      class='dark:bg-slate-600 hover:dark:bg-slate-500 inline-block bg-slate-300 hover:bg-slate-400 leading-tight font-bold text-slate-200 p-1 rounded-lg text-xs my-1'>
      ↓ Abstract
    </button>
  {/if}

  
  <button on:click={() => copyToClipboard(data)} class='dark:bg-slate-600 hover:dark:bg-slate-500 inline-block bg-slate-300 hover:bg-slate-400 leading-tight font-bold text-slate-200 p-1 rounded-lg text-xs my-1'>Copy APA</button>
  {#if copied}<p class='text-xs italic inline-block text-slate-500'>Copied</p>{/if}
  

  {#if data.abstract && showAbstract}
    <div class="text-xs rounded-lg dark:bg-slate-600 bg-slate-300 p-2 mt-1">
      {data.abstract}
    </div>
  {/if}
</div>