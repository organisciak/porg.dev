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

<!--

	<div class="p-12 w-[300px] h-[400px] perspective-massive transform rotate-[0deg] rotate-[$rotate]deg" on:click="{() => newcard() }">
	<div class="relative text-center transform-style" style="transform: rotateY({$flip}deg)">
	  <div class="backface-hidden">
		<h1 class="flex justify-center items-center text-xl">{msgA.main}</h1>
		<p class="italic"><em>{@html msgA.details}</em></p>
	  </div>
	  <div class=" backface-hidden">
		<h1 class="flex justify-center items-center text-xl">{msgB.main}</h1>
		<p class="italic"><em>{@html msgB.details}</em></p>
	  </div>
	</div>
  </div>
-->

<div class="flex flex-col m-5 bg-transparent flip-card w-[350px] md:w-[400px] h-[350px] md:h-[300px]" style="transform: rotateY(0deg) rotate({$rotate}deg)" on:click="{() => newcard() }">
	<div class="select-none text-sm text-cyan-600 italic m-0 p-0">Click for More</div>
	<div class="flex-1 flip-card-inner justify-center" style="transform: rotateY({$flip}deg)">
	  <div class="grow absolute p-4 backface-hidden rounded-xl w-full bg-slate-700">
		<h1 class="mt-5 text-2xl">{msgA.main}</h1>
		<p class="text-sm italic"><em>{@html msgA.details}</em></p>
	  </div>
	  <div class="grow absolute p-4 flip-card-back rounded-xl w-full backface-hidden bg-slate-700">
		<h1 class='mt-5 text-2xl'>{msgB.main}</h1>
		<p class="text-sm italic"><em>{@html msgB.details}</em></p>
	  </div>
	</div>
  </div>

  

<style>
.flip-card {
  perspective: 1000px;
  transform: rotateY(0deg) rotate(5deg);
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  /*transition: transform 0.8s;*/
  transform-style: preserve-3d;
}

.backface-hidden {
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
	}

.flip-card-back {
  transform: rotateY(180deg);
}

</style>