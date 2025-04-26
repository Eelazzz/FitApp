const CACHE_NAME = 'fitapp-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  //'./TemplateData/style.css',
  //'./TemplateData/favicon.ico',
  './Build/FitApp.data',
  './Build/FitApp.framework.js',
  './Build/FitApp.loader.js',
  './Build/FitApp.wasm',
  // Добавь сюда StreamingAssets, если есть
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app files');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return new Response('Нет интернета и файл не найден в кэше.', {
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});