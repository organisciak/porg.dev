<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Carousel from "$lib/components/ui/carousel";
  
    export let findings: Array<{
      main: string;
      details: string;
      links: Array<{ text: string; url: string }>;
    }>;
  </script>
  
  <Carousel.Root class="w-full max-w-full sm:max-w-xl mx-auto px-4" opts={{

    align: "start",
    loop: true,
    slidesToScroll: 'auto',
    containScroll: 'trimSnaps'
  }}>
    <Carousel.Content class="-ml-1">
      {#each findings as finding, i (i)}
        <Carousel.Item class="pl-1 md:basis-1 lg:basis-1/2 2xl:basis-1/3">
          <div class="p-1">
            <Card.Root>
              <Card.Header>
                <Card.Title>{finding.main}</Card.Title>
              </Card.Header>
              <Card.Content>
                <p>{finding.details}</p>
              </Card.Content>
              <Card.Footer class="flex flex-col items-start gap-2">
                {#each finding.links as link}
                  <a href={link.url} class="text-blue-500 hover:underline">{link.text}</a>
                {/each}
              </Card.Footer>
            </Card.Root>
          </div>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root>