# 🔒 Исправления безопасности для проекта

## 🚨 КРИТИЧНЫЕ исправления

### 1. Обновление уязвимых пакетов
```bash
# Обновляем OpenAI SDK до последней версии
npm install openai@latest

# Или если нужна старая версия:
npm audit fix --force
```

### 2. Настройка CORS
```javascript
// В server.js заменить:
app.use(cors());

// На:
app.use(cors({
  origin: ['http://localhost:3001', 'https://yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

### 3. Добавление rate limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 20, // максимум 20 запросов с одного IP
  message: { error: 'Слишком много запросов, попробуйте позже' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Применяем к chat endpoint'ам
app.use('/chat', chatLimiter);
app.use('/api/chat', chatLimiter);
```

## ⚠️ СРЕДНИЕ исправления

### 4. Санитизация HTML
```bash
npm install dompurify
```

```javascript
const DOMPurify = require('dompurify');

// Вместо innerHTML используем:
function safeHTML(content) {
  return DOMPurify.sanitize(content);
}

// Заменить все innerHTML на:
element.innerHTML = safeHTML(userContent);
```

### 5. Добавление helmet для заголовков безопасности
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### 6. Валидация входящих данных
```bash
npm install joi
```

```javascript
const Joi = require('joi');

const messageSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required(),
  userId: Joi.string().optional(),
  context: Joi.object().optional()
});

// В каждом endpoint:
app.post('/chat', async (req, res) => {
  const { error, value } = messageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Неверный формат данных' });
  }
  // ... остальной код
});
```

## 🔧 ДОПОЛНИТЕЛЬНЫЕ улучшения

### 7. Логирование и мониторинг
```bash
npm install winston express-winston
```

### 8. HTTPS в продакшене
```javascript
// Для продакшена:
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 9. Переменные окружения для продакшена
```bash
# .env.production
NODE_ENV=production
OPENAI_API_KEY=your_real_key_here
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SESSION_SECRET=random_secret_key_here
```

## 📋 Чек-лист исправлений

- [ ] Обновить пакеты (npm audit fix)
- [ ] Настроить CORS
- [ ] Добавить rate limiting
- [ ] Установить helmet
- [ ] Добавить валидацию данных
- [ ] Заменить innerHTML на безопасные альтернативы
- [ ] Настроить CSP заголовки
- [ ] Добавить логирование
- [ ] Настроить HTTPS редирект
- [ ] Создать .env.production

## 🎯 Приоритеты

1. **Сначала**: Обновить пакеты, настроить CORS
2. **Потом**: Rate limiting, helmet, валидация
3. **В конце**: Логирование, мониторинг, дополнительные улучшения 