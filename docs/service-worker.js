const u = [
  "/internal/immutable/start-12171660.js",
  "/internal/immutable/components/pages/_layout.svelte-8f7cfa2d.js",
  "/internal/immutable/assets/_layout-e1710667.css",
  "/internal/immutable/components/error.svelte-c48639b6.js",
  "/internal/immutable/components/pages/_page.svelte-9202118c.js",
  "/internal/immutable/assets/_page-4b8b58fa.css",
  "/internal/immutable/components/pages/about/_page.svelte-b338e929.js",
  "/internal/immutable/assets/_page-9682aba9.css",
  "/internal/immutable/components/pages/cv/_page.svelte-2d5fc0d0.js",
  "/internal/immutable/modules/pages/_page.js-b22103a5.js",
  "/internal/immutable/modules/pages/about/_page.js-591cac76.js",
  "/internal/immutable/modules/pages/cv/_page.js-a5bfeea2.js",
  "/internal/immutable/chunks/singletons-d93fa3c5.js",
  "/internal/immutable/chunks/index-dbd7d164.js",
  "/internal/immutable/chunks/stores-a60c7ca7.js",
  "/internal/immutable/chunks/SvelteMarkdown-4fab7680.js",
  "/internal/immutable/chunks/_page-6af8351b.js",
  "/internal/immutable/chunks/_page-69b5f5c7.js",
  "/internal/immutable/chunks/_page-dc3ca71a.js",
  "/internal/immutable/chunks/0-4e9bc043.js",
  "/internal/immutable/chunks/1-bace339e.js",
  "/internal/immutable/chunks/2-763aea73.js",
  "/internal/immutable/chunks/3-8e1d7812.js",
  "/internal/immutable/chunks/4-2e5079cf.js"
], p = [
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
], i = "1663128775418", a = self, o = `cache${i}`, l = `offline${i}`, h = ["/"], b = [
  "https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css",
  "https://fonts.cdnfonts.com/css/hk-groteks"
], d = (e) => e.map((s) => self.location.origin + s), f = d([
  ...p.filter((e) => !/\/icons\/(apple.*?|original.png)/.test(e)),
  ...u,
  ...h
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
