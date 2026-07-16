// Service Worker - Cámaras Piazza
// Estrategia: Network First — siempre intenta la red primero.
// Si no hay internet, usa el caché. Así la PWA siempre muestra
// la versión más nueva cuando hay conexión.

const CACHE_NAME = 'camaras-piazza-v1';
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

// Activación: limpiar cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim(); // Tomar control de todas las pestañas abiertas
});

// Fetch: Network First
self.addEventListener('fetch', event => {
  // Solo interceptar peticiones del mismo origen (no Firebase, CDN, etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(respuesta => {
        // Si la red respondió bien, actualizar el caché y devolver la respuesta
        if (respuesta && respuesta.status === 200) {
          const copia = respuesta.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copia));
        }
        return respuesta;
      })
      .catch(() => {
        // Sin internet: usar el caché
        return caches.match(event.request);
      })
  );
});

// Responder al mensaje de actualización inmediata
self.addEventListener('message', event => {
  if(event.data && event.data.tipo === 'SKIP_WAITING'){
    self.skipWaiting();
  }
});
