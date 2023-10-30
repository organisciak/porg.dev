<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	import Fa from 'svelte-fa';
    import { faHome } from '@fortawesome/free-solid-svg-icons';

	import { isCollapsed } from '$lib/stores/headerCollapse';

	export let small:boolean = false;

	$: small = $isCollapsed;
</script>

<header class="flex justify-between">
	<nav class="flex justify-center bg-[var(--heading-color)]">
		<ul class="relative flex justify-center items-center list-none p-0 m-0 h-[3em]">
			<li class:active={$page.url.pathname === '{base}/'} class="relative h-full mx-2 border-b-2 border-gradient-r from-[#4c2b69] to-[#d073ff] bg-transparent">
				<a data-sveltekit-prefetch href="{base}/" class="flex h-full items-center px-4 text-slate-900 dark:text-slate-200 dark:hover:text-slate-100 font-extralight uppercase tracking-wider transition-colors duration-200 ease-linear hover:text-[var(--accent-color)]">
					{#if !small}porg.dev{:else}<Fa class="text-violet-500 text-xs" icon={faHome} />{/if}
				</a>
			</li>

			{#if !small}
			<li class:active={$page.url.pathname === '{base}/cv'} class="relative h-full mx-2 border-b-2 border-gradient-r from-[#4c2b69] to-[#d073ff]">
				<a data-sveltekit-prefetch href="{base}/cv" class="flex h-full items-center px-4 text-slate-900 dark:text-slate-200 dark:hover:text-slate-100 font-thin uppercase tracking-wider transition-colors duration-200 ease-linear hover:text-[var(--accent-color)]">CV</a>
			</li>
			<li class:active={$page.url.pathname === '{base}/colors'} class="relative h-full mx-2 border-b-2 border-gradient-r from-[#4c2b69] to-[#d073ff]">
				<a data-sveltekit-prefetch href="{base}/colors" class="flex h-full items-center px-4 text-slate-900 dark:text-slate-200 dark:hover:text-slate-100 font-thin uppercase tracking-wider transition-colors duration-200 ease-linear hover:text-[var(--accent-color)]">Colors</a>
			</li>
			{/if}
		</ul>
	</nav>
</header>

<style>
	li {
		/* Use the gradient as the border image */
		border-image: linear-gradient(to right, #4c2b69, #d073ff);
		border-image-slice: 1; /* This ensures the gradient spans the entire border width */
	}
	li.active {
		border-bottom-width: 4px;
	}
	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}
</style>