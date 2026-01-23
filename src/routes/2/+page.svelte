<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import Fa from 'svelte-fa';
	import { faGithub, faLinkedinIn, faBluesky } from '@fortawesome/free-brands-svg-icons';
	import { onMount } from 'svelte';

	const meta = {
		title: 'Peter Organisciak',
		description: 'Professor and Applied AI Researcher',
		url: 'https://www.porg.dev'
	}
	const currentYear = new Date().getFullYear();

	// Generate stars for the background
	let stars: { x: number; y: number; size: number; twinkleDelay: number; brightness: number }[] = [];
	let mounted = false;

	onMount(() => {
		stars = Array.from({ length: 100 }, () => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1,
			twinkleDelay: Math.random() * 4,
			brightness: 0.4 + Math.random() * 0.6
		}));
		mounted = true;
	});

	let menuIndex = 0;
	const menuItems = [
		{ label: 'VIEW CV', href: '/cv' },
		{ label: 'GITHUB', href: 'https://github.com/organisciak' },
		{ label: 'CREATIVITY BYTE', href: 'https://buttondown.com/creativity' },
		{ label: 'OPEN CREATIVITY SCORING', href: 'https://openscoring.du.edu/' },
		{ label: 'CLASSIC MODE', href: '/1' }
	];

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 's') {
			menuIndex = (menuIndex + 1) % menuItems.length;
		} else if (e.key === 'ArrowUp' || e.key === 'w') {
			menuIndex = (menuIndex - 1 + menuItems.length) % menuItems.length;
		} else if (e.key === 'Enter' || e.key === ' ') {
			const item = menuItems[menuIndex];
			if (item.href.startsWith('http')) {
				window.open(item.href, '_blank');
			} else {
				window.location.href = item.href;
			}
		}
	}

	function selectItem(i: number) {
		const item = menuItems[i];
		if (item.href.startsWith('http')) {
			window.open(item.href, '_blank');
		} else {
			window.location.href = item.href;
		}
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

	<MetaTags
		title="{meta.title}"
		canonical="{meta.url}"
		description="{meta.description}"
		openGraph={{
			siteName: 'porg.dev',
			type: 'website',
			url: meta.url,
			locale: 'en_US',
			title: meta.title,
			description: meta.description,
			images: [
			  {
				url: 'https://en.gravatar.com/userimage/77028/c3830b8a81f001e01a2f5e96ade157b8.jpg?size=200',
				alt: 'Photo of Dr. Peter Organisciak',
				width: 200,
				height: 200,
				type: 'image/png'
			  }
			]
		}}
		twitter={{
			handle: '@porg',
			site: '@porg',
			cardType: 'summary_large_image',
			title: meta.title,
			description: meta.description,
			image: 'https://en.gravatar.com/userimage/77028/c3830b8a81f001e01a2f5e96ade157b8.jpg?size=200',
			imageAlt: 'Photo of Dr. Peter Organisciak'
		  }}
		/>
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="snes-page">
	<!-- Starfield background -->
	<div class="stars-container">
		{#if mounted}
			{#each stars as star}
				<div
					class="star"
					style="left: {star.x}%; top: {star.y}%; width: {star.size}px; height: {star.size}px; animation-delay: {star.twinkleDelay}s; opacity: {star.brightness};"
				></div>
			{/each}
		{/if}
	</div>

	<!-- Scanlines overlay -->
	<div class="scanlines"></div>

	<!-- Main content -->
	<div class="content">
		<!-- Decorative top border -->
		<div class="pixel-border-top"></div>

		<!-- Portrait with pixel frame -->
		<div class="portrait-container">
			<div class="portrait-frame">
				<img
					src="https://en.gravatar.com/userimage/77028/c3830b8a81f001e01a2f5e96ade157b8.jpg?size=200"
					alt="Peter Organisciak"
					class="portrait"
				/>
			</div>
			<div class="portrait-glow"></div>
		</div>

		<!-- Title -->
		<div class="title-container">
			<h1 class="title">
				<span class="title-line">PETER</span>
				<span class="title-line">ORGANISCIAK</span>
			</h1>
		</div>

		<!-- Stats bar like an RPG -->
		<div class="stats-bar">
			<div class="stat">
				<span class="stat-label">CLASS</span>
				<span class="stat-value">PROFESSOR</span>
			</div>
			<div class="stat-divider">|</div>
			<div class="stat">
				<span class="stat-label">SPEC</span>
				<span class="stat-value">AI + CREATIVITY</span>
			</div>
			<div class="stat-divider">|</div>
			<div class="stat">
				<span class="stat-label">GUILD</span>
				<span class="stat-value">UNIV. OF DENVER</span>
			</div>
		</div>

		<!-- Tagline -->
		<p class="tagline">
			Building tools that unlock creativity<br/>and secrets in massive text archives.
		</p>

		<!-- Menu -->
		<nav class="menu" role="menu">
			{#each menuItems as item, i}
				<button
					class="menu-item"
					class:active={i === menuIndex}
					on:mouseenter={() => menuIndex = i}
					on:click={() => selectItem(i)}
					role="menuitem"
				>
					<span class="cursor">{i === menuIndex ? '\u25B6' : '\u00A0\u00A0'}</span>
					<span class="label">{item.label}</span>
				</button>
			{/each}
		</nav>

		<!-- Controls hint -->
		<div class="controls-hint">
			<span class="key">W</span><span class="key">S</span> or <span class="key">\u2191</span><span class="key">\u2193</span> SELECT
			<span class="separator">\u00A0\u00A0\u00A0</span>
			<span class="key">ENTER</span> CONFIRM
		</div>

		<!-- Social icons in pixel style -->
		<div class="social-row">
			<a href="https://bsky.app/profile/organi.bsky.social" aria-label="Bluesky" target="_blank" rel="me" class="social-icon">
				<Fa icon={faBluesky} />
			</a>
			<a href="https://github.com/organisciak" aria-label="Github" target="_blank" class="social-icon">
				<Fa icon={faGithub} />
			</a>
			<a href="https://www.linkedin.com/in/organisciak/" aria-label="LinkedIn" target="_blank" class="social-icon">
				<Fa icon={faLinkedinIn} />
			</a>
		</div>

		<!-- Copyright in retro style -->
		<div class="copyright">
			&copy; {currentYear} PORG.DEV
		</div>
	</div>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}

	.snes-page {
		font-family: 'Press Start 2P', monospace;
		min-height: 100vh;
		background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);
		position: relative;
		overflow: hidden;
	}

	/* Starfield */
	.stars-container {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.star {
		position: absolute;
		background: #fff;
		border-radius: 0;
		animation: twinkle 2s ease-in-out infinite;
	}

	@keyframes twinkle {
		0%, 100% { opacity: var(--star-opacity, 0.6); }
		50% { opacity: 0.2; }
	}

	/* Scanlines */
	.scanlines {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 100;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.15) 0px,
			rgba(0, 0, 0, 0.15) 1px,
			transparent 1px,
			transparent 2px
		);
	}

	/* Content */
	.content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem 1rem;
		gap: 1.5rem;
	}

	/* Pixel border */
	.pixel-border-top {
		width: 80%;
		max-width: 600px;
		height: 8px;
		background: repeating-linear-gradient(
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
		);
		image-rendering: pixelated;
	}

	/* Portrait */
	.portrait-container {
		position: relative;
	}

	.portrait-frame {
		padding: 6px;
		background: linear-gradient(135deg, #ffcc00, #ff6600, #ff0066, #cc00ff, #00ccff);
		position: relative;
	}

	.portrait-frame::before {
		content: '';
		position: absolute;
		inset: 3px;
		background: #1a1a3a;
	}

	.portrait {
		width: 120px;
		height: 120px;
		position: relative;
		z-index: 1;
		image-rendering: pixelated;
		filter: contrast(1.1) saturate(1.2);
	}

	.portrait-glow {
		position: absolute;
		inset: -20px;
		background: radial-gradient(circle, rgba(255, 102, 0, 0.3) 0%, transparent 70%);
		z-index: -1;
		animation: pulse-glow 3s ease-in-out infinite;
	}

	@keyframes pulse-glow {
		0%, 100% { opacity: 0.5; transform: scale(1); }
		50% { opacity: 0.8; transform: scale(1.1); }
	}

	/* Title */
	.title-container {
		text-align: center;
	}

	.title {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.title-line {
		display: block;
		font-size: clamp(1.2rem, 4vw, 2rem);
		color: #fff;
		text-shadow:
			3px 3px 0 #ff6600,
			-1px -1px 0 #00ccff,
			0 0 20px rgba(255, 102, 0, 0.5);
		letter-spacing: 0.1em;
	}

	/* Stats bar */
	.stats-bar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		font-size: 0.5rem;
		color: #aaa;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.stat-label {
		color: #ffcc00;
		font-size: 0.4rem;
	}

	.stat-value {
		color: #fff;
	}

	.stat-divider {
		color: #444;
	}

	/* Tagline */
	.tagline {
		font-size: 0.6rem;
		color: #88ccff;
		text-align: center;
		line-height: 1.8;
		max-width: 400px;
		text-shadow: 0 0 10px rgba(136, 204, 255, 0.5);
	}

	/* Menu */
	.menu {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.7rem;
		color: #aaa;
		transition: all 0.1s;
		padding: 0.5rem 1rem;
	}

	.menu-item:hover,
	.menu-item.active {
		color: #fff;
	}

	.menu-item.active {
		transform: scale(1.05);
	}

	.menu-item .cursor {
		color: #ffcc00;
		text-shadow: 0 0 10px #ffcc00;
		width: 1rem;
	}

	.menu-item.active .cursor {
		animation: cursor-blink 0.5s ease-in-out infinite;
	}

	@keyframes cursor-blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}

	/* Controls hint */
	.controls-hint {
		font-size: 0.45rem;
		color: #666;
		display: flex;
		align-items: center;
		gap: 0.3rem;
		margin-top: 1.5rem;
	}

	.key {
		background: #333;
		color: #aaa;
		padding: 0.2rem 0.4rem;
		border: 1px solid #555;
		border-radius: 2px;
		margin: 0 0.1rem;
	}

	.separator {
		color: #444;
	}

	/* Social icons */
	.social-row {
		display: flex;
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.social-icon {
		font-size: 1.2rem;
		color: #666;
		transition: all 0.2s;
	}

	.social-icon:hover {
		color: #ffcc00;
		text-shadow: 0 0 10px #ffcc00;
		transform: scale(1.2);
	}

	/* Copyright */
	.copyright {
		font-size: 0.4rem;
		color: #444;
		margin-top: 2rem;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.stats-bar {
			font-size: 0.4rem;
		}

		.stat-divider {
			display: none;
		}

		.stats-bar {
			gap: 1rem;
		}

		.portrait {
			width: 100px;
			height: 100px;
		}

		.controls-hint {
			display: none;
		}
	}
</style>
