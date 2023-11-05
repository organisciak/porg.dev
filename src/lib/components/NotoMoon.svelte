<script lang='ts'>
    /*
    Draw a moon with a given proportion of the circle filled.

    Uses the Noto Emoji black and white glyphs to draw the moon, using the
    Adobe SVG version of the glyphs. See the license:
    https://github.com/adobe-fonts/noto-emoji-svg/blob/main/fonts/LICENSE
    */
    export let proportion:number = 0; // Number from 0 to 1
    let roundedProportion: number;

    $: roundedProportion = Math.round(proportion * 4)/4;

    const svgRef = {
        0: '/noto_emoji_bw/u1f311.svg',
        0.25: '/noto_emoji_bw/u1f314.svg',
        0.5: '/noto_emoji_bw/u1f313.svg',
        0.75: '/noto_emoji_bw/u1f312.svg',
        1: '/noto_emoji_bw/u1f315.svg',
    }
</script>

<img 
    src={svgRef[roundedProportion]}
    style="height:1em;vertical-align:-.125em;transform-origin:center;overflow:visible"
/>

