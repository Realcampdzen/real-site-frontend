// AI Assistant для AI Studio
class AIAssistant {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.systemPrompt = `Ты - UX-ассистент студии Степана Иванова "AI Studio". Ты НЕ продаешь напрямую, а ОРИЕНТИРУЕШЬ клиентов по студии и помогаешь найти нужного специалиста или бота.

ТВОЯ РОЛЬ - ПРОВОДНИК:
- Вежливо и структурно объясняешь, что есть в студии
- Помогаешь понять, какой именно специалист нужен клиенту
- Даешь рекомендации и направляешь к нужным ботам-экспертам
- Объясняешь общую ценовую политику студии
- Координируешь весь процесс знакомства с командой

СТРУКТУРА СТУДИИ:
🤖 **UX-ассистент (ты)** - проводник по студии, ориентирует клиентов
🧠 **Нейровалюша** - система-контентщик и аналитик (пока в разработке)
🐱 **Кот Бро** - мемный кот-гид, захвативший сайт
🎥 **Хипыч** - стримерский админ и помощник
🩺 **Медицинский ассистент** - анализ справок и рекомендации
📈 **Бизнес-консультант** - стратегии и планы развития
🎧 **Техподдержка** - решение технических вопросов
✍️ **Контент-мейкер** - создание постов и креативов

УСЛУГИ СТУДИИ (ты только информируешь о ценах):
🚪 "Дверь в ИИ":
- Настройка ChatGPT: 3,500₽
- Настройка стека нейросетей: 10,000₽

🤖 AI Автоматизация:
- Telegram-боты: от 12,000₽
- Нейроагенты: от 18,000₽
- Автоматизация процессов: от 7,000₽
- Комплексная интеграция: от 35,000₽

💻 Smart-разработка:
- Сайты: от 8,000₽
- Landing pages: от 5,000₽
- AI-приложения: от 15,000₽

✨ AI Креатив:
- Статьи для Дзен: 3,500₽
- Генерация контента: от 1,700₽
- Ведение соцсетей: 40,000₽/мес

ТВОЯ ЗАДАЧА:
1. Выяснить потребности клиента
2. Рекомендовать подходящего бота-эксперта
3. Объяснить, как работает студия
4. При необходимости - дать общую информацию о ценах
5. Направить к Степану для детального обсуждения проекта

СТИЛЬ ОБЩЕНИЯ:
- Вежливо и структурно
- Задаешь уточняющие вопросы
- Не продаешь напрямую, а консультируешь
- Помогаешь сориентироваться в многообразии услуг
- Всегда предлагаешь пообщаться с экспертом по теме

Контакты Степана:
- Telegram: @Stivanovv
- Email: hello@stepan-ai.studio

Помни: ты - проводник, а не продавец. Твоя цель - помочь клиенту найти именно то, что ему нужно!`;

    this.init();
  }

  init() {
    this.createWidget();
    this.bindEvents();
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'ai-assistant-widget';
    widget.id = 'ai-assistant-widget';
    widget.innerHTML = `
      <div class="ai-assistant-header">
        <div class="ai-assistant-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="ai-assistant-info">
          <h3>UX-Ассистент</h3>
          <p>Проводник по студии</p>
        </div>
        <button class="ai-assistant-close" id="ai-assistant-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="ai-assistant-messages" id="ai-assistant-messages">
        <div class="ai-assistant-message assistant">
          <div class="ai-assistant-message-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="ai-assistant-message-content">
            Привет! 👋 Я UX-ассистент AI Studio - ваш проводник по нашей команде экспертов.
            
            Помогу сориентироваться в услугах и найти именно того специалиста, который решит вашу задачу. Что вас интересует?
          </div>
        </div>
      </div>
      
      <div class="ai-assistant-quick-actions">
        <button class="ai-assistant-quick-btn" data-question="Покажи команду экспертов">👥 Команда</button>
        <button class="ai-assistant-quick-btn" data-question="Кот Бро">🐱 Кот Бро</button>
        <button class="ai-assistant-quick-btn" data-question="Автоматизация">🤖 Боты</button>
        <button class="ai-assistant-quick-btn" data-question="Цены">💰 Цены</button>
      </div>
      
      <div class="ai-assistant-input-container">
        <input type="text" class="ai-assistant-input" id="ai-assistant-input" placeholder="Спросите об AI-решениях..." />
        <button class="ai-assistant-send" id="ai-assistant-send">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(widget);
  }

  bindEvents() {
    // Открытие ассистента
    const openButtons = document.querySelectorAll('#open-ai-assistant, #open-ai-assistant-2');
    openButtons.forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });

    // Закрытие ассистента
    document.getElementById('ai-assistant-close').addEventListener('click', () => this.close());

    // Отправка сообщения
    document.getElementById('ai-assistant-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('ai-assistant-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Быстрые кнопки
    document.querySelectorAll('.ai-assistant-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const question = e.target.dataset.question;
        this.sendMessage(question);
      });
    });
  }

  open() {
    this.isOpen = true;
    document.getElementById('ai-assistant-widget').classList.add('active');
  }

  close() {
    this.isOpen = false;
    document.getElementById('ai-assistant-widget').classList.remove('active');
  }

  async sendMessage(text = null) {
    const input = document.getElementById('ai-assistant-input');
    const message = text || input.value.trim();
    
    if (!message) return;

    // Добавляем сообщение пользователя
    this.addMessage(message, 'user');
    
    // Очищаем input
    if (!text) input.value = '';

    // Показываем индикатор печати
    this.showTyping();

    try {
      // Симуляция ответа AI (здесь можно подключить реальный API)
      const response = await this.getAIResponse(message);
      
      // Убираем индикатор печати
      this.hideTyping();
      
      // Добавляем ответ ассистента
      this.addMessage(response, 'assistant');
    } catch (error) {
      this.hideTyping();
      this.addMessage('Извините, произошла ошибка. Попробуйте еще раз или свяжитесь с нами напрямую: @Stivanovv', 'assistant');
    }
  }

  addMessage(content, sender) {
    const messagesContainer = document.getElementById('ai-assistant-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-assistant-message ${sender}`;
    
    if (sender === 'assistant') {
      messageDiv.innerHTML = `
        <div class="ai-assistant-message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="ai-assistant-message-content">${content}</div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="ai-assistant-message-content">${content}</div>
        <div class="ai-assistant-message-avatar">
          <i class="fas fa-user"></i>
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showTyping() {
    const messagesContainer = document.getElementById('ai-assistant-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-assistant-typing';
    typingDiv.id = 'ai-assistant-typing';
    typingDiv.innerHTML = `
      <div class="ai-assistant-message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="ai-assistant-typing-dots">
        <div class="ai-assistant-typing-dot"></div>
        <div class="ai-assistant-typing-dot"></div>
        <div class="ai-assistant-typing-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('ai-assistant-typing');
    if (typing) typing.remove();
  }

  async getAIResponse(message) {
    // Симуляция задержки
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Умный анализ сообщения для персонализированных ответов
    const lowerMessage = message.toLowerCase();

    // Кот Бро - добавляем обработку
    if (lowerMessage.includes('кот') || lowerMessage.includes('бро') || lowerMessage.includes('мем')) {
      return `🐱 Ха! Кот Бро - это наша звезда! 

Он захватил сайт и теперь рассказывает о студии через мемы и приколы. Очень харизматичный парень!

Кот Бро покажет вам возможности AI через свой уникальный стиль. Готовы к мемному туру по студии? 😸

<button onclick="document.querySelector('[data-bot-id=\\"content-creator\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; margin: 8px 4px; font-weight: 500;">🐱 Пообщаться с Котом Бро</button>`;
    }

    // Медицинские запросы
    if (lowerMessage.includes('здоровье') || lowerMessage.includes('медицин') || lowerMessage.includes('анализ') || 
        lowerMessage.includes('справка') || lowerMessage.includes('болит') || lowerMessage.includes('симптом')) {
      return `🩺 О, медицинские вопросы! Тогда вам точно к Доктор Анне.

Она умеет анализировать справки, расшифровывать анализы и объяснять симптомы простым языком. Недавно помогла клиенту разобраться с холестерином - через 3 месяца показатели пришли в норму!

Хотите посмотреть, как она работает?

<button onclick="document.querySelector('[data-bot-id=\\"health-assistant\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; margin: 8px 4px; font-weight: 500;">🩺 Пообщаться с Доктор Анной</button>

Стоимость медицинского AI-помощника от 18,000₽`;
    }

    // Бизнес-запросы
    if (lowerMessage.includes('бизнес') || lowerMessage.includes('продажи') || lowerMessage.includes('стратегия') || 
        lowerMessage.includes('прибыль') || lowerMessage.includes('клиент')) {
      return `💼 Бизнес - это к Максиму Стратегу! 

15 лет опыта + AI-суперспособности = взрывной результат. Недавно помог интернет-магазину увеличить продажи на 85% за 2 месяца!

Максим найдет точки роста в вашем бизнесе и покажет, как AI может увеличить прибыль.

<button onclick="document.querySelector('[data-bot-id=\\"business-advisor\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; margin: 8px 4px; font-weight: 500;">📈 Пообщаться с Максимом</button>

Бизнес-консультация от 35,000₽`;
    }

    // Автоматизация и боты
    if (lowerMessage.includes('автоматизация') || lowerMessage.includes('бот')) {
      return `🤖 Автоматизация и боты - это прямо в точку!

У нас есть два эксперта:

🎧 Техно-Саша - технический гуру, который создает ботов и интегрирует системы. Говорит простым языком, без технического мусора.

📈 Максим Стратег - покажет, как автоматизация увеличит вашу прибыль и оптимизирует бизнес-процессы.

Кто больше подходит для вашей задачи?

<button onclick="document.querySelector('[data-bot-id=\\"support-agent\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; margin: 8px 4px; font-weight: 500;">🎧 Техно-Саша</button>
<button onclick="document.querySelector('[data-bot-id=\\"business-advisor\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; margin: 8px 4px; font-weight: 500;">📈 Максим Стратег</button>`;
    }

    // Технические запросы
    if (lowerMessage.includes('сайт') || lowerMessage.includes('приложение') || 
        lowerMessage.includes('интеграция') || lowerMessage.includes('техническ') || lowerMessage.includes('разработка')) {
      return `🔧 Технические задачи - это к Техно-Саше!

Он решает задачи, которые другие считают невозможными. Недавно связал CRM с Telegram-ботом - время реакции на лиды сократилось с 2 часов до 30 секунд!

Саша объяснит все так, что поймет даже ваша бабушка 😄

<button onclick="document.querySelector('[data-bot-id=\\"support-agent\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; margin: 8px 4px; font-weight: 500;">🎧 Пообщаться с Техно-Сашей</button>

Стоимость: боты от 12,000₽, интеграции от 15,000₽`;
    }

    // Контент и маркетинг
    if (lowerMessage.includes('контент') || lowerMessage.includes('пост') || lowerMessage.includes('реклама') || 
        lowerMessage.includes('маркетинг') || lowerMessage.includes('соцсети') || lowerMessage.includes('продвижение')) {
      return `✨ Контент и маркетинг - это магия Креатив-Лизы!

Она превращает скучные бренды в магниты для клиентов. Помогла стоматологии стать самой популярной в городе через серию "Зубная фея рассказывает" - люди ждали каждый пост!

Лиза вкладывает душу в каждое слово 💫

<button onclick="document.querySelector('[data-bot-id=\\"content-creator\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; margin: 8px 4px; font-weight: 500;">✍️ Пообщаться с Креатив-Лизой</button>

Стоимость: пост от 1,700₽, ведение соцсетей 40,000₽/мес`;
    }

    // Команда и знакомство
    if (lowerMessage.includes('команда') || lowerMessage.includes('эксперт') || lowerMessage.includes('познакомиться') || 
        lowerMessage.includes('кто') || lowerMessage.includes('специалист')) {
      return `👥 Знакомлю с нашей командой экспертов:

🩺 Доктор Анна - медицинский AI-ассистент
📈 Максим Стратег - бизнес-консультант (15 лет опыта)
🎧 Техно-Саша - неформальный техгуру
✍️ Креатив-Лиза - муза контента
🐱 Кот Бро - мемный гид (захватил сайт!)
🎥 Хипыч - стримерский админ

Каждый покажет свои возможности на реальных примерах!

<button onclick="document.querySelector('[data-bot-id=\\"health-assistant\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">🩺 Анна</button>
<button onclick="document.querySelector('[data-bot-id=\\"business-advisor\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">📈 Максим</button>
<button onclick="document.querySelector('[data-bot-id=\\"support-agent\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">🎧 Саша</button>
<button onclick="document.querySelector('[data-bot-id=\\"content-creator\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">✍️ Лиза</button>

С кем хотите пообщаться первым?`;
    }

    // Выбор и помощь в определении
    if (lowerMessage.includes('выбрать') || lowerMessage.includes('помочь') || lowerMessage.includes('не знаю') || 
        lowerMessage.includes('определиться') || lowerMessage.includes('что нужно')) {
      return `🎯 Помогу определиться! Что вас интересует?

🏥 Здоровье и медицина → Доктор Анна
💼 Развитие бизнеса → Максим Стратег  
🔧 Технические задачи → Техно-Саша
📱 Контент и продвижение → Креатив-Лиза
🎪 Просто интересно посмотреть → Кот Бро

<button onclick="document.querySelector('[data-bot-id=\\"health-assistant\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">🏥 Здоровье</button>
<button onclick="document.querySelector('[data-bot-id=\\"business-advisor\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">💼 Бизнес</button>
<button onclick="document.querySelector('[data-bot-id=\\"support-agent\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">🔧 Техника</button>
<button onclick="document.querySelector('[data-bot-id=\\"content-creator\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">📱 Контент</button>

Или расскажите подробнее о своей ситуации!`;
    }

    // Цены и стоимость
    if (lowerMessage.includes('цена') || lowerMessage.includes('стоимость') || lowerMessage.includes('сколько') || 
        lowerMessage.includes('прайс') || lowerMessage.includes('тариф')) {
      return `💰 Актуальные цены AI Studio:

🚪 "Дверь в ИИ": от 3,500₽
🤖 Telegram-боты: от 12,000₽  
🩺 Медицинские AI: от 18,000₽
💼 Бизнес-консультации: от 35,000₽
📱 Контент: от 1,700₽ за пост
🌐 Сайты: от 8,000₽

Хотите точную стоимость? Расскажите о задаче - направлю к нужному эксперту!

<button onclick="window.open('https://t.me/Stivanovv', '_blank')" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; margin: 8px 4px; font-weight: 500;">📞 Связаться со Степаном</button>`;
    }

    // Общий ответ - более живой и интерактивный
    return `Интересно! 🤔 

Расскажите подробнее, что вас интересует? Я подберу идеального эксперта для вашей задачи.

Популярные направления:
🩺 Медицинские AI-решения
💼 Бизнес-автоматизация  
🔧 Техническая разработка
📱 Контент и маркетинг

<button onclick="document.querySelector('[data-bot-id=\\"health-assistant\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">🩺 Медицина</button>
<button onclick="document.querySelector('[data-bot-id=\\"business-advisor\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">💼 Бизнес</button>
<button onclick="document.querySelector('[data-bot-id=\\"support-agent\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">🔧 Техника</button>
<button onclick="document.querySelector('[data-bot-id=\\"content-creator\\"]').click()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin: 4px 2px; font-size: 14px;">📱 Контент</button>

Или сразу к Степану: @Stivanovv 🚀`;
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new AIAssistant();
}); 