<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let shuffle = true;

	let msgs = [
		{"main": "Scoring creativity with Large-Language models greatly improves on state of the art models.",
		"details":"Studying creativity is challenged by the difficulty of measuring and scoring tests of originality. We improved on automated scoring of one common test, the Alternate Uses Task, to a large degree.<br /><a target='_blank' href='http://dx.doi.org/10.13140/RG.2.2.32393.31840'>Read the preprint</a> or try the system at <a target='blank_' href='https://openscoring.du.edu/scoringllm'>Open Creativity Scoring</a>",
		},
		{"main": "Artificial data can address class imbalance in digital library classifiers.",
		"details":"We seek to identify whole-part relationships between books, such as when one story is published in another anthology. This type of relationship is hard to infer from cataloguing metadata, but we find that constructing artificial books can teach a deep neural network classifier what the relationship looks like.<br /><a target='_blank' href='https://doi.org/10.1177/01655515221093031'>Read the paper in Journal of Informaion Sciences</a>.",
		},
		{
			"main": "Research access over sensitive or restricted texts can be encouraged through non-expressive distribution strategies.",
			"details": "Text analysis in the digital humanities is challenged by legal hurdles, which make it difficult to access and especially to redistribute datasets of modern texts. We explore principles of non-expressive and non-consumptive access as one solution to enabling research access to sensitive texts. <a target='blank_' href='https://www.taylorfrancis.com/chapters/oa-edit/10.4324/9781003131816-8/research-access-copyright-texts-humanities-peter-organisciak-stephen-downie'>Read the chapter</a>"
		}
		
		,
				]
	
	let msg_shuffle = msgs;
	if (shuffle === true) {
		 msg_shuffle = msgs.map(value => ({ value, sort: Math.random() }))
						  .sort((a, b) => a.sort - b.sort)
						  .map(({ value }) => value)
	}
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
		<h1>{msgA.main}</h1>
		<p><em>{@html msgA.details}</em></p>
	  </div>
	  <div class="flip-card-back">
		<h1>{msgB.main}</h1>
		<p><em>{@html msgB.details}</em></p>
	  </div>
	</div>
  </div>

  <button on:click="{() => newcard() }">More</button>

<style>

/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  padding: 3rem;
  width: 300px;
  height:400px;
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
	margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
	font-size: x-large;
}

.flip-card-back {
  background-color: var(--secondary-color);
  color: white;
  transform: rotateY(180deg);
}

</style>