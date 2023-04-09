const u = [
  "/internal/immutable/start-c597c71b.js",
  "/internal/immutable/components/pages/_layout.svelte-fc00a638.js",
  "/internal/immutable/assets/_layout-e1710667.css",
  "/internal/immutable/components/error.svelte-75f3ed75.js",
  "/internal/immutable/components/pages/_page.svelte-46ea242d.js",
  "/internal/immutable/assets/_page-2f4b640e.css",
  "/internal/immutable/components/pages/about/_page.svelte-eeafa934.js",
  "/internal/immutable/assets/_page-9682aba9.css",
  "/internal/immutable/components/pages/cv/_page.svelte-ec7df50b.js",
  "/internal/immutable/modules/pages/_page.js-b22103a5.js",
  "/internal/immutable/modules/pages/about/_page.js-591cac76.js",
  "/internal/immutable/modules/pages/cv/_page.js-a5bfeea2.js",
  "/internal/immutable/chunks/singletons-940bec66.js",
  "/internal/immutable/chunks/index-cff90d79.js",
  "/internal/immutable/chunks/index-2c834eee.js",
  "/internal/immutable/chunks/stores-c9325207.js",
  "/internal/immutable/chunks/SvelteMarkdown-de3cfaa7.js",
  "/internal/immutable/chunks/_page-6af8351b.js",
  "/internal/immutable/chunks/_page-69b5f5c7.js",
  "/internal/immutable/chunks/_page-dc3ca71a.js",
  "/internal/immutable/chunks/0-2006e599.js",
  "/internal/immutable/chunks/1-9b336133.js",
  "/internal/immutable/chunks/2-089562d5.js",
  "/internal/immutable/chunks/3-60c5321e.js",
  "/internal/immutable/chunks/4-a3ab5dc1.js"
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
], i = "1681006786968", a = self, o = `cache${i}`, l = `offline${i}`, p = ["/"], b = [
  "https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css",
  "https://fonts.cdnfonts.com/css/hk-groteks"
], d = (e) => e.map((s) => self.location.origin + s), f = d([
  ...h.filter((e) => !/\/icons\/(apple.*?|original.png)/.test(e)),
  ...u,
  ...p
]), r = [...f, ...b], g = new Set(r);
a.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(o).then((s) => s.addAll(r)).then(() => {
      a.skipWaiting();
    })
  );
});
a.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(async (s) => {
      for (const t of s)
        t !== o && t !== l && await caches.delete(t);
      a.clients.claim();
    })
  );
});
async function j(e) {
  const s = await caches.open(l);
  try {
    const t = await fetch(e);
    return s.put(e, t.clone()), t;
  } catch (t) {
    const n = await s.match(e);
    if (n)
      return n;
    throw t;
  }
}
a.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || e.request.headers.has("range"))
    return;
  const s = new URL(e.request.url), t = s.protocol.startsWith("http"), n = s.hostname === self.location.hostname && s.port !== self.location.port, c = g.has(s.href), m = e.request.cache === "only-if-cached" && !c;
  t && !n && !m && e.respondWith(
    (async () => c && await caches.match(e.request) || j(e.request))()
  );
});
