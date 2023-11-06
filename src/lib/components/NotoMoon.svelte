<script lang='ts'>
    /*
    Draw a moon with a given proportion of the circle filled.

    Uses the Noto Emoji black and white glyphs to draw the moon, using the
    Adobe SVG version of the glyphs. See the license:
    https://github.com/adobe-fonts/noto-emoji-svg/blob/main/fonts/LICENSE
    */
    export let proportion:number = 0; // Number from 0 to 1
    let roundedProportion: number;
    import Moon0 from '$lib/assets/noto_emoji_bw/u1f311.svelte';
    import Moon25 from '$lib/assets/noto_emoji_bw/u1f314.svelte';
    import Moon50 from '$lib/assets/noto_emoji_bw/u1f313.svelte';
    import Moon75 from '$lib/assets/noto_emoji_bw/u1f312.svelte';
    import Moon100 from '$lib/assets/noto_emoji_bw/u1f315.svelte';

    $: roundedProportion = Math.round(proportion * 4)/4;
</script>

{#if roundedProportion == 0}
    <Moon0 />
{:else if roundedProportion == 0.25}
    <Moon25 />
{:else if roundedProportion == 0.5}
    <Moon50 />
{:else if roundedProportion == 0.75}
    <Moon75 />
{:else if roundedProportion == 1}
    <Moon100 />
{/if}