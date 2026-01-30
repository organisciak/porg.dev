<script lang="ts">
  import { urlMappings } from "$lib/data/urlShortenerList";
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";

  // Group urlMappings by category
  const groupedMappings = urlMappings.reduce(
    (acc, mapping) => {
      const category = mapping.category
        ? mapping.category.charAt(0).toUpperCase() + mapping.category.slice(1)
        : "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(mapping);
      return acc;
    },
    {} as Record<string, typeof urlMappings>,
  );

  // Sort categories alphabetically, with 'Other' at the end
  const sortedCategories = Object.keys(groupedMappings).sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return a.localeCompare(b);
  });

  function copyToClipboard(shortUrl: string) {
    const fullUrl = `links.porg.dev/${shortUrl}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        // You might want to add some visual feedback here
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }
</script>

<div class="container mx-auto">
  <h1 class="my-4">Links</h1>

  {#each sortedCategories as category}
    <h2 class="mb-4 mt-8 text-2xl font-bold">{category}</h2>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each groupedMappings[category] as mapping}
        <Card.Root>
          <Card.Header>
            <Card.Title>{mapping.shorturl}</Card.Title>
            <Card.Description>{mapping.description || "N/A"}</Card.Description>
          </Card.Header>
          <Card.Content>
            <p class="break-all text-sm text-muted-foreground">{mapping.destination}</p>
          </Card.Content>
          <Card.Footer class="flex justify-between">
            <Button variant="outline" on:click={() => copyToClipboard(mapping.shorturl)}>
              Copy
            </Button>
            <Button as="a" href={mapping.destination} target="_blank" rel="noopener noreferrer">
              Visit
            </Button>
          </Card.Footer>
        </Card.Root>
      {/each}
    </div>
  {/each}
</div>
