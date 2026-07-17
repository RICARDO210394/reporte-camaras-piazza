// SW VERSION: 20260717050156
const CACHE_NAME = 'camaras-20260717050156';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e => { if(!e.request.url.startsWith(self.location.origin))return; e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))); });
