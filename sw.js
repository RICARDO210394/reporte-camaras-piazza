// Service Worker - Cámaras Piazza
// VERSION: 2 — cambiar este número cada vez que se actualiza la app
// El navegador detecta el cambio y fuerza la actualización automática

const CACHE_NAME = 'camaras-piazza-v2';
const ARCHIVOS_ESENCIALES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalación: guardar archivos esenciales en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS_ESENCIALES))
  );
  self.skipWaiting(); // Activar inmediatamente sin esperar
});

// Activación: limpiar cachés viejos y tomar control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Network First — siempre intenta la red primero
self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(respuesta => {
        if (respuesta && respuesta.status === 200) {
          const copia = respuesta.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copia));
        }
        return respuesta;
      })
      .catch(() => caches.match(event.request))
  );
});

// Responder al mensaje de actualización inmediata
self.addEventListener('message', event => {
  if(event.data && event.data.tipo === 'SKIP_WAITING'){
    self.skipWaiting();
  }
});
