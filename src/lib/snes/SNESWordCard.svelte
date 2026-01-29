<script lang="ts">
	import { onMount } from 'svelte';

	let currentWord: { word: string; pos: string; definition: string; rarity: number } | null = null;

	async function fetchWord() {
		try {
			const res = await fetch('/api/random-word');
			currentWord = await res.json();
		} catch (e) {
			console.error('Failed to fetch word', e);
		}
	}

	onMount(() => {
		fetchWord();
	});
</script>

<div class="fun-card">
	<div class="fun-card-header">
		<span class="fun-card-title">UNUSUAL WORD</span>
		<button class="refresh-btn" on:click={fetchWord} aria-label="Get new word">↻</button>
	</div>
	{#if currentWord}
		<div class="word-content">
			<span class="word-term">{currentWord.word}</span>
			<span class="word-pos">{currentWord.pos}</span>
			<p class="word-def">{currentWord.definition}</p>
			<span class="word-rarity">RARITY: {'★'.repeat(currentWord.rarity)}{'☆'.repeat(5 - currentWord.rarity)}</span>
		</div>
	{:else}
		<div class="loading-text">LOADING...</div>
	{/if}
</div>

<style>
	.fun-card {
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid #444;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-family: 'Press Start 2P', monospace;
	}

	.fun-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.fun-card-title {
		font-size: 0.45rem;
		color: #ffcc00;
	}

	.refresh-btn {
		background: none;
		border: 1px solid #555;
		color: #888;
		font-size: 0.6rem;
		padding: 0.2rem 0.4rem;
		cursor: pointer;
		font-family: inherit;
		transition: all 0.2s;
	}

	.refresh-btn:hover {
		color: #ffcc00;
		border-color: #ffcc00;
	}

	.loading-text {
		font-size: 0.4rem;
		color: #666;
		text-align: center;
		padding: 1rem 0;
	}

	.word-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.word-term {
		font-size: 0.55rem;
		color: #fff;
	}

	.word-pos {
		font-size: 0.35rem;
		color: #888;
	}

	.word-def {
		font-size: 0.4rem;
		color: #aaa;
		margin: 0;
		line-height: 1.5;
	}

	.word-rarity {
		font-size: 0.35rem;
		color: #ff6600;
		margin-top: 0.25rem;
	}
</style>
