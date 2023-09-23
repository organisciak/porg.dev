<script lang="ts">
  import type { CSLPublication } from './types';
  export let data: CSLPublication;

  function truncate_url(url: string, max_length: number = 30) {
    if (url.length > 50) {
      const parts: string[] = url.split('/');
      return parts.slice(0,3).join('/')
    }
    return url
  }

</script>
<!---
TODO allow customizing the itemtype
-->
<div class="text-sm publication flex-auto w-96 dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5" itemscope itemtype="http://schema.org/ScholarlyArticle">
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

  {#if data.URL}
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
</div>