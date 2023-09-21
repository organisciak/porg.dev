<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<header>

	<nav>
		<ul>
			<li class:active={$page.url.pathname === '{base}/'} class='name'>
				<a data-sveltekit-prefetch href="{base}/">Peter Organisciak</a>
			</li>

			<li class:active={$page.url.pathname === '{base}/cv'}>
				<a data-sveltekit-prefetch href="{base}/cv">CV</a>
			</li>
		</ul>
		<ul>
			<li class:active={$page.url.pathname === '{base}/colors'}>
				<a data-sveltekit-prefetch href="{base}/colors">Colors</a>
			</li>
			<!--
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
		background: transparent;
		/*make font weight thicker than parent*/
		font-weight: 1200;
	}
	header {
		display: flex;
		justify-content: space-between;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: var(--heading-color);
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
		background: transparent;
		
		/* Define the border width */
		border-bottom: 2px solid; /* Adjust the border thickness as needed */
		/* Use the gradient as the border image */
		border-image: linear-gradient(to right, #4c2b69, #d073ff);
		border-image-slice: 1; /* This ensures the gradient spans the entire border width */
	}
	li.active {
		border-bottom: 4px solid;
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
		color: black;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
