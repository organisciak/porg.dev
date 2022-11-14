const u = [
  "/internal/immutable/start-f85a557c.js",
  "/internal/immutable/components/layout.svelte-a7b71853.js",
  "/internal/immutable/components/error.svelte-63c8aa43.js",
  "/internal/immutable/components/pages/_page.svelte-780b6975.js",
  "/internal/immutable/assets/_page-848e7bf4.css",
  "/internal/immutable/components/pages/about/_page.svelte-b9666f26.js",
  "/internal/immutable/assets/_page-9682aba9.css",
  "/internal/immutable/components/pages/cv/_page.svelte-40fca939.js",
  "/internal/immutable/modules/pages/_page.js-b22103a5.js",
  "/internal/immutable/modules/pages/about/_page.js-591cac76.js",
  "/internal/immutable/modules/pages/cv/_page.js-a5bfeea2.js",
  "/internal/immutable/chunks/singletons-cdc6cc01.js",
  "/internal/immutable/chunks/index-eaa46c43.js",
  "/internal/immutable/chunks/index-2e7f7351.js",
  "/internal/immutable/chunks/SvelteMarkdown-d9d535f5.js",
  "/internal/immutable/chunks/_page-6af8351b.js",
  "/internal/immutable/chunks/_page-69b5f5c7.js",
  "/internal/immutable/chunks/_page-dc3ca71a.js",
  "/internal/immutable/chunks/0-df8e74e5.js",
  "/internal/immutable/chunks/1-c6d3b18f.js",
  "/internal/immutable/chunks/2-b4f353e0.js",
  "/internal/immutable/chunks/3-a3a25ce9.js",
  "/internal/immutable/chunks/4-fd6bedb9.js"
], h = [
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
  "/browserconfig.xml",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon.ico",
  "/logo.png",
  "/maskable_icon_x512.png",
  "/mstile-150x150.png",
  "/robots.txt",
  "/safari-pinned-tab.svg"
], i = "1668469671640", n = self, o = `cache${i}`, l = `offline${i}`, p = ["/"], b = [
  "https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css",
  "https://fonts.cdnfonts.com/css/hk-groteks"
], d = (e) => e.map((t) => self.location.origin + t), f = d([
  ...h.filter((e) => !/\/icons\/(apple.*?|original.png)/.test(e)),
  ...u,
  ...p
]), r = [...f, ...b], g = new Set(r);
n.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(o).then((t) => t.addAll(r)).then(() => {
      n.skipWaiting();
    })
  );
});
n.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(async (t) => {
      for (const s of t)
        s !== o && s !== l && await caches.delete(s);
      n.clients.claim();
    })
  );
});
async function j(e) {
  const t = await caches.open(l);
  try {
    const s = await fetch(e);
    return t.put(e, s.clone()), s;
  } catch (s) {
    const a = await t.match(e);
    if (a)
      return a;
    throw s;
  }
}
n.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || e.request.headers.has("range"))
    return;
  const t = new URL(e.request.url), s = t.protocol.startsWith("http"), a = t.hostname === self.location.hostname && t.port !== self.location.port, c = g.has(t.href), m = e.request.cache === "only-if-cached" && !c;
  s && !a && !m && e.respondWith(
    (async () => c && await caches.match(e.request) || j(e.request))()
  );
});
