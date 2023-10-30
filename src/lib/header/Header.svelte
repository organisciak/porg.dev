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
		{
			name: 'Colors',
			url: '/colors',
			always: true,
			icon: faSwatchbook
		},
		{
			name: 'Hue Hunter',
			url: '/huehunter',
			always: true,
			icon: faFillDrip
		}
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
					class="relative h-full border-b-2 border-gradient-r from-[#4c2b69] to-[#d073ff]">
					<a data-sveltekit-prefetch href="{base}{link.url}" class:px-4={!small} class="flex h-full items-center text-slate-900 dark:text-slate-200 dark:hover:text-slate-100 font-thin uppercase tracking-wider transition-colors duration-200 ease-linear hover:text-[var(--accent-color)]">
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
		@apply border-b-0;
		@apply mx-1.5;
		@apply text-sm;
	}
	li.normal-nav {
		@apply border-b-2;
		@apply mx-2;
	}
	li {
		/* Use the gradient as the border image */
		border-image: linear-gradient(to right, #4c2b69, #d073ff);
		border-image-slice: 1; /* This ensures the gradient spans the entire border width */
	}
	li.active {
		border-bottom-width: 4px;
	}
</style>