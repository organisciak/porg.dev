const u = [
  "/internal/immutable/start-d3624964.js",
  "/internal/immutable/components/pages/_layout.svelte-cd0e3d49.js",
  "/internal/immutable/assets/_layout-e1710667.css",
  "/internal/immutable/components/error.svelte-4ecd4c6c.js",
  "/internal/immutable/components/pages/_page.svelte-4e631849.js",
  "/internal/immutable/assets/_page-848e7bf4.css",
  "/internal/immutable/components/pages/about/_page.svelte-eeafa934.js",
  "/internal/immutable/assets/_page-9682aba9.css",
  "/internal/immutable/components/pages/cv/_page.svelte-15721f06.js",
  "/internal/immutable/modules/pages/_page.js-b22103a5.js",
  "/internal/immutable/modules/pages/about/_page.js-591cac76.js",
  "/internal/immutable/modules/pages/cv/_page.js-a5bfeea2.js",
  "/internal/immutable/chunks/singletons-b3637e31.js",
  "/internal/immutable/chunks/index-cff90d79.js",
  "/internal/immutable/chunks/index-2c834eee.js",
  "/internal/immutable/chunks/stores-bc0cea38.js",
  "/internal/immutable/chunks/SvelteMarkdown-de3cfaa7.js",
  "/internal/immutable/chunks/_page-6af8351b.js",
  "/internal/immutable/chunks/_page-69b5f5c7.js",
  "/internal/immutable/chunks/_page-dc3ca71a.js",
  "/internal/immutable/chunks/0-48d1eed1.js",
  "/internal/immutable/chunks/1-2b9709cf.js",
  "/internal/immutable/chunks/2-7f91a606.js",
  "/internal/immutable/chunks/3-60c5321e.js",
  "/internal/immutable/chunks/4-fa886c2f.js"
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
], i = "1665773229061", n = self, o = `cache${i}`, l = `offline${i}`, p = ["/"], d = [
  "https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css",
  "https://fonts.cdnfonts.com/css/hk-groteks"
], b = (e) => e.map((s) => self.location.origin + s), f = b([
  ...h.filter((e) => !/\/icons\/(apple.*?|original.png)/.test(e)),
  ...u,
  ...p
]), r = [...f, ...d], g = new Set(r);
n.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(o).then((s) => s.addAll(r)).then(() => {
      n.skipWaiting();
    })
  );
});
n.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(async (s) => {
      for (const t of s)
        t !== o && t !== l && await caches.delete(t);
      n.clients.claim();
    })
  );
});
async function j(e) {
  const s = await caches.open(l);
  try {
    const t = await fetch(e);
    return s.put(e, t.clone()), t;
  } catch (t) {
    const a = await s.match(e);
    if (a)
      return a;
    throw t;
  }
}
n.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || e.request.headers.has("range"))
    return;
  const s = new URL(e.request.url), t = s.protocol.startsWith("http"), a = s.hostname === self.location.hostname && s.port !== self.location.port, c = g.has(s.href), m = e.request.cache === "only-if-cached" && !c;
  t && !a && !m && e.respondWith(
    (async () => c && await caches.match(e.request) || j(e.request))()
  );
});
