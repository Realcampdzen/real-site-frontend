// AI Assistants Integration System
class AssistantsManager {
  constructor() {
    this.currentBot = null;
    this.botEndpoints = {
      'health-assistant': '/api/chat/health-assistant',
      'business-advisor': '/api/chat/business-advisor', 
      'support-agent': '/api/chat/support-agent',
      'content-creator': '/api/chat/content-creator'
    };
    
    this.botNames = {
      'health-assistant': '🩺 Доктор Анна',
      'business-advisor': '📈 Максим Стратег',
      'support-agent': '🎧 Техно-Саша',
      'content-creator': '✍️ Креатив-Лиза'
    };

    this.botGreetings = {
      'health-assistant': `👋 Привет! Я Доктор Анна - ваш персональный медицинский AI-ассистент из AI Studio.

🩺 **Что я умею прямо сейчас:**
📋 Анализирую медицинские справки и выписки
🔍 Расшифровываю анализы крови, мочи, биохимию
💊 Даю рекомендации по лекарствам и дозировкам
📊 Отслеживаю динамику показателей здоровья
🏥 Помогаю подготовиться к визиту к врачу

**Попробуйте прямо сейчас:** загрузите любую справку или опишите симптомы - покажу, как работает профессиональный медицинский AI! 

*Я не заменяю врача, но делаю медицину понятнее* 💙`,

      'business-advisor': `🤝 Здравствуйте! Максим Стратег - ваш бизнес-консультант с 15-летним опытом + AI-суперспособностями.

📈 **Мой подход к бизнесу:**
🎯 Анализирую рынок через призму данных
💰 Строю финансовые модели с прогнозами
🚀 Создаю стратегии роста на основе трендов
🤖 Внедряю AI для автоматизации процессов
📊 Оптимизирую воронки продаж

**Давайте проверим ваш бизнес:** расскажите о своей компании - проведу экспресс-анализ и покажу точки роста!

*Каждый мой совет подкреплен данными и опытом* 💼`,

      'support-agent': `🎮 Йо! Техно-Саша на связи - ваш неформальный техгуру из AI Studio!

⚡ **Что я "варю" в техплане:**
🔧 Решаю любые технические косяки
🤖 Настраиваю ботов "под ключ"
🔗 Интегрирую AI в ваши системы
📱 Делаю мобильные приложения живыми
🛠️ Чиню то, что "сломали программисты"

**Есть техническая боль?** Описывайте проблему - разберем по полочкам и найдем решение! Говорю простым языком, без технического мусора.

*Если это можно автоматизировать - я это автоматизирую* 🚀`,

      'content-creator': `✨ Привет, красавчик! Я Креатив-Лиза - ваша муза в мире контента!

🎨 **Моя магия контента:**
📝 Пишу тексты, которые продают и вдохновляют
🎭 Создаю персонажей для брендов
📱 Генерирую вирусный контент для соцсетей
🎬 Придумываю сценарии для видео
💡 Превращаю скучные темы в захватывающие истории

**Хотите увидеть магию?** Назовите любую тему или продукт - создам для вас пост, который зацепит аудиторию!

*Контент без души - просто буквы. Я вкладываю эмоции в каждое слово* 💫`
    };

    // Расширенные fallback ответы с демонстрацией экспертизы
    this.expertFallbacks = {
      'health-assistant': {
        'анализ': `🔬 **Пример моего анализа справки:**

📋 **Общий анализ крови:**
• Гемоглобин 145 г/л (норма 120-160) ✅
• Лейкоциты 8.2×10⁹/л (норма 4-9) ✅  
• СОЭ 15 мм/ч (норма до 20) ✅

**Мое заключение:** Показатели в норме, признаков воспаления нет.

**Рекомендации:**
🥗 Поддерживать уровень железа (говядина, гранаты)
💧 Пить 2л воды в день
🏃‍♀️ Умеренные физнагрузки

Хотите такой же анализ ваших справок? Медицинский AI-бот стоит от 18,000₽. Заказать: @Stivanovv`,

        'симптомы': `🩺 **Как я анализирую симптомы:**

**Ваши жалобы:** "Головная боль, усталость"

**Мой алгоритм:**
1️⃣ Анализирую сочетание симптомов
2️⃣ Исключаю опасные состояния  
3️⃣ Предлагаю план обследования
4️⃣ Даю рекомендации до визита к врачу

**Возможные причины:**
• Недосып (вероятность 40%)
• Обезвоживание (30%)
• Стресс (20%)
• Требует обследования (10%)

Такой помощник нужен вашей клинике? От 18,000₽. Заказать: @Stivanovv`,

        'default': `🩺 Как медицинский AI, я помогаю людям лучше понимать свое здоровье.

**Реальный кейс:** Клиент загрузил анализы с повышенным холестерином. Я:
✅ Объяснил, что это значит простыми словами
✅ Дал рекомендации по питанию
✅ Предложил план контроля
✅ Подготовил вопросы для врача

**Результат:** Через 3 месяца холестерин в норме!

Хотите медицинского AI-помощника? От 18,000₽. Заказать: @Stivanovv`
      },

      'business-advisor': {
        'стратегия': `📈 **Пример бизнес-анализа:**

**Клиент:** Интернет-магазин одежды
**Проблема:** Падение продаж на 30%

**Мой анализ:**
🔍 Конверсия сайта: 1.2% (норма 2-3%)
📱 Мобильная версия: тормозит
🎯 Реклама: широкая, но не точная
💬 Поддержка: только email

**Мое решение:**
1️⃣ AI-чатбот для консультаций (+40% конверсии)
2️⃣ Персонализация рекомендаций (+25% чек)
3️⃣ Автоматизация email-маркетинга
4️⃣ Оптимизация мобильной версии

**Результат:** +85% продаж за 2 месяца!

Нужен такой анализ? Бизнес-консультант от 35,000₽. Заказать: @Stivanovv`,

        'автоматизация': `🤖 **Кейс автоматизации ресторана:**

**Было:**
😤 Официанты записывают заказы на бумаге
📞 Бронирование только по телефону  
💸 Потери из-за человеческих ошибок
⏰ Клиенты ждут счет по 15 минут

**Стало (после AI):**
✅ QR-меню с AI-рекомендациями
✅ Автобронирование через бота
✅ Умная касса без ошибок
✅ Мгновенная оплата через приложение

**Цифры:**
📈 +60% оборот
⚡ -40% время обслуживания  
😊 +90% довольных клиентов
💰 Окупилось за 2 месяца

Хотите автоматизировать свой бизнес? От 35,000₽. Заказать: @Stivanovv`,

        'default': `💼 Как бизнес-консультант, я помогаю компаниям расти умнее.

**Мой подход:**
🎯 Не общие советы, а конкретные решения
📊 Анализ на основе данных, не догадок
🚀 Внедрение AI для конкурентного преимущества
💰 Фокус на ROI каждого решения

**Последний успех:** Помог IT-компании увеличить прибыль на 150% через автоматизацию продаж и внедрение AI-помощников.

Готов проанализировать ваш бизнес? Консультация от 35,000₽. Заказать: @Stivanovv`
      },

      'support-agent': {
        'интеграция': `🔧 **Реальный кейс интеграции:**

**Задача:** Подключить CRM к Telegram-боту

**Что было:**
😫 Менеджеры вручную переносят данные
📞 Клиенты звонят с одними вопросами
💸 Теряются лиды из-за медленной реакции

**Что сделал:**
1️⃣ Настроил API между CRM и ботом
2️⃣ Создал автоматические уведомления
3️⃣ Добавил умные ответы на частые вопросы
4️⃣ Интегрировал с системой платежей

**Результат:**
⚡ Время реакции: с 2 часов до 30 секунд
📈 Конверсия лидов: +40%
😎 Менеджеры занимаются продажами, не рутиной

Нужна интеграция? Техподдержка от 15,000₽. Заказать: @Stivanovv`,

        'настройка': `⚙️ **Как я настраиваю ботов:**

**Пример:** Бот для автосервиса

**Мой чек-лист:**
✅ Анализ бизнес-процессов
✅ Создание сценариев диалогов  
✅ Интеграция с календарем записи
✅ Подключение к базе запчастей
✅ Настройка уведомлений
✅ Обучение персонала
✅ Мониторинг и оптимизация

**Фишки, которые добавляю:**
🔔 Напоминания о ТО
📸 Фото-диагностика проблем
💰 Калькулятор стоимости ремонта
⭐ Система отзывов

**Время настройки:** 1-2 недели
**Стоимость:** от 15,000₽

Заказать настройку: @Stivanovv`,

        'default': `🛠️ Я решаю технические задачи, которые другие считают невозможными.

**Мой принцип:** Если есть API - я это подключу. Если нет API - создам свой.

**Последний челлендж:** Клиент хотел интегрировать 5 разных систем в одного бота. Все говорили "невозможно". Я сделал за неделю.

**Что умею:**
🔗 Любые интеграции
🤖 Настройка ботов под бизнес
📱 Мобильные приложения
🌐 Веб-разработка
☁️ Облачные решения

Есть техническая задача? Техподдержка от 15,000₽. Заказать: @Stivanovv`
      },

      'content-creator': {
        'пост': `✨ **Пример моего поста для фитнес-клуба:**

---
🔥 **ПОНЕДЕЛЬНИК = НОВАЯ ТЫ**

Знаешь, что общего у успешных людей? 
Они не ждут "подходящего момента" 💪

Сегодня в зале видела девушку, которая пришла впервые. Руки тряслись, но глаза горели. Через час она уже улыбалась и планировала завтрашнюю тренировку.

**Твой момент - СЕЙЧАС:**
✅ Первая тренировка - БЕСПЛАТНО
✅ Персональная программа в подарок  
✅ Поддержка тренера 24/7

Не откладывай на завтра то, что изменит твою жизнь сегодня ❤️

*Запись: ссылка в профиле*
---

**Результат:** +47 новых клиентов за неделю!

Нужен контент, который продает? От 1,700₽ за пост. Заказать: @Stivanovv`,

        'стратегия': `🎯 **Контент-стратегия для IT-компании:**

**Проблема:** "Мы скучные, никто не читает наши посты"

**Моя стратегия:**
1️⃣ **Персонажи:** Создала образы разработчиков
2️⃣ **Сторителлинг:** Истории из жизни программистов
3️⃣ **Образование:** Сложное простыми словами
4️⃣ **Интерактив:** Опросы, челленджи, мемы

**Контент-план на месяц:**
📚 8 образовательных постов
🎭 6 историй сотрудников  
🎮 4 интерактивных поста
📈 4 кейса клиентов
😄 8 мемов и приколов

**Результат:**
📈 Охват: +340%
💬 Вовлеченность: +280%
🎯 Лиды: +150%

Нужна контент-стратегия? От 10,000₽. Заказать: @Stivanovv`,

        'default': `🎨 Я превращаю скучные бренды в магниты для клиентов.

**Мой секрет:** Контент должен не просто информировать, а ВЛЮБЛЯТЬ в бренд.

**Последний успех:** Помогла стоматологии стать самой популярной в городе. Как? Создала серию постов "Зубная фея рассказывает" - люди ждали каждый пост!

**Что создаю:**
📝 Посты, которые вирусятся
🎬 Сценарии для видео
📱 Контент для Stories
💌 Email-рассылки
🎭 Персонажей для брендов

Хотите влюбить клиентов в свой бренд? От 1,700₽ за пост. Заказать: @Stivanovv`
      }
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.createAssistantChat();
    this.checkBotsStatus();
  }

  bindEvents() {
    // Кнопки "Попробовать" ассистентов
    document.querySelectorAll('.try-assistant-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const botId = e.target.getAttribute('data-bot-id');
        this.openAssistantChat(botId);
      });
    });
  }

  async checkBotsStatus() {
    try {
      const response = await fetch('http://localhost:3001/api/bots/status');
      const status = await response.json();
      
      console.log('🤖 Статус ботов:', status);
      
      // Обновляем UI карточек ассистентов на основе статуса
      Object.entries(status).forEach(([botId, botStatus]) => {
        const card = document.querySelector(`[data-bot="${botId}"]`);
        if (card) {
          const statusIndicator = botStatus.status === 'online' ? '🟢' : '🟡';
          const statusText = botStatus.status === 'online' ? 'Онлайн' : 'Fallback режим';
          
          // Добавляем статус индикатор если его нет
          let statusEl = card.querySelector('.bot-status');
          if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.className = 'bot-status';
            statusEl.style.cssText = 'position: absolute; top: 10px; right: 10px; font-size: 12px; opacity: 0.8;';
            card.style.position = 'relative';
            card.appendChild(statusEl);
          }
          statusEl.textContent = `${statusIndicator} ${statusText}`;
        }
      });
      
    } catch (error) {
      console.log('⚠️ Не удалось получить статус ботов:', error.message);
    }
  }

  createAssistantChat() {
    // Создаем отдельный чат для ассистентов
    const assistantChatHTML = `
      <div id="assistant-chat-overlay" class="chat-overlay hidden">
        <div class="chat-container">
          <div class="chat-header">
            <div class="chat-avatar" id="assistant-avatar">🤖</div>
            <div class="chat-info">
              <h3 id="assistant-name">AI Ассистент</h3>
              <p id="assistant-status">Готов помочь</p>
            </div>
            <div class="chat-source" id="chat-source-indicator" style="margin-left: auto; margin-right: 10px; font-size: 12px; opacity: 0.7;"></div>
            <button id="close-assistant-chat" class="chat-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div id="assistant-chat-messages" class="chat-messages">
            <!-- Сообщения будут добавляться динамически -->
          </div>
          
          <div class="chat-input-container">
            <input id="assistant-chat-input" type="text" placeholder="Напишите сообщение ассистенту..." />
            <button id="assistant-chat-send">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Добавляем в конец body
    document.body.insertAdjacentHTML('beforeend', assistantChatHTML);

    // Привязываем события
    document.getElementById('close-assistant-chat').addEventListener('click', () => {
      this.closeAssistantChat();
    });

    document.getElementById('assistant-chat-send').addEventListener('click', () => {
      this.sendAssistantMessage();
    });

    document.getElementById('assistant-chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendAssistantMessage();
      }
    });
  }

  openAssistantChat(botId) {
    this.currentBot = botId;
    const overlay = document.getElementById('assistant-chat-overlay');
    const avatar = document.getElementById('assistant-avatar');
    const name = document.getElementById('assistant-name');
    const status = document.getElementById('assistant-status');
    const messages = document.getElementById('assistant-chat-messages');

    // Настройка интерфейса под конкретного бота
    avatar.textContent = this.getBotAvatar(botId);
    name.textContent = this.botNames[botId];
    status.textContent = 'Подключение...';

    // Очистка и добавление приветственного сообщения
    messages.innerHTML = '';
    this.addAssistantMessage('assistant', this.botGreetings[botId]);

    // Показ чата
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Анимация появления
    setTimeout(() => {
      overlay.style.opacity = '1';
      status.textContent = 'Онлайн';
    }, 10);
  }

  closeAssistantChat() {
    const overlay = document.getElementById('assistant-chat-overlay');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    this.currentBot = null;
  }

  getBotAvatar(botId) {
    const avatars = {
      'health-assistant': '🩺',
      'business-advisor': '📈', 
      'support-agent': '🎧',
      'content-creator': '✍️'
    };
    return avatars[botId] || '🤖';
  }

  addAssistantMessage(sender, content, metadata = {}) {
    const messages = document.getElementById('assistant-chat-messages');
    
    // Добавляем информацию об источнике если есть
    let sourceInfo = '';
    if (metadata.source) {
      const sourceIcons = {
        'external': '🔗 Внешний бот',
        'fallback': '🔄 Fallback режим', 
        'error_fallback': '⚠️ Резервный режим'
      };
      sourceInfo = `<div class="message-source" style="font-size: 11px; opacity: 0.6; margin-top: 4px;">${sourceIcons[metadata.source] || metadata.source}</div>`;
    }
    
    const messageHTML = `
      <div class="chat-message ${sender}">
        <div class="message-avatar">${sender === 'assistant' ? this.getBotAvatar(this.currentBot) : '👤'}</div>
        <div class="message-content">
          ${content}
          ${sourceInfo}
        </div>
      </div>
    `;
    
    messages.insertAdjacentHTML('beforeend', messageHTML);
    messages.scrollTop = messages.scrollHeight;

    // Обновляем индикатор источника в заголовке
    if (metadata.source && sender === 'assistant') {
      const sourceIndicator = document.getElementById('chat-source-indicator');
      const sourceTexts = {
        'external': '🟢 Внешний бот',
        'fallback': '🟡 Fallback',
        'error_fallback': '🔴 Резерв'
      };
      sourceIndicator.textContent = sourceTexts[metadata.source] || '';
    }
  }

  async sendAssistantMessage() {
    const input = document.getElementById('assistant-chat-input');
    const message = input.value.trim();
    
    if (!message || !this.currentBot) return;

    // Добавляем сообщение пользователя
    this.addAssistantMessage('user', message);
    input.value = '';

    // Добавляем индикатор печати
    this.addTypingIndicator();

    try {
      // Отправляем запрос к API Gateway
      const response = await this.sendToAssistantAPI(this.currentBot, message);
      
      // Удаляем индикатор печати
      this.removeTypingIndicator();
      
      // Добавляем ответ ассистента с метаданными
      this.addAssistantMessage('assistant', response.reply, {
        source: response.source,
        botId: response.botId,
        timestamp: response.timestamp
      });
      
    } catch (error) {
      this.removeTypingIndicator();
      console.error('Ошибка при отправке сообщения ассистенту:', error);
      
      // Показываем сообщение об ошибке
      this.addAssistantMessage('assistant', 
        'Извините, произошла техническая ошибка. Попробуйте позже или свяжитесь с @Stivanovv для получения помощи. 📞',
        { source: 'error_fallback' }
      );
    }
  }

  async sendToAssistantAPI(botId, message) {
    const endpoint = this.botEndpoints[botId];
    
    try {
    const response = await fetch(`http://localhost:3001${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        userId: this.generateUserId(),
        botId: botId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Логируем источник ответа
    console.log(`📡 Ответ от ${botId}:`, {
      source: data.source,
      length: data.reply?.length || 0
    });
    
    return {
      reply: data.reply || 'Извините, не получен ответ от ассистента.',
      source: data.source || 'unknown',
      botId: data.botId || botId,
      timestamp: data.timestamp || new Date().toISOString()
    };
      
    } catch (error) {
      console.error(`Ошибка подключения к ${botId}:`, error);
      
      // Используем умные fallback ответы
      const smartReply = this.getSmartFallbackReply(botId, message);
      
      return {
        reply: smartReply,
        source: 'smart_fallback',
        botId: botId,
        timestamp: new Date().toISOString()
      };
    }
  }

  getSmartFallbackReply(botId, message) {
    const lowerMessage = message.toLowerCase();
    const botFallbacks = this.expertFallbacks[botId];
    
    if (!botFallbacks) {
      return `Извините, ${this.botNames[botId]} временно недоступен. Попробуйте позже или свяжитесь с @Stivanovv для получения помощи. 📞`;
    }

    // Умный анализ сообщения для выбора подходящего ответа
    const keywords = {
      'health-assistant': {
        'анализ': ['анализ', 'справка', 'результат', 'кровь', 'моча', 'биохимия', 'показатель', 'норма'],
        'симптомы': ['симптом', 'болит', 'боль', 'температура', 'кашель', 'головная', 'усталость', 'слабость', 'тошнота']
      },
      'business-advisor': {
        'стратегия': ['стратегия', 'план', 'развитие', 'рост', 'анализ', 'конкуренты', 'рынок', 'продажи'],
        'автоматизация': ['автоматизация', 'процесс', 'бот', 'система', 'crm', 'интеграция', 'эффективность']
      },
      'support-agent': {
        'интеграция': ['интеграция', 'подключение', 'api', 'crm', 'система', 'связать', 'объединить'],
        'настройка': ['настройка', 'настроить', 'установка', 'конфигурация', 'параметры', 'бот']
      },
      'content-creator': {
        'пост': ['пост', 'контент', 'текст', 'написать', 'создать', 'соцсети', 'instagram', 'вконтакте'],
        'стратегия': ['стратегия', 'план', 'контент-план', 'продвижение', 'smm', 'маркетинг']
      }
    };

    const botKeywords = keywords[botId];
    if (botKeywords) {
      for (const [category, words] of Object.entries(botKeywords)) {
        if (words.some(word => lowerMessage.includes(word))) {
          return botFallbacks[category];
        }
      }
    }

    // Возвращаем default ответ если не найдено совпадений
    return botFallbacks.default || `Привет! Я ${this.botNames[botId]}. Расскажите подробнее о вашей задаче - покажу, как могу помочь! 

Для заказа свяжитесь с @Stivanovv 📞`;
  }

  addTypingIndicator() {
    const messages = document.getElementById('assistant-chat-messages');
    const typingHTML = `
      <div class="chat-message assistant typing-indicator" id="typing-indicator">
        <div class="message-avatar">${this.getBotAvatar(this.currentBot)}</div>
        <div class="message-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
    
    messages.insertAdjacentHTML('beforeend', typingHTML);
    messages.scrollTop = messages.scrollHeight;
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  generateUserId() {
    return 'web_user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  new AssistantsManager();
});

// Добавляем CSS для индикатора печати и улучшений
const typingCSS = `
  .typing-indicator .message-content {
    padding: 12px 16px;
  }

  .typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .typing-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #667eea;
    animation: typing 1.4s infinite ease-in-out;
  }

  .typing-dots span:nth-child(1) { animation-delay: 0s; }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typing {
    0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
    30% { opacity: 1; transform: scale(1); }
  }

  .bot-status {
    background: rgba(0, 0, 0, 0.8);
    padding: 4px 8px;
    border-radius: 12px;
    color: white;
    font-weight: 500;
  }

  .message-source {
    font-style: italic;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 4px;
    margin-top: 8px;
  }

  .chat-source {
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    .assistants-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    .assistant-card {
      padding: 24px;
    }
    
    .chat-source {
      display: none;
    }
  }
`;

// Добавляем стили в head
const style = document.createElement('style');
style.textContent = typingCSS;
document.head.appendChild(style); 