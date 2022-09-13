<script lang="ts">
	import Card from '$lib/Card.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	const source = `
  # Peter Organisciak

  <div class="four columns">
		<img class="img-responsive img-circle hidden-md hidden-lg" src="https://en.gravatar.com/userimage/77028/c3830b8a81f001e01a2f5e96ade157b8.jpg?size=100" alt="Peter Organisciak">
	</div>

I'm an information scientist with expertise in crowd systems, text and data mining, 
and information retrieval.

As faculty in Library and Information Science at the University of Denver, 
I work on massive-scale text analysis, teaching computers to read and using
those methods to track cultural and and historic trends across centuries.

See more professional information at my [faculty page](http://portfolio.du.edu/organisciak).
`

</script>

<svelte:head>
	<title>Peter Organisciak</title>
	<meta name="description" content="Peter Organisciak Personal Site" />
</svelte:head>

<section class='intro'><div class="content">
	<SvelteMarkdown {source} />
</section>

<section id="writing-section"><div class="content">
	<h2>Writing</h2>
				<p>I write about crowds and text at <b><a href="https://medium.com/porganized">Sense and Sentences</a></b>.</p>

	<h2>Consulting</h2>
	<p><a href="mailto:organisciak+consult@gmail.com">Contact me</a> to inquire about data mining and machine learning assistance, or just to chat. I'm based in the Denver area.</p>
</div></section>

<section id="contact-section" class="success"><div class="content">
	<div class="container">
		<div class="row">
			<div class="col-md-12 text-center" id="contact">
				<h2>Contact</h2>
				<p>Peter.Organisciak@du.edu</p>
			</div>
		</div>
	</div>
</div></section>

<style>

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

/* Every second section is colored differently */
section:nth-of-type(even) {
    background: #00d1b2;
    color: #fff;
}

	h1 {
		width: 100%;
	}
</style>
