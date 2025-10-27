<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	import Fa from 'svelte-fa';
    import { faHome, faSwatchbook, faFillDrip, faBriefcase } from '@fortawesome/free-solid-svg-icons';

	import { isCollapsed } from '$lib/stores/headerCollapse';

	export let small:boolean = false;

	$: small = $isCollapsed;

	type Link = {
		name: string;
		url: string;
		always: boolean;
		icon?: any;
	}
	const links:Link[] = [
		{
			name: 'Home',
			url: '/',
			always: true, // whether to show when small=True,
			icon: faHome
		},
		{
			name: 'CV',
			url: '/cv',
			always: true,
			icon: faBriefcase
		},
		// {
		// 	name: 'Colors',
		// 	url: '/colors',
		// 	always: true,
		// 	icon: faSwatchbook
		// },
		// {
		// 	name: 'Hue Hunter',
		// 	url: '/huehunter',
		// 	always: true,
		// 	icon: faFillDrip
		// }
	];
</script>

<header class="flex justify-between">
	<nav class="flex justify-center bg-[var(--heading-color)]">
		<ul class="relative flex justify-center items-center list-none p-0 m-0" class:small-nav={small} class:normal-nav={!small}>
			{#each links as link}
				{#if link.always || !small}
				<li class:active={$page.url.pathname === '{base}' + link.url}
					class:small-nav={small}
					class:normal-nav={!small}
					class="relative h-full">
					<a title={link.name} data-sveltekit-prefetch href="{base}{link.url}" class:px-4={!small} class:squiggle-underline={!small} class="flex h-full items-center text-slate-900 dark:text-slate-200 dark:hover:text-slate-100 font-thin uppercase tracking-wider transition-colors duration-200 ease-linear hover:text-[var(--accent-color)]">
						{#if small && link.icon}
							<Fa class="text-violet-500" icon={link.icon} />
						{:else }
							{link.name}
						{/if}
					</a>
				</li>
				{/if}
			{/each}
			
		</ul>
	</nav>
</header>

<style lang='postcss'>
	ul.small-nav {
		@apply h-6;
	}
	ul.normal-nav {
		@apply h-10;
	}

	li.small-nav {
		@apply mx-1.5;
		@apply text-sm;
	}
	li.normal-nav {
		@apply border-b-0;
		@apply mx-2;
	}

	/* Elegant squiggly underline using a repeating SVG wave that moves left/right on hover */
	a.squiggle-underline { position: relative; }
	a.squiggle-underline::after {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		bottom: 2px;
		height: 6px;
		background-repeat: repeat-x;
		background-size: 20px 6px;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='6' viewBox='0 0 20 6'><path d='M0 3 C 3 0 7 6 10 3 C 13 0 17 6 20 3' fill='none' stroke='%237c3aed' stroke-width='1.5' stroke-linecap='round'/></svg>");
		pointer-events: none;
	}
	a.squiggle-underline:hover::after {
		animation: wave-shift 1.2s linear infinite;
	}
	li.active a.squiggle-underline::after { height: 7px; background-size: 20px 7px; }
	@keyframes wave-shift {
		from { background-position-x: 0; }
		to   { background-position-x: 20px; }
	}
	@media (prefers-color-scheme: dark) {
		a.squiggle-underline::after { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='6' viewBox='0 0 20 6'><path d='M0 3 C 3 0 7 6 10 3 C 13 0 17 6 20 3' fill='none' stroke='%23a78bfa' stroke-width='1.5' stroke-linecap='round'/></svg>"); }
	}

	/* For progressive web apps, like /huehunter, just hide nav entirely */
	@media (display-mode: standalone) {
		nav {
			display: none;
		}
		}
</style>
