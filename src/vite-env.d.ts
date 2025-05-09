/// <reference types="vite/client" />

declare module '*.md' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
  export const metadata: Record<string, unknown>;
}

declare module '*.svx' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
  export const metadata: Record<string, unknown>;
} 