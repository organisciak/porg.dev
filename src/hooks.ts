// src/hooks.ts

export async function handle({ request, resolve }) {
    const { host } = request.headers;

    let modifiedRequest = request;

    // Check if the request is coming from the custom domain
    if (host === 'links.porg.dev') {
        // Rewrite the URL to have the `/l/` prefix
        modifiedRequest = {
            ...request,
            url: `/l${request.url}`
        };
    }

    // Continue resolving the request with the (potentially) modified URL
    return await resolve(modifiedRequest);
}
