import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     window.addEventListener('load', function () {
  //       navigator.serviceWorker.register('/service-worker.js').then(
  //         function (registration) {
  //           console.log(
  //             'Service Worker registration successful with scope: ',
  //             registration.scope
  //           );
  //         },
  //         function (err) {
  //           console.log('Service Worker registration failed: ', err);
  //         }
  //       );
  //     });
  //   }
  // }, []);

  var version = 'v3'; // increase for new version
  var staticCacheName = version + '_pwa-static';
  var dynamicCacheName = version + '_pwa-dynamic';

  self.addEventListener('activate', function (event: any) {
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
                window.location.reload();
              }

              console.log('Removing old cache.', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
    );
  });

  return (
    <div id='root'>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
