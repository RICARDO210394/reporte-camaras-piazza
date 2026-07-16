// Service Worker - Cámaras Piazza
// VERSION: 20260716202401
const CACHE_NAME = 'camaras-piazza-20260716202401';
const URL_BASE = 'https://ricardo210394.github.io/reporte-camaras-piazza';
const ARCHIVOS_ESENCIALES = [URL_BASE + '/', URL_BASE + '/index.html'];
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
