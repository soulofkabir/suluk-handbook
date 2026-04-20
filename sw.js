/**
 * Suluk Digital Handbook — Service Worker
 * Enables offline access by caching core assets and data files.
 * Strategy: Cache-first for assets, network-first for data (with cache fallback).
 */

const CACHE_NAME = 'suluk-v5';
const DATA_CACHE = 'suluk-data-v5';

// Core assets to pre-cache on install
const CORE_ASSETS = [
  '/suluk-handbook/',
  '/suluk-handbook/index.html',
  '/suluk-handbook/manifest.json',
  '/suluk-handbook/assets/favicon.svg',
  '/suluk-handbook/assets/images/mount_qaf.JPG',
  '/suluk-handbook/assets/images/inayatiyya_emblem.jpg',
  '/suluk-handbook/assets/images/inayatiyya_emblem_transparent.png',
  '/suluk-handbook/assets/images/hazrat_inayat_khan.JPG',
  '/suluk-handbook/assets/images/pir_vilayat_khan.jpg',
  '/suluk-handbook/assets/images/pir_zia_inayat_khan.JPG',
  '/suluk-handbook/assets/images/prayer_invocation.png',
  '/suluk-handbook/assets/images/prayer_salat_text.png',
  '/suluk-handbook/assets/images/prayer_saum_text.png',
  '/suluk-handbook/assets/images/salat_movements_1.png',
  '/suluk-handbook/assets/images/salat_movements_2.png',
  '/suluk-handbook/assets/images/saum_movements_1.png',
  '/suluk-handbook/assets/images/saum_movements_2.png',
  '/suluk-handbook/assets/images/saum_movements_3.png',
  '/suluk-handbook/assets/images/urs_qutbuddin.jpg',
  '/suluk-handbook/assets/images/mansur_rahm.png',
];

// Data files — network-first with cache fallback
const DATA_FILES = [
  '/suluk-handbook/data/handbook_concentration.json',
  '/suluk-handbook/data/audio_manifest.json',
  '/suluk-handbook/data/cross_reference_data.json',
  '/suluk-handbook/data/glossary.json',
  '/suluk-handbook/data/writings/kabir_writings.json',
  '/suluk-handbook/data/writings/kabir_other.json',
  '/suluk-handbook/data/homework/homework_content.json',
];

// Install: pre-cache core assets and data
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
      caches.open(DATA_CACHE).then((cache) => cache.addAll(DATA_FILES)),
    ]).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== DATA_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests (sync, uploads, etc.)
  if (event.request.method !== 'GET') return;

  // Skip Worker/API requests (cloud sync, library)
  if (url.hostname.includes('workers.dev')) return;

  // Google Fonts — cache-first (they rarely change)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Data files — network-first (so updates are picked up), cache fallback for offline
  if (DATA_FILES.some((f) => url.pathname === f)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DATA_CACHE).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Audio files from R2 — cache on first play for offline listening
  if (url.hostname.includes('r2.dev') || url.pathname.includes('.mp3') || url.pathname.includes('.m4a')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          // Only cache successful full responses (not range requests)
          if (response.ok && !event.request.headers.get('range')) {
            const clone = response.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML pages — network-first so code updates are always picked up
  if (event.request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Everything else (images, favicon, etc.) — cache-first, network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
