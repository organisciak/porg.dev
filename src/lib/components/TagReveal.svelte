<script lang="ts">
    export let newTag: { key: string; value: string } = { key: '', value: '' };
  </script>
  
  <div class="tag-reveal">
    {#if newTag.key}
      <p>New Clue: <strong>{newTag.key}</strong> - {newTag.value}</p>
    {/if}
  </div>
  
  <style>
    .tag-reveal {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 8px;
      background-color: #f3f3f3;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      /* Add more styling as needed */
    }
  </style>  