<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	type Link = {
		name: string;
		url: string;
		external?: boolean;
	}

	const links: Link[] = [
		{ name: 'HOME', url: '/' },
		{ name: 'CV', url: '/cv' },
		{ name: 'POSTS', url: '/p' },
		{ name: 'GAMES', url: '/huehunter' }
	];
</script>

<header class="snes-header">
	<nav>
		<ul>
			{#each links as link}
				<li class:active={$page.url.pathname === link.url}>
					{#if link.external}
						<a href={link.url} target="_blank" rel="noopener noreferrer">
							{link.name}
						</a>
					{:else}
						<a href="{base}{link.url}" data-sveltekit-prefetch>
							{link.name}
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	.snes-header {
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

	/* Scanline effect on header */
	.snes-header::before {
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

	/* Pixelated underline - hidden by default */
	a::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		background: repeating-linear-gradient(
			90deg,
			#ffcc00 0px,
			#ffcc00 3px,
			transparent 3px,
			transparent 6px
		);
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.2s ease;
	}

	/* Hover state - underline animates in */
	a:hover {
		color: #fff;
		text-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
	}

	a:hover::after {
		transform: scaleX(1);
		animation: pixel-march 0.4s linear infinite;
	}

	/* Active page indicator */
	li.active a {
		color: #ffcc00;
		text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
	}

	li.active a::after {
		transform: scaleX(1);
		background: repeating-linear-gradient(
			90deg,
			#ffcc00 0px,
			#ffcc00 3px,
			#ff6600 3px,
			#ff6600 6px
		);
		animation: pixel-march 0.6s linear infinite;
	}

	/* Pixelated marching animation */
	@keyframes pixel-march {
		from {
			background-position-x: 0;
		}
		to {
			background-position-x: 6px;
		}
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
		.snes-header {
			display: none;
		}
	}
</style>
