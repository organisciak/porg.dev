/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    userid: string;
  }

  // interface Platform {}

  // interface Session {}

  // interface Stuff {}
}

declare module '*.svx' {
  import type { SvelteComponent } from 'svelte';
  export default class Comp extends SvelteComponent {}
  export const metadata: Record<string, unknown>;
}

declare module '*.md' {
  import type { SvelteComponent } from 'svelte';
  export default class Comp extends SvelteComponent {}
  export const metadata: Record<string, unknown>;
}
