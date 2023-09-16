<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export const shuffle: boolean = true;

	interface Msg {
	 	main: string;
	 	details: string;
	};

	export let msgs:Msg[] = [];
	
	let msg_shuffle: Msg[] = msgs;
	if (shuffle === true && msgs.length > 0) {
		 msg_shuffle = msgs.map(value => ({ value, sort: Math.random() }))
						  .sort((a, b) => a.sort - b.sort)
						  .map(({ value }) => value)
	}
	let flipcnt:number = 0;
	let flipped:boolean = true;

	let msgA:Msg = msg_shuffle.length > 0 ? msg_shuffle[0] : {main: "", details: ""};
	let msgB:Msg = msg_shuffle.length > 1 ? msg_shuffle[1] : msgA;

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

  <button class="button-primary" on:click="{() => newcard() }">More</button>

<style>
/* Center align button */
button.button-primary {
  margin: 0 auto;
  display: block;
}

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
  background-color: var(--secondary-color);
  color: white;
}

.flip-card-front h1, .flip-card-back h1 {
	margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
	font-size: x-large;
}

.flip-card-back {
  background-color: var(--tertiary-color);
  transform: rotateY(180deg);
}

</style>