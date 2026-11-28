// Service worker: guarda la app para que funcione sin conexión.
// Si cambias algún archivo, sube el número de versión para que los móviles lo actualicen.
const CACHE = 'bingo-v6';
const ASSETS = [
  './',
  'index.html',
  'styles.css?v=6',
  'modes.js?v=6',
  'app.js?v=6',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-512-maskable.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('bingo-v') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Red primero, caché si no hay conexión (incluye las fuentes de Google)
  // Los archivos propios se piden saltándose la caché del navegador, para que
  // nunca se mezclen archivos de versiones distintas.
  const own = new URL(e.request.url).origin === location.origin;
  e.respondWith(
    fetch(e.request, own ? { cache: 'no-cache' } : undefined)
      .then(res => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
