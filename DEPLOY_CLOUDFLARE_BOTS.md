# Деплой ботов через Cloudflare для `real-vibe.studio`

Этот файл — **инструкция/ранбук**, чтобы любой агент (или разработчик) мог задеплоить нового бота через наш Cloudflare и подключить его к статическому фронтенду на NIC.RU.

## Архитектура (как сейчас устроено)

- **Фронтенд**: статический сайт на **NIC.RU** (`https://real-vibe.studio`).
- **Бэкенд/API**: **Cloudflare Pages Functions** (по сути Cloudflare Worker внутри Pages) на домене вида:
  - `https://real-vibe-ai-studio.pages.dev`
- **Связка**: фронт делает `fetch(...)` на Pages API (кросс-домен), поэтому важны:
  - **CORS allowlist** на стороне API
  - **Service Worker cache bump** на фронте, чтобы обновления JS реально доходили до пользователей

## Где какой код

- **Фронтенд (NIC.RU)**: этот репозиторий.
  - Базовый URL API задаётся в `js/script.js` через `window.__AI_API_BASE__`.
  - Чаты используют этот base в `js/chat.js` и `js/glass-ui-*.js`.
  - Service Worker: `sw.js` (версия кэша `CACHE_VERSION`).
  - Для прод-сборки под NIC.RU используется `prepare-deploy.ps1` → папка `deploy-ready/`.

- **API (Cloudflare Pages / Hono)**: репозиторий `Realcampdzen/Real_Vibe_AI_Studio_New` (ветка `main`).
  - Основной файл: `src/index.tsx`
  - Деплой в Cloudflare сейчас делается **ручной загрузкой папки `dist/`** (см. ниже).

## Текущие API эндпоинты ботов

- `POST /api/chat` — Кот Бро (основной)
- `POST /chat` — alias (для совместимости со старым фронтом)
- `POST /api/hipych/chat` — Хипыч
- `POST /api/valyusha/chat` — НейроВалюша

## Webhooks (соцсети)

- `POST /api/vk/callback` — VK Callback API (комментарии под постами)
- `POST /api/tg/webhook` — Telegram Bot API webhook (комментарии в привязанной группе-обсуждении)

Формат ответа для совместимости:

```json
{ "reply": "…", "response": "…" }
```

## Обязательные настройки в Cloudflare (прод)

Cloudflare Dashboard → Workers & Pages → `real-vibe-ai-studio` → Settings → Variables and Secrets → **Production**

- **Secret**: `OPENAI_API_KEY`
  - **Name**: строго `OPENAI_API_KEY`
  - **Value**: только значение ключа `sk-...` / `sk-proj-...` (без `OPENAI_API_KEY=`, без кавычек)

### Для НейроВалюши в соцсетях (VK / Telegram)

Добавить Secrets (Production):

- **VK**
  - `VK_GROUP_ID`
  - `VK_SECRET` (secret key из Callback API)
  - `VK_CONFIRMATION_CODE` (confirmation string из Callback API)
  - `VK_ACCESS_TOKEN` (токен сообщества с правами на `wall`)
- **Telegram**
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_WEBHOOK_SECRET` (сверяем с заголовком `X-Telegram-Bot-Api-Secret-Token`)
  - `TELEGRAM_CHANNEL_ID` (опционально, чтобы отвечать только на посты конкретного канала)

Для “памяти 10 сообщений” и дедупликации рекомендуется KV биндинг `NEUROVALYUSHA_KV` (см. `cf-api/NEUROVALYUSHA_SETUP.md`).

## Деплой API в Cloudflare (текущий способ — upload)

1) Локально собрать API (в репозитории API):

```bash
npm ci
npm run build
```

2) Убедиться, что появилась папка `dist/` и в ней есть минимум:
   - `dist/_worker.js`
   - `dist/_routes.json`

3) Cloudflare Dashboard → Workers & Pages → `real-vibe-ai-studio` → Deployments → **Create deployment**
   - Environment: **Production**
   - Upload: выбрать **папку `dist`**
   - Save and deploy

4) Проверка:
   - `GET https://real-vibe-ai-studio.pages.dev/health` → `{ "ok": true, "hasOpenAIKey": true }`

### Быстрый тест API (PowerShell)

```powershell
$body = @{ message = "PING123" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://real-vibe-ai-studio.pages.dev/api/chat" -Method Post -ContentType "application/json" -Body $body
```

## Подключение/обновление фронта на NIC.RU

### 1) API base (главное)

Фронт использует:
- `window.__AI_API_BASE__ = 'https://real-vibe-ai-studio.pages.dev'`

Это задаётся в `js/script.js`.

### 2) Service Worker кэш

Чтобы обновления JS не “залипали”, **нужно bump-ать**:
- `CACHE_VERSION` в `sw.js`

### 3) Прод-сборка для NIC.RU

```powershell
.\prepare-deploy.ps1
```

Далее загружать на NIC.RU **файлы из `deploy-ready/`** (в те же пути на сервере).

Минимальный набор при изменении API/чата:
- `deploy-ready/sw.js`
- `deploy-ready/js/script.js`
- `deploy-ready/js/chat.js`
- `deploy-ready/js/glass-ui-bro-cat.js`
- `deploy-ready/js/glass-ui-hipych.js`
- `deploy-ready/js/glass-ui-valyusha.js`

### 4) Быстрая проверка, что NIC.RU обновился

- `https://real-vibe.studio/sw.js` содержит новую `CACHE_VERSION`
- `https://real-vibe.studio/js/script.js` содержит строку `__AI_API_BASE__`

Если у пользователя всё ещё старое — попросить сделать:
- Ctrl+F5
- DevTools → Application → Service Workers → Unregister → Reload

## Как добавить нового бота (шаблон)

### A) На стороне API (Cloudflare)

1) Добавить SYSTEM prompt (личность) в `src/index.tsx`, например:
   - `const MY_BOT_SYSTEM = ...`

2) Добавить fallback функцию (короткий безопасный ответ), например:
   - `function getMyBotFallbackResponse(): string { ... }`

3) Добавить роут:

```ts
app.post('/api/mybot/chat', async (c) => handleBotChat(c, MY_BOT_SYSTEM, getMyBotFallbackResponse))
```

4) Если новый фронтенд/домен — добавить домен в CORS allowlist (`allowExact` в `isAllowedOrigin()`).

5) Пересобрать и задеплоить (см. “Деплой API в Cloudflare”).

### B) На стороне фронта (NIC.RU)

В JS чата новый бот должен дергать:
- `${window.__AI_API_BASE__}/api/mybot/chat`

Обязательное:
- отправлять JSON `{ message: "..." }`
- принимать `{ reply, response }` (использовать `reply || response`)

После изменений:
- bump `CACHE_VERSION` в `sw.js`
- `prepare-deploy.ps1`
- залить на NIC.RU

## Типовые проблемы и решения

### 1) `/health` → `hasOpenAIKey:false`
- Переменная названа не так (например `OPENAI_API_KEY 2`) или задана не в Production.
- Должно быть **ровно** `OPENAI_API_KEY` (Name).

### 2) Бот отвечает “как раньше” (fallback), хотя ключ есть
- Проверить OpenAI ошибку через временный debug-режим (если включён на API): `?debug=1`
- Часто причины: 401 (не тот ключ), 429 (лимит/биллинг), нет доступа к модели.

### 3) Ошибка CORS в браузере
- Добавить домен фронта в `isAllowedOrigin()` на API.
- Проверить, что `OPTIONS` на эндпоинт отдаёт `Access-Control-Allow-Origin: https://real-vibe.studio`.

### 4) NIC.RU “не обновляется”
- Service Worker держит старый кэш → bump `CACHE_VERSION` + Unregister SW.

## Правила безопасности (важно)

- Никогда не класть OpenAI ключи во фронтенд.
- В Cloudflare хранить ключ как **Secret**, а не Plaintext.
- Не вставлять ключи/токены в чаты/issue/логи.


