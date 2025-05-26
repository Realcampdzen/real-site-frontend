# 🔗 Руководство по интеграции внешних ботов

## Обзор

Система использует **API Proxy** архитектуру для интеграции ваших внешних ботов (VK, Telegram, RAG + Supabase) с основным сайтом AI Studio.

## 📋 Что нужно настроить

### 1. В вашем втором проекте (где ваши боты)

Добавьте следующие API endpoints в ваш проект:

```javascript
// В вашем втором проекте (например, app.js или server.js)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🩺 Медицинский ассистент
app.post('/api/external/health-assistant', async (req, res) => {
  try {
    const { message, userId, source } = req.body;
    
    console.log(`📋 Медицинский бот получил: ${message} от ${userId}`);
    
    // Здесь ваша логика медицинского бота
    // Например, RAG поиск по медицинским документам
    const response = await yourHealthBot.process({
      message,
      userId,
      context: 'medical_analysis'
    });
    
    res.json({ 
      reply: response,
      botId: 'health-assistant',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ошибка медицинского бота:', error);
    res.status(500).json({ error: 'Медицинский бот временно недоступен' });
  }
});

// 📈 Бизнес-консультант 
app.post('/api/external/business-advisor', async (req, res) => {
  try {
    const { message, userId, source } = req.body;
    
    console.log(`💼 Бизнес-бот получил: ${message} от ${userId}`);
    
    // Логика бизнес-консультанта
    const response = await yourBusinessBot.process({
      message,
      userId,
      context: 'business_consulting'
    });
    
    res.json({ 
      reply: response,
      botId: 'business-advisor',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ошибка бизнес-бота:', error);
    res.status(500).json({ error: 'Бизнес-консультант временно недоступен' });
  }
});

// 🎧 Техподдержка
app.post('/api/external/support-agent', async (req, res) => {
  try {
    const { message, userId, source } = req.body;
    
    console.log(`🔧 Техподдержка получила: ${message} от ${userId}`);
    
    // Логика техподдержки
    const response = await yourSupportBot.process({
      message,
      userId,
      context: 'technical_support'
    });
    
    res.json({ 
      reply: response,
      botId: 'support-agent',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ошибка техподдержки:', error);
    res.status(500).json({ error: 'Техподдержка временно недоступна' });
  }
});

// ✍️ Контент-мейкер
app.post('/api/external/content-creator', async (req, res) => {
  try {
    const { message, userId, source } = req.body;
    
    console.log(`📝 Контент-бот получил: ${message} от ${userId}`);
    
    // Логика создания контента
    const response = await yourContentBot.process({
      message,
      userId,
      context: 'content_creation'
    });
    
    res.json({ 
      reply: response,
      botId: 'content-creator',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ошибка контент-бота:', error);
    res.status(500).json({ error: 'Контент-мейкер временно недоступен' });
  }
});

// Health check endpoints
app.get('/api/external/health-assistant/health', (req, res) => {
  res.json({ status: 'ok', bot: 'health-assistant' });
});

app.get('/api/external/business-advisor/health', (req, res) => {
  res.json({ status: 'ok', bot: 'business-advisor' });
});

app.get('/api/external/support-agent/health', (req, res) => {
  res.json({ status: 'ok', bot: 'support-agent' });
});

app.get('/api/external/content-creator/health', (req, res) => {
  res.json({ status: 'ok', bot: 'content-creator' });
});

app.listen(3002, () => {
  console.log('🤖 Боты сервер запущен на http://localhost:3002');
});
```

### 2. В основном проекте (AI Studio)

Уже настроено! Обновите `.env` файл:

```bash
# Скопируйте env.example в .env
cp env.example .env

# Отредактируйте .env файл
OPENAI_API_KEY=your_openai_api_key_here
HEALTH_BOT_URL=http://localhost:3002/api/external/health-assistant
BUSINESS_BOT_URL=http://localhost:3002/api/external/business-advisor
SUPPORT_BOT_URL=http://localhost:3002/api/external/support-agent
CONTENT_BOT_URL=http://localhost:3002/api/external/content-creator
```

## 🚀 Запуск

### Локальная разработка:

1. **Запустите ваш проект с ботами:**
```bash
cd /path/to/your/bots/project
npm start
# Должен работать на localhost:3002
```

2. **Запустите AI Studio API:**
```bash
cd /path/to/ai-studio
node server.js
# Работает на localhost:3001
```

3. **Запустите фронтенд AI Studio:**
```bash
cd /path/to/ai-studio
python -m http.server 8005
# Работает на localhost:8005
```

### Проверка интеграции:

Откройте http://localhost:8005, перейдите в секцию "Ассистенты" и попробуйте любого бота.

## 🔧 Как это работает

1. **Пользователь** нажимает "Попробовать" на карточке ассистента
2. **Фронтенд** отправляет запрос к `/api/chat/health-assistant`
3. **AI Studio API** пытается переслать запрос к вашему боту
4. **Ваш бот** обрабатывает запрос и возвращает ответ
5. **Если бот недоступен** - включается fallback на OpenAI

## 📊 Мониторинг

- **Статус ботов**: GET `/api/bots/status`
- **Health check**: GET `/health`
- **Логи**: смотрите консоль обоих серверов

## ⚙️ Продвинутая настройка

### Добавление аутентификации:

```javascript
// В ваших endpoints добавьте проверку токена
app.post('/api/external/health-assistant', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (token !== process.env.EXPECTED_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // ... остальная логика
});
```

### Интеграция с существующими ботами:

```javascript
// Если у вас уже есть Telegram/VK боты
app.post('/api/external/health-assistant', async (req, res) => {
  const { message, userId } = req.body;
  
  // Переиспользуйте логику существующих ботов
  const response = await existingTelegramBot.handleMessage(message, userId);
  
  res.json({ reply: response });
});
```

## 🌐 Деплой в продакшн

Для продакшна обновите URL'ы в `.env`:

```bash
HEALTH_BOT_URL=https://your-bots-server.herokuapp.com/api/external/health-assistant
BUSINESS_BOT_URL=https://your-bots-server.herokuapp.com/api/external/business-advisor
# и т.д.
```

## 🔍 Отладка

1. **Проверьте логи** обоих серверов
2. **Тестируйте endpoints** напрямую:
```bash
curl -X POST http://localhost:3002/api/external/health-assistant \
  -H "Content-Type: application/json" \
  -d '{"message": "Тест", "userId": "test_user"}'
```

3. **Проверьте статус**:
```bash
curl http://localhost:3001/api/bots/status
```

## 💡 Полезные советы

- Всегда возвращайте ответы в формате `{ reply: "текст ответа" }`
- Добавляйте логирование для отладки
- Используйте health check endpoints для мониторинга
- Fallback на OpenAI работает автоматически если ваш бот недоступен

---

**🎯 Готово!** Теперь ваши боты интегрированы с AI Studio через API Proxy. 