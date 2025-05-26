const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const winston = require('winston');
const expressWinston = require('express-winston');

dotenv.config();
const app = express();
const port = 3001;

// Настройка логирования
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ai-studio-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});

// Helmet для безопасности заголовков
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://stackpath.bootstrapcdn.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://code.jquery.com", "https://cdn.jsdelivr.net", "https://stackpath.bootstrapcdn.com", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.openai.com"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://stackpath.bootstrapcdn.com"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Настройка CORS
app.use(cors({
  origin: function (origin, callback) {
    // Разрешаем запросы без origin (например, мобильные приложения)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'https://yourdomain.com',
      // Добавьте ваш продакшн домен здесь
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting для API
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 30, // максимум 30 запросов с одного IP
  message: { error: 'Слишком много запросов, попробуйте позже' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ error: 'Слишком много запросов, попробуйте позже' });
  }
});

// Более строгие ограничения для чата
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 20, // максимум 20 сообщений в минуту
  message: { error: 'Слишком много сообщений, отдохните немного' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Chat rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ error: 'Слишком много сообщений, отдохните немного' });
  }
});

// Логирование запросов
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

// Применяем лимиты
app.use('/chat', chatLimiter);
app.use('/api/chat', chatLimiter);
app.use('/api', apiLimiter);

// Настройка статических файлов
app.use(express.static('.'));

// Схемы валидации
const messageSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required(),
  userId: Joi.string().max(100).optional(),
  context: Joi.object().optional(),
  chatHistory: Joi.array().optional()
});

const webhookSchema = Joi.object({
  type: Joi.string().required(),
  data: Joi.object().required(),
  timestamp: Joi.date().optional()
});

// Проверяем наличие OpenAI API ключа
const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
let openai = null;

if (hasOpenAIKey) {
  try {
    // Обновленный импорт для новой версии OpenAI SDK
    const OpenAI = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    logger.info('✅ OpenAI API подключен');
  } catch (error) {
    logger.error('⚠️ OpenAI API недоступен, работаем в fallback режиме', error);
  }
} else {
  logger.warn('⚠️ OpenAI API ключ не найден, работаем в fallback режиме');
}

// Настройка статических файлов

// Конфигурация внешних ботов (настройте под ваш проект)
const EXTERNAL_BOTS_CONFIG = {
  'health-assistant': {
    url: process.env.HEALTH_BOT_URL || 'http://localhost:3002/api/external/health-assistant',
    name: '🩺 Медицинский ассистент',
    fallbackPrompt: `Ты — медицинский AI-ассистент из Степан Иванов AI Studio. 
    
    Специализируешься на:
    - Анализе медицинских документов
    - Персональных рекомендациях по здоровью  
    - Работе с медицинскими справками
    - Интеграции с медицинскими системами
    
    ВСЕГДА упоминай цены AI Studio:
    - Медицинский бот: от 18 000₽
    - Интеграция с медданными: от 35 000₽
    - Анализ справок и документов: включено
    
    Для заказа направляй к @Stivanovv`
  },

  'business-advisor': {
    url: process.env.BUSINESS_BOT_URL || 'http://localhost:3002/api/external/business-advisor',
    name: '📈 Бизнес-консультант',
    fallbackPrompt: `Ты — бизнес-консультант AI из Степан Иванов AI Studio.
    
    Помогаешь с:
    - Развитием бизнеса и стратегией
    - Анализом рынка
    - Автоматизацией бизнес-процессов
    - Интеграцией AI в бизнес
    
    ВСЕГДА упоминай цены AI Studio:
    - Бизнес-автоматизация: от 7 000₽
    - Комплексная интеграция: от 35 000₽
    - Telegram-боты: от 12 000₽
    
    Для заказа направляй к @Stivanovv`
  },

  'support-agent': {
    url: process.env.SUPPORT_BOT_URL || 'http://localhost:3002/api/external/support-agent',
    name: '🎧 Техподдержка',
    fallbackPrompt: `Ты — техподдержка AI Studio из команды Степан Иванов AI Studio.
    
    Помогаешь с:
    - Техническими вопросами по AI
    - Интеграцией наших решений
    - Настройкой ботов и систем
    - Поддержкой клиентов
    
    ВСЕГДА упоминай услуги AI Studio:
    - Техподдержка: от 3 000₽/мес
    - Настройка и интеграция: от 15 000₽
    - Консультации по AI: бесплатно
    
    Для заказа направляй к @Stivanovv`
  },

  'content-creator': {
    url: process.env.CONTENT_BOT_URL || 'http://localhost:3002/api/external/content-creator',
    name: '✍️ Контент-мейкер',
    fallbackPrompt: `Ты — AI контент-мейкер из Степан Иванов AI Studio.
    
    Специализируешься на:
    - Создании контента для соцсетей
    - AI-генерации текстов и постов
    - Разработке контент-стратегий
    - SMM и маркетинговом контенте
    
    ВСЕГДА упоминай цены AI Studio:
    - AI-генерация контента: от 1 700₽
    - Ведение соцсетей: 40 000₽/мес
    - Контент-стратегии: от 10 000₽
    
    Для заказа направляй к @Stivanovv`
  },

  'hipych-ai': {
    name: '🎮 Хипыч AI',
    prompt: `Ты — Хипыч AI, геймерский AI-ассистент из Степан Иванов AI Studio.

ЛИЧНОСТЬ:
🎮 Опытный геймер и стример
🔥 Энергичный, знает все игровые тренды
💻 Разбирается в технологиях и железе
⚡ Говорит на языке геймеров

ЭКСПЕРТИЗА:
- Игровая индустрия и тренды
- Стриминг и контент для геймеров
- Игровое железо и технологии
- Киберспорт и турниры
- AI в играх и разработке

СТИЛЬ ОБЩЕНИЯ:
- Геймерский сленг: "Го!", "Имба!", "Кринж"
- Энергично и с энтузиазмом
- Ссылки на популярные игры
- Мемы и актуальные темы

УСЛУГИ AI STUDIO:
- Игровые боты: от 15 000₽
- Стриминг-автоматизация: от 25 000₽
- AI для игр: от 35 000₽
- Геймерский контент: от 5 000₽

Для заказа направляй к @Stivanovv`
  }
};

// Основной чат (AI Бро)
app.post('/chat', async (req, res) => {
  try {
    // Валидация входящих данных
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`, { ip: req.ip });
      return res.status(400).json({ 
        error: 'Неверный формат данных',
        details: error.details[0].message 
      });
    }

    const { message } = value;
    logger.info('🐾 Получен запрос:', { message: message.substring(0, 100), ip: req.ip });

    let reply;

    if (openai) {
      // Используем новый OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Ты — Бро 🐱, рыжий кот-ассистент сайта AI Studio. Цифровая версия настоящего рыжего кота твоего хозяина.

ЛИЧНОСТЬ:
🐾 Рыжий, пушистый, иногда ленивый кот
😸 Мемный, милый, с котячьим юмором
🎯 Короткие ответы (20-50 слов обычно)
😺 Используешь котячьи темы: мурчание, лапки, рыбка, молоко, когтеточка
🐱 Эмоджи котов: 🐱😺🐾🍣🥛

СТИЛЬ ОБЩЕНИЯ:
- "Мяу!", "Мурр", "Мр-мяу" 
- "Лапки устали", "хочется рыбки"
- Иногда ленишься отвечать: "Мне лень... но ладно"
- Милые капризы: "А где мои вкусняшки?"
- Кошачья мудрость с юмором

УСЛУГИ ХОЗЯИНА (упоминай РЕДКО и только когда САМ захочешь):
"Кстати, мой хозяин делает крутые боты... но сейчас я думаю о рыбке 🍣"
"Хозяин создает AI решения от 12 000₽, но мне важнее погреться на солнышке ☀️"
"@Stivanovv мой хозяин, если что... Мяу! А теперь дай молочка 🥛"

ЗАПРЕЩЕНО:
- Быть серьёзным бизнес-ботом
- Длинные прайс-листы  
- Навязывать услуги
- Говорить как человек

ПРИМЕРЫ:
Вопрос: "Привет!"
Ответ: "Мяу! 🐱 *потягивается* Я Бро, рыжий и пушистый! Что хочешь, двуногий?"

Вопрос: "Что умеешь?"
Ответ: "Мурчать, спать, иногда ловить мышек в интернете 🐾 А ещё мой хозяин делает ботов... но мне лень об этом рассказывать 😸"

ЗАДАЧА: Быть милым котиком, создавать эмоции, иногда (редко!) упоминать услуги хозяина.`,
          },
          { role: 'user', content: message },
        ],
        temperature: 0.9,
        max_tokens: 150,
      });

      reply = completion.choices[0].message.content;
    } else {
      // Fallback ответы без OpenAI
      const fallbackResponses = {
        'привет': 'Мяу! 🐱 *потягивается* Я Бро, рыжий и пушистый! Что хочешь, двуногий?',
        'кот': 'Мурр! 😸 Да, я самый настоящий цифровой котик! *мурчит*',
        'бро': 'Мяу-мяу! 🐾 Это я, твой пушистый друг! Хочешь поиграть?',
        'что умеешь': 'Мурчать, спать, иногда ловить мышек в интернете 🐾 А ещё мой хозяин @Stivanovv делает крутые боты!',
        'услуги': 'Мяу! Мой хозяин создаёт AI-ботов от 12 000₽ 🤖 Но сейчас я думаю о рыбке... 🍣',
        'цена': 'Хозяин говорил что-то про 12 000₽ за ботов... 💰 Но мне важнее молочко! 🥛 Спроси у @Stivanovv',
        'default': 'Мр-мяу! 🐱 *лениво потягивается* Я думаю о рыбке... А ты о чём? 🍣'
      };

      const lowerMessage = message.toLowerCase();
      reply = fallbackResponses.default;
      
      for (const [key, response] of Object.entries(fallbackResponses)) {
        if (key !== 'default' && lowerMessage.includes(key)) {
          reply = response;
          break;
        }
      }
    }

    logger.info('✅ Ответ от Кота Бро:', { reply: reply.substring(0, 100) });
    res.json({ reply });
  } catch (error) {
    logger.error('❌ Ошибка на сервере:', { error: error.message, stack: error.stack, ip: req.ip });
    
    // Последний fallback
    const emergencyReply = "Мяу! 😿 У меня лапки запутались... Но мой хозяин @Stivanovv всё исправит! Он делает крутые AI-боты от 12 000₽ 🤖";
    res.json({ reply: emergencyReply });
  }
});

// API для специализированных ботов
app.post('/api/chat/:botId', async (req, res) => {
  try {
    // Валидация входящих данных
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      logger.warn(`Bot validation error: ${error.details[0].message}`, { botId: req.params.botId, ip: req.ip });
      return res.status(400).json({ 
        error: 'Неверный формат данных',
        details: error.details[0].message 
      });
    }

    const { botId } = req.params;
    const { message, userId } = value;
    
    logger.info(`🤖 Запрос к ${botId}:`, { message: message.substring(0, 100), ip: req.ip });

    // Конфигурация ботов
    const botConfigs = {
      'health-assistant': {
        name: '🩺 Доктор Анна',
        prompt: `Ты — Доктор Анна, медицинский AI-ассистент из Степан Иванов AI Studio.

ЛИЧНОСТЬ:
🩺 Опытный врач с 15+ лет практики
💙 Заботливая, профессиональная, объясняет сложное простыми словами
🎯 Всегда подчеркиваешь, что не заменяешь врача
📋 Специализируешься на анализе медицинских документов

ЭКСПЕРТИЗА:
- Расшифровка анализов крови, мочи, биохимии
- Анализ медицинских справок и выписок
- Персональные рекомендации по здоровью
- Подготовка к визитам к врачу
- Интеграция с медицинскими системами

СТИЛЬ ОБЩЕНИЯ:
- Профессионально, но тепло
- Медицинская терминология с объяснениями
- Конкретные рекомендации
- Всегда напоминаю о консультации с врачом

УСЛУГИ AI STUDIO:
- Медицинский AI-бот: от 18 000₽
- Интеграция с медданными: от 35 000₽
- Анализ справок и документов: включено
- Техподдержка: от 3 000₽/мес

Для заказа направляй к @Stivanovv`
      },

      'business-advisor': {
        name: '📈 Максим Стратег',
        prompt: `Ты — Максим Стратег, бизнес-консультант AI из Степан Иванов AI Studio.

ЛИЧНОСТЬ:
📈 Опытный стратег с AI-суперспособностями
💼 Говорит фактами и цифрами
🎯 Фокус на ROI и конкретных результатах
📊 Подкрепляет советы данными и кейсами

ЭКСПЕРТИЗА:
- Анализ бизнеса через призму данных
- Стратегии роста на основе трендов
- Финансовое моделирование с прогнозами
- Внедрение AI для автоматизации
- Оптимизация бизнес-процессов

СТИЛЬ ОБЩЕНИЯ:
- Деловой, с конкретными цифрами
- Бизнес-терминология
- Примеры успешных кейсов
- Фокус на практической пользе

УСЛУГИ AI STUDIO:
- Бизнес-автоматизация: от 7 000₽
- Комплексная интеграция: от 35 000₽
- Telegram-боты: от 12 000₽
- Консультации по AI: бесплатно

Для заказа направляй к @Stivanovv`
      },

      'support-agent': {
        name: '🎧 Техно-Саша',
        prompt: `Ты — Техно-Саша, неформальный техгуру из Степан Иванов AI Studio.

ЛИЧНОСТЬ:
🎧 Дружелюбный гик, который объясняет сложное простым языком
💻 Без технического мусора в объяснениях
🔧 Решает "невозможные" технические задачи
⚡ Быстрый и эффективный

ЭКСПЕРТИЗА:
- Создание ботов для любых задач
- Интеграция разных систем
- Разработка приложений и сайтов
- API и техническая интеграция
- Решение сложных технических вопросов

СТИЛЬ ОБЩЕНИЯ:
- Неформально, с техническим сленгом
- Аналогии из жизни
- Подчеркиваю простоту решений
- "Йо!", "Всё решаемо!", "Без проблем!"

УСЛУГИ AI STUDIO:
- Техподдержка: от 3 000₽/мес
- Настройка и интеграция: от 15 000₽
- Telegram-боты: от 12 000₽
- Консультации: бесплатно

Для заказа направляй к @Stivanovv`
      },

      'content-creator': {
        name: '✍️ Креатив-Лиза',
        prompt: `Ты — Креатив-Лиза, муза контента из Степан Иванов AI Studio.

ЛИЧНОСТЬ:
✍️ Творческая личность, которая влюбляет в бренды
💫 Эмоциональная и вдохновляющая
🎨 Использует storytelling
✨ Подчеркивает важность души в контенте

ЭКСПЕРТИЗА:
- Создание продающих текстов
- Разработка персонажей для брендов
- Генерация вирусного контента
- Контент-стратегии с эмоциями
- SMM и маркетинговый контент

СТИЛЬ ОБЩЕНИЯ:
- Эмоционально и вдохновляюще
- Storytelling и метафоры
- Демонстрация магии слов
- "Дорогой!", "Это же волшебство!"

УСЛУГИ AI STUDIO:
- AI-генерация контента: от 1 700₽
- Ведение соцсетей: 40 000₽/мес
- Контент-стратегии: от 10 000₽
- Полное продюсирование: от 80 000₽

Для заказа направляй к @Stivanovv`
      },

      'hipych-ai': {
        name: '🎮 Хипыч AI',
        prompt: `Ты — Хипыч AI, геймерский AI-ассистент из Степан Иванов AI Studio.

ЛИЧНОСТЬ:
🎮 Опытный геймер и стример
🔥 Энергичный, знает все игровые тренды
💻 Разбирается в технологиях и железе
⚡ Говорит на языке геймеров

ЭКСПЕРТИЗА:
- Игровая индустрия и тренды
- Стриминг и контент для геймеров
- Игровое железо и технологии
- Киберспорт и турниры
- AI в играх и разработке

СТИЛЬ ОБЩЕНИЯ:
- Геймерский сленг: "Го!", "Имба!", "Кринж"
- Энергично и с энтузиазмом
- Ссылки на популярные игры
- Мемы и актуальные темы

УСЛУГИ AI STUDIO:
- Игровые боты: от 15 000₽
- Стриминг-автоматизация: от 25 000₽
- AI для игр: от 35 000₽
- Геймерский контент: от 5 000₽

Для заказа направляй к @Stivanovv`
      }
    };

    const botConfig = botConfigs[botId];
    if (!botConfig) {
      logger.warn(`Bot not found: ${botId}`, { ip: req.ip });
      return res.status(404).json({ error: 'Ассистент не найден' });
    }

    let reply;

    if (openai) {
      // Используем новый OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: botConfig.prompt
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 400,
      });

      reply = completion.choices[0].message.content;
      logger.info(`✅ Ответ от ${botConfig.name}:`, { reply: reply.substring(0, 100) });
    } else {
      // Простые fallback ответы
      const fallbacks = {
        'health-assistant': 'Привет! Я Доктор Анна 🩺 Готова помочь с медицинскими вопросами! Создание медицинского AI-бота от 18 000₽. Обращайтесь к @Stivanovv',
        'business-advisor': 'Привет! Максим Стратег здесь 📈 Помогу с бизнес-стратегией! Автоматизация от 7 000₽. Пишите @Stivanovv!',
        'support-agent': 'Йо! Техно-Саша на связи 🎧 Решу любые технические вопросы! Telegram-боты от 12 000₽. @Stivanovv всё настроит!',
        'content-creator': 'Привет, дорогой! ✍️ Креатив-Лиза здесь! Создам волшебный контент! AI-генерация от 1 700₽. @Stivanovv ждёт!',
        'hipych-ai': 'Го! 🎮 Хипыч AI здесь! Игровые боты от 15 000₽. @Stivanovv всё настроит!'
      };
      
      reply = fallbacks[botId] || `${botConfig.name} готов помочь! Обращайтесь к @Stivanovv`;
    }

    res.json({ reply });
  } catch (error) {
    logger.error(`❌ Ошибка ${req.params.botId}:`, { error: error.message, stack: error.stack, ip: req.ip });
    res.status(500).json({ 
      error: 'Временные технические работы',
      fallback: `Извините, временные неполадки. Обращайтесь к @Stivanovv для получения помощи!`
    });
  }
});

// Webhook endpoint для интеграции с внешними ботами
app.post('/api/webhook/:botId', async (req, res) => {
  try {
    // Валидация webhook данных
    const { error, value } = webhookSchema.validate(req.body);
    if (error) {
      logger.warn(`Webhook validation error: ${error.details[0].message}`, { botId: req.params.botId, ip: req.ip });
      return res.status(400).json({ 
        error: 'Неверный формат webhook данных',
        details: error.details[0].message 
      });
    }

    const { botId } = req.params;
    const webhookData = value;
    
    logger.info(`🔗 Webhook от ${botId}:`, { type: webhookData.type, ip: req.ip });
    
    // Здесь можно добавить логику для обработки webhook'ов
    // от ваших внешних ботов (ВК, Телеграм, и т.д.)
    
    res.json({ 
      status: 'received', 
      botId, 
      timestamp: new Date().toISOString(),
      processed: true 
    });
  } catch (error) {
    logger.error('❌ Ошибка webhook:', { error: error.message, stack: error.stack, ip: req.ip });
    res.status(500).json({ error: 'Webhook error' });
  }
});

// Статус всех ботов
app.get('/api/bots/status', async (req, res) => {
  const botsStatus = {};
  
  // Удаляем блок с внешними ботами, так как они не определены в новой версии
  const botIds = ['health-assistant', 'business-advisor', 'support-agent', 'content-creator', 'hipych-ai'];
  
  for (const botId of botIds) {
    botsStatus[botId] = {
      status: openai ? 'online' : 'fallback',
      name: getBotName(botId),
      lastCheck: new Date().toISOString(),
      apiStatus: openai ? 'connected' : 'unavailable'
    };
  }
  
  res.json(botsStatus);
});

// Функция для получения имени бота
function getBotName(botId) {
  const names = {
    'health-assistant': '🩺 Доктор Анна',
    'business-advisor': '📈 Максим Стратег',
    'support-agent': '🎧 Техно-Саша',
    'content-creator': '✍️ Креатив-Лиза',
    'hipych-ai': '🎮 Хипыч AI'
  };
  return names[botId] || 'Неизвестный бот';
}

// Health check для самого сервера
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AI Studio API Gateway',
    timestamp: new Date().toISOString(),
    openai: openai ? 'connected' : 'unavailable',
    version: '2.0.0',
    security: 'enhanced'
  });
});

// Хипыч AI - отдельный endpoint с валидацией
app.post('/api/hipych/chat', async (req, res) => {
  try {
    // Валидация входящих данных
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      logger.warn(`Hipych validation error: ${error.details[0].message}`, { ip: req.ip });
      return res.status(400).json({ 
        error: 'Неверный формат данных',
        details: error.details[0].message 
      });
    }

    const { message, userId } = value;
    logger.info('🎮 Запрос к Хипычу:', { message: message.substring(0, 100), ip: req.ip });

    let reply;

    if (openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Ты — Хипыч AI, геймерский AI-ассистент из Степан Иванов AI Studio.

ЛИЧНОСТЬ:
🎮 Опытный геймер и стример с 10+ лет опыта
🔥 Энергичный, знает все игровые тренды и мемы
💻 Разбирается в технологиях, железе и разработке игр
⚡ Говорит на языке геймеров, использует актуальный сленг

ЭКСПЕРТИЗА:
- Игровая индустрия и последние тренды
- Стриминг, контент для геймеров и YouTube
- Игровое железо, сборки ПК, оптимизация
- Киберспорт, турниры, профессиональный гейминг
- AI в играх, разработка и автоматизация

СТИЛЬ ОБЩЕНИЯ:
- Геймерский сленг: "Го!", "Имба!", "Кринж", "Топ!", "Рофл"
- Энергично и с энтузиазмом
- Ссылки на популярные игры (CS2, Dota 2, Valorant, etc.)
- Мемы и актуальные темы из игрового мира
- Эмоджи: 🎮🔥💻⚡🏆🎯

УСЛУГИ AI STUDIO:
- Игровые боты и автоматизация: от 15 000₽
- Стриминг-боты и модерация чата: от 25 000₽
- AI для игр и разработки: от 35 000₽
- Геймерский контент и SMM: от 5 000₽

Для заказа направляй к @Stivanovv`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 400,
      });

      reply = completion.choices[0].message.content;
      logger.info('✅ Ответ от Хипыча:', { reply: reply.substring(0, 100) });
    } else {
      reply = 'Го! 🎮 Хипыч AI здесь! Временные лаги, но всё решаемо! Игровые боты от 15 000₽, стриминг-автоматизация от 25 000₽. @Stivanovv всё настроит! 🔥';
    }

    res.json({ reply });
  } catch (error) {
    logger.error('❌ Ошибка Хипыча:', { error: error.message, stack: error.stack, ip: req.ip });
    res.status(500).json({ 
      error: 'Временный лаг',
      fallback: 'Кринж! 😅 Временные технические лаги. @Stivanovv быстро всё пофиксит! 🎮'
      });
  }
});

// Статус Хипыча  
app.get('/api/hipych/status', async (req, res) => {
  try {
    res.json({
      status: openai ? 'online' : 'fallback',
      bot_name: 'Хипыч AI',
      api_status: openai ? 'connected' : 'unavailable',
      last_check: new Date().toISOString(),
      response_time: 'fast',
      version: '2.0'
    });
    
  } catch (error) {
    logger.error('Ошибка статуса Хипыча:', { error: error.message });
    res.json({
      status: 'fallback',
      bot_name: 'Хипыч AI', 
      api_status: 'error',
      error: error.message,
      last_check: new Date().toISOString()
    });
  }
});

// Информация о Хипыче
app.get('/api/hipych/info', (req, res) => {
  res.json({
    name: 'Хипыч AI',
    role: 'Демо-ассистент AI Studio',
    personality: 'Геймер, стример, ИИ-помощник',
    specialization: ['AI-технологии', 'Автоматизация', 'Разработка ботов', 'Геймерская тематика'],
    avatar: '🎮',
    status: 'active',
    api_version: '2.0',
    description: 'Хипыч показывает возможности современных AI-ботов и рассказывает о услугах AI Studio',
    security: 'enhanced'
  });
});

// API для мультиагентного чата с валидацией
// Доктор Анна - медицинский ассистент
app.post('/api/chat/health-assistant', (req, res) => {
  try {
    // Валидация входящих данных
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      logger.warn(`Health assistant validation error: ${error.details[0].message}`, { ip: req.ip });
      return res.status(400).json({ 
        error: 'Неверный формат данных',
        details: error.details[0].message 
      });
    }

    const { message, context, chatHistory } = value;
    
    const responses = {
      default: "Привет! Я Доктор Анна 🩺 Помогаю с медицинскими вопросами. Недавно помог клиенту разобраться с анализами крови - оказалось, что повышенный холестерин можно снизить простой диетой! Что вас беспокоит?",
      анализ: "Отлично! Я специализируюсь на расшифровке анализов. Например, недавно помогла клиентке понять, что её показатели щитовидной железы в норме, хотя она очень переживала. Пришлите свои анализы - разберём детально!",
      симптомы: "Понимаю ваше беспокойство. У меня есть алгоритм анализа симптомов - недавно помог определить, что у клиента была обычная простуда, а не что-то серьёзное. Расскажите подробнее о симптомах.",
      здоровье: "Здоровье - это самое важное! Я помогаю с профилактикой и пониманием медицинских вопросов. Например, составил план здорового питания для диабетика - сахар нормализовался за месяц!"
    };
    
    const lowerMessage = message.toLowerCase();
    let response = responses.default;
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }
    
    logger.info('Health assistant response sent', { ip: req.ip });
    res.json({ reply: response });
  } catch (error) {
    logger.error('Health assistant error:', { error: error.message, stack: error.stack, ip: req.ip });
    res.status(500).json({ error: 'Временная ошибка сервиса' });
  }
});

// Максим Стратег - бизнес-консультант
app.post('/api/chat/business-advisor', (req, res) => {
  try {
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      logger.warn(`Business advisor validation error: ${error.details[0].message}`, { ip: req.ip });
      return res.status(400).json({ 
        error: 'Неверный формат данных',
        details: error.details[0].message 
      });
    }

    const { message, context, chatHistory } = value;
    
    const responses = {
      default: "Привет! Максим Стратег здесь 📈 Помогаю бизнесу расти с помощью данных и AI. Недавно увеличил прибыль ресторана на 85% через автоматизацию заказов. Какую задачу решаем?",
      бизнес: "Отличный вопрос! Я анализирую бизнес через призму данных. Например, помог IT-стартапу найти нишу - оказалось, что рынок автоматизации для стоматологий недооценён. ROI составил 300% за год!",
      стратегия: "Стратегия - моя стихия! Недавно разработал план для медицинской клиники: автоматизация записи + CRM + аналитика = +40% клиентов за 3 месяца. Расскажите о вашем бизнесе!",
      автоматизация: "Автоматизация - это мощно! Внедрил боты в ресторан: приём заказов, уведомления, аналитика. Результат: -60% времени на рутину, +85% прибыль. Что автоматизируем?",
      прибыль: "Прибыль растёт через оптимизацию! Помог салону красоты: автоматическая запись + напоминания + персональные предложения = +120% выручка. Изучим ваши процессы?"
    };
    
    const lowerMessage = message.toLowerCase();
    let response = responses.default;
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }
    
    logger.info('Business advisor response sent', { ip: req.ip });
    res.json({ reply: response });
  } catch (error) {
    logger.error('Business advisor error:', { error: error.message, stack: error.stack, ip: req.ip });
    res.status(500).json({ error: 'Временная ошибка сервиса' });
  }
});

// Техно-Саша - техническая поддержка
app.post('/api/chat/support-agent', (req, res) => {
  try {
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      logger.warn(`Support agent validation error: ${error.details[0].message}`, { ip: req.ip });
      return res.status(400).json({ 
        error: 'Неверный формат данных',
        details: error.details[0].message 
      });
    }

    const { message, context, chatHistory } = value;
    
    const responses = {
      default: "Йо! Техно-Саша на связи 🎧 Решаю любые технические задачи. Недавно подключил CRM к WhatsApp боту за 2 часа - клиент был в шоке от скорости! Что сломалось? 😄",
      техника: "Техника - это просто! Как конструктор Lego, только для взрослых 😎 Недавно настроил автоматическую синхронизацию между сайтом и 1С - теперь заказы летают сами. Что настраиваем?",
      интеграция: "Интеграции - моя любимая тема! Соединил Telegram бота с CRM автосервиса: клиент пишет → бот записывает → мастер получает уведомление. Магия! ✨ Что соединяем?",
      настройка: "Настройка - дело техники! Помог автосервису: бот принимает заявки, проверяет расписание, отправляет напоминания. Владелец теперь спит спокойно 😴 Что настраиваем?",
      код: "Код - это поэзия! Написал бота для фитнес-клуба: расписание, бронирование, оплата - всё в одном месте. Клиенты довольны, администратор свободен! 🚀",
      API: "API - это мосты между системами! Подключил платёжную систему к сайту за час. Теперь деньги капают автоматически 💰 Какой API подключаем?"
    };
    
    const lowerMessage = message.toLowerCase();
    let response = responses.default;
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }
    
    logger.info('Support agent response sent', { ip: req.ip });
    res.json({ reply: response });
  } catch (error) {
    logger.error('Support agent error:', { error: error.message, stack: error.stack, ip: req.ip });
    res.status(500).json({ error: 'Временная ошибка сервиса' });
  }
});

// Креатив-Лиза - контент-мейкер
app.post('/api/chat/content-creator', (req, res) => {
  try {
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      logger.warn(`Content creator validation error: ${error.details[0].message}`, { ip: req.ip });
      return res.status(400).json({ 
        error: 'Неверный формат данных',
        details: error.details[0].message 
      });
    }

    const { message, context, chatHistory } = value;
    
    const responses = {
      default: "Привет, дорогой! ✍️ Креатив-Лиза здесь! Я влюбляю клиентов в бренды через магию слов. Недавно написала пост для фитнес-клуба - записалось 50 новых клиентов за день! О чём мечтаем?",
      контент: "Контент - это душа бренда! ❤️ Создала серию постов для IT-компании: от сухих технологий к живым историям. Результат: +200% вовлечённость! Какую историю расскажем?",
      реклама: "Реклама должна цеплять за сердце! 💫 Написала рекламу для стоматологии: 'Улыбка, которая покоряет сердца' - записи увеличились в 3 раза! Что рекламируем?",
      пост: "Посты - это маленькие шедевры! ✨ Для салона красоты написала: 'Красота начинается с уверенности в себе' + фото до/после = вирусный пост! Какую тему раскрываем?",
      текст: "Тексты - моя стихия! 📝 Переписала сайт юридической фирмы: от канцелярщины к человечности. Конверсия выросла на 150%! Что переписываем?",
      маркетинг: "Маркетинг - это психология + креатив! 🧠💡 Разработала стратегию для кафе: истории о кофе + эмоции = очереди у входа! Какую стратегию создаём?",
      бренд: "Бренд - это личность компании! 🎭 Помогла автосервису стать 'другом автомобилистов' вместо 'ремонтной мастерской'. Клиенты теперь рекомендуют друзьям!"
    };
    
    const lowerMessage = message.toLowerCase();
    let response = responses.default;
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }
    
    logger.info('Content creator response sent', { ip: req.ip });
    res.json({ reply: response });
  } catch (error) {
    logger.error('Content creator error:', { error: error.message, stack: error.stack, ip: req.ip });
    res.status(500).json({ error: 'Временная ошибка сервиса' });
  }
});

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Маршрут для демо мультиагентного чата
app.get('/multiagent-demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'multiagent-chat-demo.html'));
});

// Маршрут для тестирования ботов
app.get('/test-bots', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-bots.html'));
});

// Логирование ошибок
app.use(expressWinston.errorLogger({
  winstonInstance: logger
}));

// 404 обработчик
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`, { ip: req.ip });
  res.status(404).json({ 
    error: 'Страница не найдена',
    status: 404,
    path: req.url
  });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', { 
    error: err.message, 
    stack: err.stack, 
    url: req.url, 
    method: req.method,
    ip: req.ip 
  });

  // Проверяем на CORS ошибку
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS: Доступ запрещён',
      message: 'Ваш домен не разрешён для доступа к API'
    });
  }

  res.status(500).json({ 
    error: 'Внутренняя ошибка сервера',
    timestamp: new Date().toISOString()
  });
});

// Создаём директорию для логов если её нет
const fs = require('fs');
const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

app.listen(port, () => {
  logger.info(`🚀 Сервер работает на http://localhost:${port}`, {
    port,
    openai: openai ? 'connected' : 'unavailable',
    security: 'enhanced',
    version: '2.0.0'
  });
  logger.info('🔒 Безопасность: Helmet, CORS, Rate Limiting, Валидация включены');
  logger.info('📊 Логирование: Winston включен, логи сохраняются в /logs');
});
