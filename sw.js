/* Service Worker: optik-tara-v1.0.0 */
const CACHE_NAME = 'optik-tara-v1.0.0'; 

// Önbelleğe alınacak dosyalar
// Not: Buraya yeni cevap anahtarı (.js) veya şablon (.json) ekledikçe listeyi güncelleyin.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './optic_lgs_sayisal.json',
  './deneme1.js',
  'https://docs.opencv.org/4.5.2/opencv.js' // OpenCV kütüphanesini de cache'e alıyoruz
];

// 1. Kurulum: Dosyaları Cache'e al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache açıldı, dosyalar kaydediliyor...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 2. Aktivasyon: Eski versiyonları temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski OMR önbelleği siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Getirme: Önce Cache, yoksa Network (Hızlı açılış için)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Eğer cache'de varsa onu döndür, yoksa ağa git
      return response || fetch(event.request);
    })
  );
});