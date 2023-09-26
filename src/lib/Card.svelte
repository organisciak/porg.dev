<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export const shuffle: boolean = true;

	interface Msg {
	 	main: string;
	 	details: string;
		links: {
			text: string;
			url: string;
		}[]
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

	let msgA:Msg = msg_shuffle.length > 0 ? msg_shuffle[0] : {main: "", details: "", links:[]};
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

<div class="flex flex-col m-5 bg-transparent flip-card w-[350px] md:w-[400px] h-[350px] md:h-[300px]"
	style="transform: rotateY(0deg) rotate({$rotate}deg)"
	on:click="{() => newcard() }"
	on:keypress="{() => newcard() }"
	aria-expanded="{flipped}" 
	aria-label="Select to see more" role="button" tabindex="0"
	>

	<div class="select-none text-xs text-cyan-600 italic m-0 p-0">Click for More</div>
	<div class="flex-1 flip-card-inner justify-center" style="transform: rotateY({$flip}deg)">
	  <div class="grow absolute p-4 backface-hidden rounded-xl w-full bg-yellow-300 dark:bg-slate-700">
		<h1 class="mt-5 text-2xl">{msgA.main}</h1>
		<p class="text-sm italic">
			<em>{msgA.details}</em>
			{#each msgB.links as link}
				<a href="{link.url}" target="_blank">{link.text}</a><br/>
			{/each}
		</p>
	  </div>
	  <div class="grow absolute p-4 flip-card-back rounded-xl w-full backface-hidden bg-fuchsia-700 dark:bg-slate-700">
		<h1 class='mt-5 text-2xl text-fuchsia-50'>{msgB.main}</h1>
		<p class="details text-sm italic text-fuchsia-200">
			<em>{msgB.details}</em>
			{#each msgB.links as link}
				<a class="text-blue-300 hover:text-blue-400" href="{link.url}" target="_blank">{link.text}</a><br/>
			{/each}
		</p>
	  </div>
	</div>
  </div>

<style lang='postcss'>
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