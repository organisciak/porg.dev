<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Card from '$lib/Card.svelte';

	const source = `
  # Peter Organisciak

  <div class="two columns">
		<img class="img-responsive img-circle hidden-md hidden-lg" src="https://en.gravatar.com/userimage/77028/c3830b8a81f001e01a2f5e96ade157b8.jpg?size=100" alt="Peter Organisciak">
	</div>

I'm an information scientist with expertise in text and data mining, machine learning, crowd systems,
and information retrieval.

As faculty in Library and Information Science at the University of Denver, 
I work on massive-scale text analysis, teaching computers to read and using
those methods to track cultural and and historic trends across centuries. I also work with educational psychologists on improving automated measurement in education, particularly in the study of creativity.

See my [CV](/cv), or find [me](https://github.com/organisciak) and the [Massive Texts Lab](https://github.com/massivetexts) on Github.

Check out online tools: [Open Creativity Scoring](https://openscoring.du.edu/) for scoring tests of creativity, [SaDDL](https://saddl.du.edu) for digital library book relationships, and [HT+Bookworm](https://bookworm.htrc.illinois.edu/develop/) for exploring historic language trends.
`
</script>


<svelte:head>
	<title>Peter Organisciak</title>
	<meta name="description" content="Peter Organisciak Personal Site" />
</svelte:head>

<section class='intro'><div class="content doublewidth">
	<SvelteMarkdown {source} />
</section>

<section id="research-section"><div class="content">
	<h2>Recent Research</h2>
	<Card shuffle=false></Card>
</div></section>

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

	.doublewidth {
		max-width: var(--double-width);
	}
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
</style>
