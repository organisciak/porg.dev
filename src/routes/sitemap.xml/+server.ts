export async function GET() {
    // compare with list of urls at `find * -name "+page*.svelte"`
    const urls = [
        'https://porg.dev/colors',
        'https://porg.dev/cv',
        'https://porg.dev',
        'https://porg.dev/huehunter',
    ];

    const urlset = urls.map(url => `<url><loc>${url}</loc></url>`).join('\n');

    return new Response(
        `
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset
            xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="https://www.w3.org/1999/xhtml"
            xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
            xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
            xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
            xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
        >
        ${urlset}
        </urlset>`.trim(),
        {
            headers: {
                'Content-Type': 'application/xml',
            },
        },
    );
}
