<script lang="ts">
  import { getTypeProperties } from "./schema-vocab";
  import type { TypeProperty } from "./schema-vocab-types";

  let { value = $bindable(""), typeName, onselect }: { value: string; typeName: string; onselect?: (prop: TypeProperty) => void } = $props();

  let query = $state(value);
  let open = $state(false);
  let highlightIndex = $state(0);
  let inputEl: HTMLInputElement | undefined = $state();

  let allProperties = $derived(typeName ? getTypeProperties(typeName) : []);

  let results = $derived.by(() => {
    if (!allProperties.length) return [];
    const q = query.trim().toLowerCase();
    if (!q) return allProperties.slice(0, 20);
    return allProperties.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ).slice(0, 20);
  });

  let focused = $state(false);

  // Sync external value changes back to query (only when not actively editing)
  $effect(() => { if (!focused && value !== query) query = value; });

  function select(prop: TypeProperty) {
    query = prop.name;
    value = prop.name;
    open = false;
    onselect?.(prop);
  }

  function handleInput() {
    value = query;
    open = true;
    highlightIndex = 0;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) open = true;
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
    focused = false;
    setTimeout(() => { open = false; }, 150);
  }

  function handleFocus() {
    focused = true;
    if (allProperties.length) open = true;
    highlightIndex = 0;
  }
</script>

<div class="relative">
  <input
    bind:this={inputEl}
    type="text"
    bind:value={query}
    oninput={handleInput}
    onkeydown={handleKeydown}
    onfocus={handleFocus}
    onblur={handleBlur}
    placeholder={typeName ? "Search properties..." : "Select a type first"}
    disabled={!typeName}
    class="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
    role="combobox"
    aria-expanded={open}
    aria-autocomplete="list"
    autocomplete="off"
  />
  {#if open && results.length > 0}
    <ul
      class="absolute z-50 mt-1 max-h-60 w-72 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
      role="listbox"
    >
      {#each results as prop, i}
        <li
          role="option"
          aria-selected={i === highlightIndex}
          class="cursor-pointer px-3 py-2 text-sm {i === highlightIndex
            ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100'
            : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700'}"
          onmousedown={() => select(prop)}
        >
          <div class="flex items-center gap-2">
            <span class="font-medium">{prop.name}</span>
            {#if prop.inheritedFrom}
              <span class="text-[10px] text-gray-400 dark:text-gray-500">from {prop.inheritedFrom}</span>
            {/if}
          </div>
          <div class="mt-0.5 flex flex-wrap gap-1">
            {#each prop.rangeTypes.slice(0, 4) as rt}
              <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">{rt}</span>
            {/each}
            {#if prop.rangeTypes.length > 4}
              <span class="text-[10px] text-gray-400">+{prop.rangeTypes.length - 4}</span>
            {/if}
          </div>
          {#if prop.description}
            <div class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{prop.description}</div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
