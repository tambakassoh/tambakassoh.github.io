/* Study Labs service worker: makes the site installable and keeps visited labs available offline.
   Bump VERSION whenever you want every phone to drop its old copy immediately. */
const VERSION = "study-labs-v1";
const CORE = ["/", "/index.html", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  const sameOrigin = url.origin === self.location.origin;
  const fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !fonts) return;
  if (req.mode === "navigate"){
    // Pages: try the network first so updates appear right away; fall back to the saved copy offline.
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req, {ignoreSearch:true}).then(r => r || caches.match(url.pathname.endsWith("/") ? url.pathname + "index.html" : url.pathname.replace(/index\.html$/, ""))).then(r => r || caches.match("/"))));
    return;
  }
  // Scripts, styles, fonts, icons: answer from the saved copy instantly and refresh it in the background.
  e.respondWith(caches.open(VERSION).then(c => c.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res && (res.ok || res.type === "opaque")) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
