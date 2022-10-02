var version = 'v3.004'; // increase for new version

// during the install phase you usually want to cache static assets
self.addEventListener('install', function (e) {
  // once the SW is installed, go ahead and fetch the resources to make this work offline
  e.waitUntil(
    caches.open(version).then(function (cache) {
      return cache.addAll(['./']).then(function () {
        self.skipWaiting();
      });
    })
  );
});

// when the browser fetches a url
self.addEventListener('fetch', function (event) {
  // either respond with the cached object or go ahead and fetch the actual url
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        // retrieve from cache
        return response;
      }
      // fetch as normal
      return fetch(event.request);
    })
  );
});

var staticCacheName = version + '_pwa-static';
var dynamicCacheName = version + '_pwa-dynamic';

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            if (
              !cacheName.startsWith(staticCacheName) &&
              !cacheName.startsWith(dynamicCacheName)
            ) {
              return true;
            }
          })
          .map(function (cacheName) {
            // completely deregister for ios to get changes too
            console.log('deregistering Serviceworker');
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker
                .getRegistrations()
                .then(function (registrations) {
                  registrations.map((r) => {
                    r.unregister();
                  });
                });
              window.location.reload(true);
            }

            console.log('Removing old cache.', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
});
