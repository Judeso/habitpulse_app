/* HabitPulse — Service Worker v2.0
   Aucun import/export — compatible avec tous les navigateurs */

var CACHE = 'hp-v2';
var ASSETS = ['/', '/index.html'];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(ASSETS).catch(function() {});
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  /* Ne pas intercepter les API externes */
  if (url.indexOf('anthropic') !== -1 || url.indexOf('supabase') !== -1 || url.indexOf('pagead') !== -1 || url.indexOf('fonts.g') !== -1) return;
  e.respondWith(
    fetch(e.request).then(function(res) {
      if (res.ok && e.request.method === 'GET') {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
      }
      return res;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});

self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'HabitPulse 🌱', {
      body: data.body || "N'oublie pas tes habitudes aujourd'hui !",
      icon: '/icons/icon-192.png',
      tag: 'hp-reminder',
      vibrate: [200, 100, 200],
      data: { url: '/' }
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(list) {
      if (list.length) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});
