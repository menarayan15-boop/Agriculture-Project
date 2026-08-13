/**
 * Krishi Jal - Service Worker for Low-Bandwidth Networks & Offline Access
 * Strategy: Network-First to ensure fresh application updates on every reload.
 */

const CACHE_NAME = 'krishi-jal-cache-v105-' + Date.now();

// Install Event: Skip waiting immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate Event: Purge ALL previous caches unconditionally
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Fetch Event: Network-First for ALL local app code, assets, and APIs
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET' || !req.url.startsWith('http')) return;

    // Network-First strategy: Always fetch fresh content from server first
    event.respondWith(
        fetch(req)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, responseClone));
                }
                return networkResponse;
            })
            .catch(() => {
                // Offline fallback: Use cached content if network unavailable
                return caches.match(req);
            })
    );
});
