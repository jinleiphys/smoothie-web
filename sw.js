// SMOOTHIE Website Service Worker
const CACHE_NAME = 'smoothie-v1.0.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/contact.html',
    '/generator.html',
    '/code.html',
    '/downloads.html',
    '/papers.html',
    '/examples.html',
    '/formulas.html',
    '/story.html',
    '/programs.html',
    '/faq.html'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SMOOTHIE: Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => caches.delete(cacheName))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    // Only handle same-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    // Serve from cache
                    return response;
                }

                // Network fallback
                return fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone response for caching
                        const responseToCache = response.clone();

                        // Cache dynamic content
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline fallback if available
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});