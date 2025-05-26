// Service Worker для AI Studio
// Версия кэша
const CACHE_NAME = 'ai-studio-v1.2';
const STATIC_CACHE = 'ai-studio-static-v1.2';
const DYNAMIC_CACHE = 'ai-studio-dynamic-v1.2';

// Ресурсы для кэширования
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/mobile-improvements.css',
  '/js/script.js',
  '/js/mobile-enhancements.js',
  '/js/particles.js',
  '/js/chat.js',
  '/js/assistants.js',
  '/js/ai-assistant.js',
  '/js/glass-ui-hipych.js',
  '/js/glass-ui-bro-cat.js',
  '/chat-components/GlassUIWidget.js',
  '/images/hipych-avatar.jpg',
  '/images/bro-avatar.jpg',
  // Внешние ресурсы
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Установка');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Кэширование статических ресурсов');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Установка завершена');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Ошибка установки', error);
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
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Удаление старого кэша', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Активация завершена');
        return self.clients.claim();
      })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Стратегия для HTML страниц
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Возвращаем кэшированную версию
            return cachedResponse;
          }
          
          // Пытаемся загрузить из сети
          return fetch(request)
            .then((networkResponse) => {
              // Кэшируем новую версию
              return caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, networkResponse.clone());
                  return networkResponse;
                });
            })
            .catch(() => {
              // Возвращаем офлайн страницу
              return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Стратегия для статических ресурсов
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((networkResponse) => {
              return caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, networkResponse.clone());
                  return networkResponse;
                });
            });
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
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                  });
              }
              return networkResponse;
            })
            .catch(() => {
              // Возвращаем placeholder изображение
              return new Response(
                '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Изображение недоступно</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
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
                cache.put(request, networkResponse.clone());
                return networkResponse;
              });
          }
          return networkResponse;
        })
        .catch(() => {
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
        return caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
      })
      .catch(() => {
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