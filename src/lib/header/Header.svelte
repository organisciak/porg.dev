<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faHome, faBriefcase, faNewspaper } from '@fortawesome/free-solid-svg-icons';
	import { isCollapsed } from '$lib/stores/headerCollapse';

	export let small: boolean = false;

	$: small = $isCollapsed;

	type Link = {
		name: string;
		url: string;
		always: boolean;
		icon?: any;
	}

	const links: Link[] = [
		{ name: 'HOME', url: '/', always: true, icon: faHome },
		{ name: 'CV', url: '/cv', always: true, icon: faBriefcase },
		{ name: 'POSTS', url: '/p', always: true, icon: faNewspaper }
	];
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</svelte:head>

<header class="site-header" class:small>
	<nav>
		<ul class:small>
			{#each links as link}
				{#if link.always || !small}
					<li class:active={$page.url.pathname === link.url}>
						<a
							href="{base}{link.url}"
							data-sveltekit-prefetch
							title={link.name}
						>
							{#if small && link.icon}
								<Fa class="icon" icon={link.icon} />
							{:else}
								{link.name}
							{/if}
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</header>

<style>
	.site-header {
		font-family: 'Press Start 2P', monospace;
		background: linear-gradient(180deg, #1a1a3a 0%, #0a0a1a 100%);
		border-bottom: 4px solid;
		border-image: repeating-linear-gradient(
			90deg,
			#ffcc00 0px,
			#ffcc00 8px,
			#ff6600 8px,
			#ff6600 16px,
			#ff0066 16px,
			#ff0066 24px,
			#cc00ff 24px,
			#cc00ff 32px,
			#00ccff 32px,
			#00ccff 40px
		) 1;
		padding: 0.75rem 1rem;
		position: relative;
		z-index: 50;
	}

	.site-header.small {
		padding: 0.4rem 0.75rem;
	}

	/* Scanline effect */
	.site-header::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.1) 0px,
			rgba(0, 0, 0, 0.1) 1px,
			transparent 1px,
			transparent 2px
		);
	}

	nav {
		position: relative;
		z-index: 1;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: center;
		gap: 2rem;
		height: 2.5rem;
		align-items: center;
	}

	ul.small {
		gap: 1rem;
		height: 1.5rem;
	}

	li {
		position: relative;
	}

	a {
		color: #888;
		text-decoration: none;
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		padding: 0.5rem 0.25rem;
		display: block;
		position: relative;
		transition: color 0.15s ease;
	}

	ul.small a {
		font-size: 0.55rem;
		padding: 0.25rem;
	}

	a :global(.icon) {
		color: #a78bfa;
	}

	/* Wavy squiggle underline - blends pixel aesthetic with wave animation */
	a::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 6px;
		background-repeat: repeat-x;
		background-size: 20px 6px;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='6' viewBox='0 0 20 6'><path d='M0 3 C 3 0 7 6 10 3 C 13 0 17 6 20 3' fill='none' stroke='%23ffcc00' stroke-width='2' stroke-linecap='square'/></svg>");
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.2s ease;
		image-rendering: pixelated;
	}

	/* Hover state */
	a:hover {
		color: #fff;
		text-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
	}

	a:hover::after {
		transform: scaleX(1);
		animation: wave-shift 0.8s linear infinite;
	}

	/* Active page */
	li.active a {
		color: #ffcc00;
		text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
	}

	li.active a::after {
		transform: scaleX(1);
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='6' viewBox='0 0 20 6'><path d='M0 3 C 3 0 7 6 10 3 C 13 0 17 6 20 3' fill='none' stroke='%23ff6600' stroke-width='2' stroke-linecap='square'/></svg>");
		animation: wave-shift 1s linear infinite;
	}

	@keyframes wave-shift {
		from { background-position-x: 0; }
		to { background-position-x: 20px; }
	}

	/* Glow pulse on hover */
	li:hover::before {
		content: '';
		position: absolute;
		inset: -4px;
		background: radial-gradient(ellipse at center, rgba(255, 204, 0, 0.15) 0%, transparent 70%);
		pointer-events: none;
		animation: glow-pulse 1s ease-in-out infinite;
	}

	@keyframes glow-pulse {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	/* Responsive */
	@media (max-width: 640px) {
		ul {
			gap: 1rem;
		}

		a {
			font-size: 0.55rem;
		}
	}

	/* Hide in PWA mode */
	@media (display-mode: standalone) {
		.site-header {
			display: none;
		}
	}
</style>
