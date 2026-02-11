<script lang="ts">
  import { searchTypes, getAllTypeNames } from "./schema-vocab";
  import type { VocabType } from "./schema-vocab-types";

  let { value = $bindable(""), onselect }: { value: string; onselect?: (name: string) => void } = $props();

  let query = $state(value);
  let open = $state(false);
  let highlightIndex = $state(0);
  let inputEl: HTMLInputElement | undefined = $state();

  let results = $derived(query.trim() ? searchTypes(query, 15) : []);

  function select(type: VocabType) {
    query = type.name;
    value = type.name;
    open = false;
    onselect?.(type.name);
  }

  function handleInput() {
    value = query;
    open = query.trim().length > 0;
    highlightIndex = 0;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open && query.trim()) open = true;
      highlightIndex = Math.min(highlightIndex + 1, results.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      highlightIndex = Math.max(highlightIndex - 1, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && results[highlightIndex]) {
        select(results[highlightIndex]);
      }
    } else if (e.key === "Escape") {
      open = false;
    }
  }

  function handleBlur() {
    // Delay to allow click on dropdown item
    setTimeout(() => { open = false; }, 150);
  }
</script>

<div class="relative">
  <input
    bind:this={inputEl}
    type="text"
    bind:value={query}
    oninput={handleInput}
    onkeydown={handleKeydown}
    onfocus={() => { if (query.trim()) open = true; }}
    onblur={handleBlur}
    placeholder="Search schema.org types..."
    class="w-full rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
    role="combobox"
    aria-expanded={open}
    aria-autocomplete="list"
    autocomplete="off"
  />
  {#if open && results.length > 0}
    <ul
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
      role="listbox"
    >
      {#each results as type, i}
        <li
          role="option"
          aria-selected={i === highlightIndex}
          class="cursor-pointer px-3 py-2 text-sm {i === highlightIndex
            ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100'
            : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700'}"
          onmousedown={() => select(type)}
        >
          <div class="font-medium">{type.name}</div>
          <div class="truncate text-xs text-gray-500 dark:text-gray-400">
            {type.hierarchy.join(" > ")}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
