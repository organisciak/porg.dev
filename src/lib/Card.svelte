<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let msgs = ["go to a new bar",
				"go to a random restaurant",
				"change up your route",
				"drive somewhere new for a hike or a run",
				"cook from a recipe",
				"wear something you haven't worn in awhile",
				"do a mindfulness meditation",
				"close your eyes and do a mental walk through a place you haven't been to in a while",
				"read a book outside",
				"lay in the grass and look at the clouds",
				"have a conversation with a stranger",
				"take a different form of transportation",
				"explore a new neighborhood",
				"look up something you've always wanted to know more about",
				"play a new artist or band",
				"try a new food",
				"watch today's sunset",
				"buy a new plant for your home",
				"give yourself a break and do something you enjoy",
				"have a picnic",
				"go stargazing",
				"watch a movie you've never seen before",
				"build something with your hands",
				"draw or paint something",
				"plan a trip somewhere you've always wanted to go",
				"make a list of things you're grateful for",
				"reach out to someone you haven't talked to in awhile",
				"take some deep breaths and relax",
				"go for a walk and take in the sights and sounds around you",
				"stop and smell the flowers",
				"listen to the birds singing",
				"watch the leaves blowing in the wind",
				"have a seat and people watch",
				"create something new",
				"organise your space",
				"clear out some clutter",
				"sit by a body of water",
				"photograph the things you see",
				"write down your goals",
				"visit a museum",
				"go to the zoo",
				"take a road trip",
				"plan a day trip",
				"visit a farmer's market",
				"go picking for an in-season fruit",
				"have a picnic in the park",
				"play tourist in your own town or city",
				"ride a roller coaster",
				"play mini golf",
				"watch a movie in the theater",
				"go to a comedy club",
				"go to a planetarium"
				]
	let msg_shuffle = msgs.map(value => ({ value, sort: Math.random() }))
						  .sort((a, b) => a.sort - b.sort)
						  .map(({ value }) => value)
	
	let flipcnt = 0;
	let flipped = true;

	let msgA = msg_shuffle[0];
	let msgB = '';

	let rotateAngle = 2;
	const flip = tweened(flipcnt * 180, {
		duration: 400,
		easing: cubicOut
	});

	const rotate = tweened(rotateAngle, {
		duration: 400,
		easing: cubicOut
	});

	const newcard = function() {
		flipcnt += 1;
		flip.set(flipcnt * 180);
		let nextMsg = msg_shuffle[flipcnt % msg_shuffle.length]
		if (flipcnt % 2 == 0) {
			msgA = nextMsg;
		} else {
			msgB = nextMsg;
		}
		flipped = !flipped;
		rotate.set(flipped ? rotateAngle : -rotateAngle)
	}

</script>

<div class="flip-card" style="transform: rotateY(0deg) rotate({$rotate}deg)" on:click="{() => newcard() }">
	<div class="flip-card-inner" style="transform: rotateY({$flip}deg)">
	  <div class="flip-card-front">
		<h1>{msgA}</h1>
	  </div>
	  <div class="flip-card-back">
		<h1>{msgB}</h1>
	  </div>
	</div>
  </div>

  <button on:click="{() => newcard() }">New</button>

<style>

/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  padding: 3rem;
  width: 300px;
  height: 400px;
  perspective: 1000px;
  transform: rotateY(0deg) rotate(5deg);
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  /*transition: transform 0.8s;*/
  transform-style: preserve-3d;
}

.flip-card-front, .flip-card-back {
  position: absolute;
  border-radius: 1rem;
  width: 100%;
  height: 100%;
  padding: 1rem;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

.flip-card-front {
  background-color: var(--primary-color);
  color: black;
}

.flip-card-front h1, .flip-card-back h1 {
	height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
	font-size: xx-large;
}

.flip-card-back {
  background-color: var(--secondary-color);
  color: white;
  transform: rotateY(180deg);
}

</style>