// HabitPulse Service Worker v1.0
// Gère : cache offline, notifications push, background sync

const CACHE_NAME = 'habitpulse-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,900;1,300&family=Syne:wght@400;600;700;800&display=swap',
];

// ── INSTALL ──────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing HabitPulse SW...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache partiel :', err);
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH (cache-first pour assets, network-first pour API) ─
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ne pas intercepter les requêtes API Supabase/Anthropic
  if (url.hostname.includes('supabase') || url.hostname.includes('anthropic') || url.hostname.includes('pagead')) {
    return;
  }

  // Cache-first pour fonts et assets statiques
  if (url.hostname.includes('fonts.googleapis') || url.hostname.includes('fonts.gstatic')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Network-first pour les pages
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── PUSH NOTIFICATIONS ───────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'HabitPulse';
  const options = {
    body: data.body || "N'oublie pas tes habitudes aujourd'hui !",
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'habitpulse-reminder',
    renotify: true,
    data: { url: data.url || '/' },
    actions: [
      { action: 'open',    title: '✅ Voir mes habitudes' },
      { action: 'dismiss', title: '⏰ Plus tard' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ── NOTIFICATION CLICK ───────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// ── BACKGROUND SYNC (streak check) ──────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'streak-check') {
    event.waitUntil(checkStreakAndNotify());
  }
});

async function checkStreakAndNotify() {
  // En production : appel Supabase pour vérifier la streak
  // et envoyer une notif si l'utilisateur n'a rien coché aujourd'hui
  console.log('[SW] Background sync: streak check');
}

// ── PERIODIC BACKGROUND SYNC (rappel quotidien) ──────────
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(sendDailyReminder());
  }
});

async function sendDailyReminder() {
  const hour = new Date().getHours();
  if (hour >= 18 && hour <= 21) {
    await self.registration.showNotification('HabitPulse 🌱', {
      body: "Tu n'as pas encore coché toutes tes habitudes aujourd'hui !",
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      tag: 'daily-reminder',
      actions: [{ action: 'open', title: '✅ Les cocher maintenant' }],
    });
  }
}
