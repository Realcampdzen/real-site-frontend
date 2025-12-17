// Service Worker для AI Studio
// Версия кэша
const CACHE_VERSION = 'v1.9-20251216-reveal-force';
const CACHE_NAME = `ai-studio-${CACHE_VERSION}`;
const STATIC_CACHE = `ai-studio-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `ai-studio-dynamic-${CACHE_VERSION}`;

// Поддержка деплоя в подкаталог (GitHub Pages, stage и т.п.)
const SCOPE_URL = new URL(self.registration.scope);
const BASE_PATH = SCOPE_URL.pathname.replace(/\/$/, '');
const withBase = (path) => (BASE_PATH ? `${BASE_PATH}${path}` : path);

// Ресурсы для кэширования (только локальные, внешние ресурсы кэшируются динамически)
const STATIC_ASSETS = [
  withBase('/'),
  withBase('/index.html'),
  withBase('/css/style.css'),
  withBase('/css/critical-fixes.css'),
  withBase('/css/mobile-improvements.css'),
  withBase('/css/mobile-advanced.css'),
  withBase('/js/hero-reveal.js'),
  withBase('/js/scroll-manager.js'),
  withBase('/js/video-optimizer.js'),
  withBase('/js/script.js'),
  withBase('/js/chat.js'),
  withBase('/js/services-carousel.js'),
  withBase('/js/performance-loader.js'),
  withBase('/js/mobile-enhancements.js'),
  withBase('/js/glass-ui-hipych.js'),
  withBase('/js/glass-ui-bro-cat.js'),
  withBase('/js/glass-ui-valyusha.js'),
  withBase('/chat-components/GlassUIWidget.js'),
  withBase('/images/hipych-avatar.jpg'),
  withBase('/images/bro-avatar.jpg'),
  withBase('/images/neon-room.png')
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Установка');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Кэширование статических ресурсов');
        // Кэшируем ресурсы с обработкой ошибок для внешних CDN
        return Promise.allSettled(
          STATIC_ASSETS.map(url => {
            return cache.add(url).catch(error => {
              // Игнорируем ошибки для внешних ресурсов (CSP может блокировать)
              if (url.startsWith('http://') || url.startsWith('https://')) {
                console.warn('⚠️ Service Worker: Не удалось кэшировать внешний ресурс', url, error.message);
                return null;
              }
              throw error;
            });
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Установка завершена');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Ошибка установки', error);
        // Продолжаем работу даже при ошибках
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Активация');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Удаляем все старые версии кэша
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: Удаление старого кэша', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Активация завершена, версия', CACHE_NAME);
        return self.clients.claim();
      })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Не трогаем не-GET запросы
  if (request.method !== 'GET') {
    return;
  }

  // HTML (navigation) — network-first, иначе сайт "залипает" на старом index.html
  const accepts = request.headers.get('accept') || '';
  const isHTML = request.mode === 'navigate' || accepts.includes('text/html');
  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (sameOrigin && networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, copy).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return (
            caches.match(request) ||
            caches.match(withBase('/index.html'))
          );
        })
    );
    return;
  }

  // Стратегия для статических ресурсов
  if (sameOrigin && isStaticAsset(request.url) && !url.pathname.endsWith('/sw.js')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const copy = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, copy).catch(() => {});
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        // stale-while-revalidate
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Стратегия для изображений
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((networkResponse) => {
              // Кэшируем только успешные ответы
              if (networkResponse.status === 200) {
                return caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, networkResponse.clone()).catch(err => {
                      console.warn('⚠️ Service Worker: Не удалось кэшировать изображение', request.url, err.message);
                    });
                    return networkResponse;
                  });
              }
              return networkResponse;
            })
            .catch((error) => {
              // Игнорируем ошибки CSP для внешних ресурсов
              if (error.message.includes('CSP') || error.message.includes('Content Security Policy')) {
                console.warn('⚠️ Service Worker: Ресурс заблокирован CSP', request.url);
                // Позволяем браузеру обработать запрос самостоятельно
                return fetch(request);
              }
              // Возвращаем placeholder изображение только для локальных ресурсов
              if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
                return new Response(
                  '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Изображение недоступно</text></svg>',
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              }
              throw error;
            });
        })
    );
    return;
  }

  // Стратегия для API запросов
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Кэшируем только GET запросы
          if (request.method === 'GET' && networkResponse.status === 200) {
            return caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, networkResponse.clone()).catch(err => {
                  console.warn('⚠️ Service Worker: Не удалось кэшировать API ответ', request.url, err.message);
                });
                return networkResponse;
              });
          }
          return networkResponse;
        })
        .catch((error) => {
          // Игнорируем ошибки CSP
          if (error.message.includes('CSP') || error.message.includes('Content Security Policy')) {
            console.warn('⚠️ Service Worker: API запрос заблокирован CSP', request.url);
            return fetch(request);
          }
          // Возвращаем кэшированную версию для GET запросов
          if (request.method === 'GET') {
            return caches.match(request);
          }
          
          // Для других методов возвращаем ошибку
          return new Response(
            JSON.stringify({ error: 'Нет подключения к интернету' }),
            { 
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // Стратегия по умолчанию - сеть с fallback на кэш
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Кэшируем только успешные ответы
        if (networkResponse.status === 200) {
          return caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, networkResponse.clone()).catch(err => {
                console.warn('⚠️ Service Worker: Не удалось кэшировать ресурс', request.url, err.message);
              });
              return networkResponse;
            });
        }
        return networkResponse;
      })
      .catch((error) => {
        // Игнорируем ошибки CSP для внешних ресурсов
        if (error.message && (error.message.includes('CSP') || error.message.includes('Content Security Policy'))) {
          console.warn('⚠️ Service Worker: Ресурс заблокирован CSP, пропускаем кэширование', request.url);
          // Для внешних ресурсов просто возвращаем ошибку, браузер загрузит их напрямую
          if (request.url.startsWith('http://') || request.url.startsWith('https://')) {
            return fetch(request).catch(() => {
              // Если и прямой fetch не работает, возвращаем ошибку
              return new Response('Resource blocked by CSP', { status: 403 });
            });
          }
        }
        // Если сеть недоступна, возвращаем из кэша
        return caches.match(request);
      })
  );
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ cacheSize: size });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearCache().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Обработка push уведомлений
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'У вас новое сообщение от AI Studio',
      icon: '/images/icon-192.png',
      badge: '/images/badge-72.png',
      tag: 'ai-studio-notification',
      renotify: true,
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Открыть',
          icon: '/images/action-open.png'
        },
        {
          action: 'close',
          title: 'Закрыть',
          icon: '/images/action-close.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'AI Studio', options)
    );
  }
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Синхронизация в фоне
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncData()
    );
  }
});

// Вспомогательные функции

function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.woff', '.woff2', '.ttf', '.eot'];
  return staticExtensions.some(ext => url.includes(ext));
}

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

async function clearCache() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

async function syncData() {
  try {
    // Здесь можно добавить логику синхронизации данных
    console.log('🔄 Service Worker: Синхронизация данных');
    
    // Например, отправка отложенных сообщений чата
    const pendingMessages = await getStoredMessages();
    if (pendingMessages.length > 0) {
      await sendPendingMessages(pendingMessages);
      await clearStoredMessages();
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Service Worker: Ошибка синхронизации', error);
    return Promise.reject(error);
  }
}

async function getStoredMessages() {
  // Получаем сохраненные сообщения из IndexedDB
  return [];
}

async function sendPendingMessages(messages) {
  // Отправляем отложенные сообщения
  for (const message of messages) {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  }
}

async function clearStoredMessages() {
  // Очищаем сохраненные сообщения
}

console.log('🎯 Service Worker загружен и готов к работе'); 