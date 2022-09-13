<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<header>

	<nav>
		<div class='name'>Peter Organisciak</div>
		<ul>
			<li class:active={$page.url.pathname === '{base}/'}>
				<a sveltekit:prefetch href="{base}/">Home</a>
			</li>
			<!--
			<li class:active={$page.url.pathname === '{base}/about'}>
				<a sveltekit:prefetch href="{base}/about">About</a>
			</li>

			<li>
				<a>Faculty Info</a>
			</li>

			<li>
			<a>CV</a>
			</li>

			<li>
			<a>Writing</a>
			</li>-->
		</ul>
	</nav>

</header>

<style>
	.name {
		rotate: 270deg;
    display: none; /* hidden for now */
    background: yellow;
    border-radius: 1rem;
    margin-top: 100px;
    padding: 10px;
    float: left;
	}
	header {
		display: flex;
		justify-content: space-between;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
		
		margin: 10px;
		background: var(--background);
	}

	li:nth-child(1) { 
		transform: rotateY(0deg) rotate(5deg);
	}

	li:nth-child(2) { 
		transform: rotateY(0deg) rotate(-2deg);
	}

	li:nth-child(3) { 
		transform: rotateY(0deg) rotate(-5deg);
	}

	li:nth-child(4) { 
		transform: rotateY(0deg) rotate(2deg);
	}

	li:nth-child(5) { 
		transform: rotateY(0deg) rotate(-2deg);
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

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
