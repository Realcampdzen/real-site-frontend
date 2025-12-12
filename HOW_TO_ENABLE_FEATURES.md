# 🔧 Инструкция по включению скрытых функций

Этот файл содержит инструкции по включению функций, которые были временно скрыты для production версии сайта.

---

## 📋 Скрытые функции

### 1. Раздел с примерами работ

**Что скрыто:**
- Секция `#projects-showreel` с примерами работ
- Кнопка "Смотреть примеры" в hero секции

**Где находится:**
- Файл: `deploy-ready/index.html`

**Как включить:**

#### Вариант 1: Удалить style="display: none !important;"

Найдите в `deploy-ready/index.html`:

1. **Секцию с примерами работ:**
```html
<!-- ВРЕМЕННО СКРЫТО ДЛЯ PRODUCTION -->
<section id="projects-showreel" class="projects-banner-section" style="display: none !important;">
```

Замените на:
```html
<section id="projects-showreel" class="projects-banner-section">
```

2. **Кнопку "Смотреть примеры" в hero:**
```html
<!-- ВРЕМЕННО СКРЫТО ДЛЯ PRODUCTION -->
<button class="btn-primary" onclick="event.stopPropagation(); scrollToSection('projects-showreel')" style="display: none !important;">
  Смотреть примеры
</button>
```

Замените на:
```html
<button class="btn-primary" onclick="event.stopPropagation(); scrollToSection('projects-showreel')">
  Смотреть примеры
</button>
```

---

### 2. Функциональность чат-ботов

**Что изменено:**
- Все три бота (Кот Бро, Хипыч, НейроVалюша) временно возвращают сообщение о тестировании

**Где находится:**
- `deploy-ready/js/glass-ui-bro-cat.js`
- `deploy-ready/js/glass-ui-hipych.js`
- `deploy-ready/js/glass-ui-valyusha.js`

**Как включить:**

В каждом из трёх файлов найдите метод `handleMessage`:

#### Для Кота Бро (`glass-ui-bro-cat.js`):
```javascript
async handleMessage(message) {
    // ВРЕМЕННО: функция тестируется и скоро будет доступна
    return "🐱 Функция чата тестируется и скоро будет доступна! Спасибо за терпение! 😸";
}
```

Замените на оригинальную версию из `js/glass-ui-bro-cat.js`:
```javascript
async handleMessage(message) {
    try {
        // Показываем индикатор загрузки
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userId: 'user-' + Date.now()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.reply || this.getFallbackResponse(message);
    } catch (error) {
        console.error('🐱 Ошибка при запросе к Коту Бро:', error);
        // Fallback на статичные ответы
        return this.getFallbackResponse(message);
    }
}
```

#### Для Хипыча (`glass-ui-hipych.js`):
```javascript
async handleMessage(message) {
    // ВРЕМЕННО: функция тестируется и скоро будет доступна
    return "🤖 Функция чата тестируется и скоро будет доступна! Спасибо за терпение! 🎮";
}
```

Замените на оригинальную версию из `js/glass-ui-hipych.js`:
```javascript
async handleMessage(message) {
    try {
        // Показываем индикатор загрузки
        const response = await fetch('/api/hipych/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userId: 'user-' + Date.now()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.reply || this.getFallbackResponse(message);
    } catch (error) {
        console.error('🎮 Ошибка при запросе к Хипычу:', error);
        // Fallback на статичные ответы
        return this.getFallbackResponse(message);
    }
}
```

#### Для НейроVалюши (`glass-ui-valyusha.js`):
```javascript
async handleMessage(message) {
    // ВРЕМЕННО: функция тестируется и скоро будет доступна
    return "💜 Функция чата тестируется и скоро будет доступна! Спасибо за терпение! ✨";
}
```

Замените на оригинальную версию из `js/glass-ui-valyusha.js`:
```javascript
async handleMessage(message) {
    console.log('💜 НейроВалюша: начинаю обработку сообщения:', message);
    try {
        const requestBody = {
            message: message,
            userId: 'user-' + Date.now()
        };
        console.log('💜 НейроВалюша: отправляю запрос к /api/valyusha/chat', requestBody);
        
        const response = await fetch('/api/valyusha/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('💜 НейроВалюша: получен ответ, статус:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('💜 НейроВалюша: ошибка HTTP:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('💜 НейроВалюша: получены данные:', data);
        
        if (data.reply) {
            console.log('💜 НейроВалюша: возвращаю ответ от AI:', data.reply.substring(0, 100));
            return data.reply;
        } else {
            console.warn('💜 НейроВалюша: ответ пустой, используем fallback');
            return this.getFallbackResponse(message);
        }
    } catch (error) {
        console.error('💜 Ошибка при запросе к НейроВалюше:', error);
        console.error('💜 Детали ошибки:', error.message);
        // Fallback на статичные ответы
        return this.getFallbackResponse(message);
    }
}
```

---

### 3. Клики на карточки услуг (переход на страницы деталей)

**Что отключено:**
- При клике на карточки услуг в разделе "УСЛУГИ AI STUDIO" не происходит переход на страницу деталей услуги (`service-detail.html`)

**Где находится:**
- Файл: `deploy-ready/index.html`
- Функция: `handleServiceCardClick` в inline скрипте в конце файла

**Как включить:**

Найдите в `deploy-ready/index.html` функцию:

```javascript
function handleServiceCardClick(event, serviceId) {
  // ВРЕМЕННО: функция отключена для production
  event.preventDefault();
  event.stopPropagation();
  return false;
  
  // ЗАКОММЕНТИРОВАНО - раскомментировать при включении:
  // Don't navigate if clicking on interactive elements
  // if (event.target.closest('.service-simple-footer') ||
  //     event.target.closest('a') ||
  //     event.target.closest('button') ||
  //     event.target.closest('[data-contact-link]')) {
  //   return;
  // }
  // Navigate to service detail page
  // window.location.href = `service-detail.html?id=${serviceId}`;
}
```

Замените на оригинальную версию из `index.html`:

```javascript
function handleServiceCardClick(event, serviceId) {
  // Don't navigate if clicking on interactive elements
  if (event.target.closest('.service-simple-footer') ||
      event.target.closest('a') ||
      event.target.closest('button') ||
      event.target.closest('[data-contact-link]')) {
    return;
  }
  // Navigate to service detail page
  window.location.href = `service-detail.html?id=${serviceId}`;
}
```

---

## 📝 Процесс включения

1. **Откройте файлы** в `deploy-ready/` согласно инструкциям выше

2. **Внесите изменения** - удалите временные блокировки

3. **Загрузите файлы на NIC.RU** в соответствующие папки:
   - `deploy-ready/index.html` → `docs/index.html` (если изменяли секцию с примерами работ или клики на карточки)
   - `deploy-ready/js/glass-ui-bro-cat.js` → `docs/js/glass-ui-bro-cat.js` (если включали ботов)
   - `deploy-ready/js/glass-ui-hipych.js` → `docs/js/glass-ui-hipych.js` (если включали ботов)
   - `deploy-ready/js/glass-ui-valyusha.js` → `docs/js/glass-ui-valyusha.js` (если включали ботов)

4. **Проверьте** на сайте https://real-vibe.studio/

---

## ⚠️ Важно

- Оригинальные файлы (без скрытия) находятся в корне проекта, а не в `deploy-ready/`
- Изменения нужно делать только в `deploy-ready/` версиях
- После включения функций проверьте, что всё работает корректно

---

**Дата создания:** 2025-12-12  
**Причина скрытия:** Временное отключение функций для production

