import { writable } from "svelte/store";

// When true, the standard header is hidden (for pages with custom headers like SNES theme)
export const hideStandardHeader = writable(false);
