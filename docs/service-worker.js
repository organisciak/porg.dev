const u = [
  "/internal/immutable/start-08f03634.js",
  "/internal/immutable/components/pages/_layout.svelte-40aeb10f.js",
  "/internal/immutable/assets/_layout-e1710667.css",
  "/internal/immutable/components/error.svelte-5d0b86b8.js",
  "/internal/immutable/components/pages/_page.svelte-18cb2423.js",
  "/internal/immutable/assets/_page-4e9117bb.css",
  "/internal/immutable/components/pages/about/_page.svelte-82c5b968.js",
  "/internal/immutable/assets/_page-9682aba9.css",
  "/internal/immutable/components/pages/cv/_page.svelte-c97b5d7c.js",
  "/internal/immutable/modules/pages/_page.js-b22103a5.js",
  "/internal/immutable/modules/pages/about/_page.js-591cac76.js",
  "/internal/immutable/modules/pages/cv/_page.js-a5bfeea2.js",
  "/internal/immutable/chunks/singletons-fa970d7c.js",
  "/internal/immutable/chunks/index-6566c7cd.js",
  "/internal/immutable/chunks/index-ec23a648.js",
  "/internal/immutable/chunks/stores-5da602d3.js",
  "/internal/immutable/chunks/SvelteMarkdown-f1a799fa.js",
  "/internal/immutable/chunks/_page-6af8351b.js",
  "/internal/immutable/chunks/_page-69b5f5c7.js",
  "/internal/immutable/chunks/_page-dc3ca71a.js",
  "/internal/immutable/chunks/0-16449f57.js",
  "/internal/immutable/chunks/1-0fcaeaf6.js",
  "/internal/immutable/chunks/2-fba38e57.js",
  "/internal/immutable/chunks/3-f31dba18.js",
  "/internal/immutable/chunks/4-e01693c4.js"
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
], i = "1681697106203", a = self, o = `cache${i}`, l = `offline${i}`, p = ["/"], b = [
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
