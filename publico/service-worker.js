const dateNow = new Date();
const preCache = `Cache ${dateNow}`;
const runTime = 'runtime';

const preCacheUrls = [
    '/',
    // html file
    './views/login.html',
    './views/registro.html',
    // css file
    './styles/login.css',
    './styles/registro.css',
    // javascript filter
    './scripts/login.js',
    './scripts/registro.js',
    './scripts/install.js',
    // manifest file
    './../manifest.json',
    // assets
    './img/',
    // maps api
    //'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=AIzaSyB2twdyhbY-Am2MgyGkWBpHZnTktlw8PJs&callback=initMap',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(preCache)
      .then(cache => cache.addAll(preCacheUrls))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [preCache, runTime];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }, err => console.log(`Erro em cache.keys: ${err}`))
    .then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }, err => console.log(`Erro em cacheNames.filter: ${err}`))
    .then(() => self.clients.claim(), err => console.log(`Erro em caches.delete: ${err}`))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return caches.open(runTime).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});