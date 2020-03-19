
const CACHE_STATIC_NAME = 'static-v7';
const CACHE_DYNAMIC_NAME = 'dynamic-v4';

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker ...');
    // event.waitUntil(
    //   caches.open(CACHE_STATIC_NAME).then(function(cache) {
    //     console.log('[Service  Worker] precaching App Shell')
    //    return cache.addAll([
    //       '/',
    //       '/index.html',
    //       '/src/js/app.js',
    //       '/src/js/feed.js',
    //       '/src/js/promise.js',
    //       '/src/js/fetch.js',
    //       '/src/js/material.min.js',
    //       '/src/css/app.css',
    //       '/src/css/feed.css',
    //       '/src/images/main-image.jpg',
    //       'https://fonts.googleapis.com/css?family=Roboto:400,700',
    //       'https://fonts.googleapis.com/icon?family=Material+Icons',
    //       'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
    //     ]);
    //   }))
  });

  self.addEventListener("active", function(event){

  })

  self.addEventListener("fetch", function(event){

  })