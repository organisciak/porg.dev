<script lang="ts">
  import RandomItemLoader from "$lib/components/RandomItemLoader.svelte";
  import ColorBox from "$lib/colorbox/ColorBoxBase.svelte";
</script>

<RandomItemLoader apiEndpoint="/api/random-color" defaultTitle="Color Swatch">
  <svelte:fragment slot="default" let:currentItem={color}>
    {#if color}
      <div class="xs:h-16 w-auto sm:h-32 md:h-48">
        <ColorBox
          fadeInDuration={500}
          shareButton={false}
          showHex={true}
          colorname={color.name}
          csshex={color.hex}
          textSize="xs"
        />
      </div>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="footer">
    <a href="/colors">Browse all colors</a>
  </svelte:fragment>
</RandomItemLoader>
