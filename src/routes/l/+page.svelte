<script lang="ts">
    import { urlMappings } from "$lib/data/urlShortenerList";
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";

    function copyToClipboard(shortUrl: string) {
        const fullUrl = `links.porg.dev/${shortUrl}`;
        navigator.clipboard.writeText(fullUrl)
            .then(() => {
                // You might want to add some visual feedback here
                alert('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
</script>

<div class="container mx-auto">
<h1 class="my-4">PORG.dev URL Shortener List</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each urlMappings as mapping}
        <Card.Root>
        <Card.Header>
            <Card.Title>{mapping.shorturl}</Card.Title>
            <Card.Description>{mapping.description || 'N/A'}</Card.Description>
        </Card.Header>
        <Card.Content>
            <p class="text-sm text-muted-foreground break-all">{mapping.destination}</p>
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
</div>