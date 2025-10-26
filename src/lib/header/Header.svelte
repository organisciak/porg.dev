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

	/* Elegant squiggly underline using CSS text-decoration */
	.squiggle-underline {
		text-decoration-line: underline;
		text-decoration-style: wavy;
		text-underline-offset: 8px;
		text-decoration-thickness: 1.5px;
		text-decoration-color: #7c3aed; /* violet-600 */
	}
	/* Jiggle the underline on hover */
	.squiggle-underline:hover {
		animation: underline-jiggle 0.8s ease-in-out infinite;
	}
	@keyframes underline-jiggle {
		0% { text-underline-offset: 6px; }
		50% { text-underline-offset: 11px; }
		100% { text-underline-offset: 6px; }
	}
	li.active a.squiggle-underline {
		text-decoration-thickness: 2.5px;
		text-decoration-color: #6d28d9; /* violet-700 */
	}
	@media (prefers-color-scheme: dark) {
		.squiggle-underline {
			text-decoration-color: #a78bfa; /* violet-300 for dark */
		}
		li.active a.squiggle-underline {
			text-decoration-color: #c4b5fd; /* violet-200 */
		}
	}

	/* For progressive web apps, like /huehunter, just hide nav entirely */
	@media (display-mode: standalone) {
		nav {
			display: none;
		}
		}
</style>
