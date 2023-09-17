import type { UrlMapping } from '$lib/data/urlShortenerList';
import { urlMappings } from '$lib/data/urlShortenerList';

type RequestParams = {
    shorturl: string;
};

export async function GET({ params }: { params: RequestParams }) {
    const shorturl = params.shorturl;

    const mapping = urlMappings.find((entry: UrlMapping) => entry.shorturl === `/${shorturl}`);

    if (mapping) {
        return new Response(null,{
            status: 302, // HTTP status code for redirect
            headers: {
                location: mapping.destination
            }
        });
    }

    // If no mapping found, return a 404
    return new Response("Url not found", {
        status: 404
    });
}