// Service Worker - Cámaras Piazza
// VERSION: 20260716190743
const CACHE_NAME = 'camaras-piazza-20260716190743';
const ARCHIVOS_ESENCIALES = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS_ESENCIALES)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(fetch(event.request).then(r => { if(r && r.status===200){const c=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,c));} return r; }).catch(() => caches.match(event.request)));
});
self.addEventListener('message', event => { if(event.data && event.data.tipo==='SKIP_WAITING') self.skipWaiting(); });
