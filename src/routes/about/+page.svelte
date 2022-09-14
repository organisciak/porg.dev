<script>
	import { base, assets } from '$app/paths';
  </script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About New Perspectives" />
</svelte:head>

<div class="content">
	<h1>New Perspectives</h1>

	<p>New Perspectives is a Deck of Strategies for Exploring the World Around You.</p>
	<p>
		It was written in collaboration with GPT-3, a large language model.
	<a href="https://arxiv.org/abs/2005.14165">Language models are few-shot learners</a>, which
	refers to their ability to pick up a task with a few examples. While 'task' usually refers a 
	common natural language processing challenge, what it really means is that it can continue <em>anything</em>
	that you've started. Here, I gave it a personal list of strategies to break out of routine,
	and it suggested more tips in line with mine - some of which were adopted, adapted, and used for more
	suggestions.</p>

	<p>The favicon is a lightly-edited generation from <a href="https://openai.com/dall-e-2/">DALL-E 2</a>,
		because why not?</p>

	<p><a href="https://twitter.com/POrg?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @POrg</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></p>

	<p><img src="logo.png" style="width:100%" alt="A round logo of a rainbow in front of a sun." /></p>

	
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
