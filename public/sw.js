/**
 * Minimal service worker for offline PWA support.
 *
 * It caches the app shell during installation, removes old caches on activate,
 * and serves cached files when the network is unavailable.
 */

/** Bump this name when cached production assets need to be invalidated. */
const CACHE_NAME = 'e-bike-akku-rechner-v2';

/** Files required for the app to open and render offline after first load. */
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.de.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/assets/index.css',
  '/assets/index.js'
];

/** Install event: pre-cache the shell and immediately activate the new worker. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

/** Activate event: remove old cache versions and take control of open clients. */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

/** Fetch event: serve cached app files first and fall back to network requests. */
self.addEventListener('fetch', (event) => {
  /** Only GET requests can safely be cached and replayed. */
  if (event.request.method !== 'GET') {
    return;
  }

  /**
   * Navigation requests should return index.html when offline, because this is
   * a single-page app and React handles the screen content.
   */
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html').then((cached) => cached ?? caches.match('/')))
    );
    return;
  }

  /** Static assets use a cache-first strategy with network fallback. */
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const responseCopy = networkResponse.clone();

        /** Cache same-origin files so future visits can use them offline. */
        if (new URL(event.request.url).origin === self.location.origin) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
        }

        return networkResponse;
      });
    })
  );
});
