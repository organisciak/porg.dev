<script lang="ts">
    import type { CSLPublication } from './types';
    export let data: CSLPublication;

    function truncate_url(url: string, max_length: number = 30) {
    /* Only include the root for overlong URLs */
  if (url.length > 50) {
    const parts: string[] = url.split('/');
    return parts.slice(0,3).join('/')
  }
  return url
}

</script>
<div class="text-sm publication flex-auto w-96 dark:bg-slate-700 bg-slate-200 m-2 rounded-lg p-5">
  

  <h2 class="flex text-lg">{data.title}</h2>
  {#if data.event}
    <p class='italic text-sm text-slate-600 dark:text-slate-100'>{data.event}</p>
    {/if}

  <p>
    <strong>Authors:</strong>
    {#each data.author as author}
    <span class="{author.family == 'Organisciak' ? 'italic' : ''}">{author.given} {author.family}{@html author === data.author[data.author.length - 1] ? '.' : ', '}</span>
    {/each}
  </p>

  {#if data.editor}
    <p>
      <strong>Editors:</strong>
      {#each data.editor as editor}
        {editor.given} {editor.family}{@html editor === data.editor[data.editor.length - 1] ? '.' : ', '}
      {/each}
    </p>
  {/if}

  <p>
    <strong>Year:</strong> {data.issued['date-parts'][0][0]}
  </p>

  {#if data.volume}
    <p>
      <strong>Volume:</strong> {data.volume}
    </p>
  {/if}

  {#if data.edition}
  <p>
    <strong>Edition:</strong> {data.edition}
  </p>
  {/if}

  {#if data.references}
  <p>
    <strong>References:</strong> {data.references}
  </p>
  {/if}

  {#if data.URL}
  <p>
    <strong>URL:</strong> <a href={data.URL} target="_blank" rel="noopener noreferrer">{truncate_url(data.URL)}</a>
  </p>
  {/if}

  {#if data.custom}
    <p>
      <strong>Additional Info:</strong>
      {#each data.custom as field}
        {field.key}: 
        <!-- only include an <a> tag if field.value starts with http-->
        {#if field.key.startsWith('http') }
        <a href={field.value} target="_blank" rel="noopener noreferrer">{field.value}</a>
        {:else}
        {field.value}
        {/if}
        <br/>

      {/each}
    </p>
  {/if}
</div>
  