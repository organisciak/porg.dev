<script lang="ts">
  export let tags: { key: string; value: string }[] = [];
</script>

<div class="tags-display flex flex-wrap justify-center gap-4 mb-4">
  {#each tags as tag}
    <div class="tag bg-gray-200 p-2 rounded-lg shadow-md">
      <strong>{tag.key}</strong>: {tag.value}
    </div>
  {/each}
</div>
