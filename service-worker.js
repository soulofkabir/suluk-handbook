/* ══════════════════════════════════════════════════════════
   SULUK DIGITAL HANDBOOK — Service Worker
   Caches core assets for offline reading (PWA — Phase F)
   ══════════════════════════════════════════════════════════ */

const CACHE_NAME = 'suluk-handbook-v1';

const CORE_ASSETS = [
  '/suluk-handbook/',
  '/suluk-handbook/index.html',
  '/suluk-handbook/assets/images/inayatiyya_emblem_transparent.png',
  '/suluk-handbook/assets/images/mount_qaf.JPG',
  '/suluk-handbook/assets/images/pir_zia_inayat_khan.JPG',
  '/suluk-handbook/assets/images/hazrat_inayat_khan.JPG',
  '/suluk-handbook/assets/images/pir_vilayat_khan.jpg',
];

const DATA_ASSETS = [
  '/suluk-handbook/data/handbook_concentration.json',
  '/suluk-handbook/data/glossary.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Cache-first for assets, network-first for data
  const url = new URL(event.request.url);

  if (url.pathname.includes('/data/')) {
    // Network-first for JSON data (keep fresh)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for HTML, images, assets
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }
});
