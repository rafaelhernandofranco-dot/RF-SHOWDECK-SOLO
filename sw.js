// RF Showdeck Solo: funciona sin internet (guarda la app en el iPad)
const V = 'rfsolo-v21';
const FILES = ['./', 'index.html', 'manifest.json', 'icon-180.png', 'icon-512.png', 'clip.js'];
self.addEventListener ('install', e => { e.waitUntil (caches.open (V).then (c => c.addAll (FILES))); self.skipWaiting(); });
self.addEventListener ('activate', e => { e.waitUntil (caches.keys().then (ks => Promise.all (ks.filter (k => k !== V).map (k => caches.delete (k))))); self.clients.claim(); });
self.addEventListener ('fetch', e =>
{
  if (e.request.method !== 'GET') return;
  // primero la red (para recibir actualizaciones); sin internet, la copia guardada
  e.respondWith (fetch (e.request, { cache: 'no-store' }).then (r => { const cp = r.clone(); caches.open (V).then (c => c.put (e.request, cp)); return r; }).catch (() => caches.match (e.request, { ignoreSearch: true }).then (r => r || caches.match ('index.html'))));
});
