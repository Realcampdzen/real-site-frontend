/**
 * Кот Бро - Рыжий AI-помощник AI Studio
 * Интеграция с внешним API на localhost:3001
 */

class BroCatWidget {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.sessionId = this.generateSessionId();
    this.apiBaseUrl = 'http://localhost:3001'; // Проксирование через AI Studio API
    this.init();
  }

  // Генерация уникального ID сессии
  generateSessionId() {
    return 'bro_cat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Инициализация виджета
  init() {
    this.createWidget();
    this.bindEvents();
    // this.checkConnection(); // ВРЕМЕННО ОТКЛЮЧАЕМ ПРОВЕРКУ СОЕДИНЕНИЯ
  }

  // Создание HTML структуры виджета
  createWidget() {
    // Кнопка вызова Кота Бро
    const triggerButton = document.createElement('button');
    triggerButton.className = 'bro-cat-trigger';
    triggerButton.id = 'bro-cat-trigger';
    triggerButton.innerHTML = '';
    triggerButton.title = 'Кот Бро - Рыжий помощник AI Studio';
    document.body.appendChild(triggerButton);

    // Виджет чата
    const widget = document.createElement('div');
    widget.className = 'bro-cat-widget';
    widget.id = 'bro-cat-widget';
    widget.innerHTML = `
      <div class="bro-cat-header">
        <div class="bro-cat-info">
          <div class="bro-cat-avatar"></div>
          <div>
            <div class="bro-cat-title">Кот Бро 🐱</div>
            <div class="bro-cat-subtitle">Рыжий AI-помощник</div>
          </div>
        </div>
        <div class="bro-cat-status" id="bro-cat-status"></div>
        <button class="bro-cat-close" id="bro-cat-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="bro-cat-messages" id="bro-cat-messages">
        <div class="bro-cat-message assistant">
          <div class="bro-cat-message-avatar"></div>
          <div class="bro-cat-message-content">
            Мяу! 🐾 *потягивается* Я Бро, рыжий кот этого сайта! Хочешь поболтать? *мурчит*
          </div>
        </div>
      </div>
      
      <div class="bro-cat-quick-actions">
        <button class="bro-cat-quick-btn" data-question="Что любишь есть?">🍣 Вкусняшки</button>
        <button class="bro-cat-quick-btn" data-question="Расскажи о себе">😸 О коте</button>
        <button class="bro-cat-quick-btn" data-question="Что делает твой хозяин?">🤖 Хозяин</button>
        <button class="bro-cat-quick-btn" data-question="Расскажи про AI Studio">🚀 AI Studio</button>
      </div>
      
      <div class="bro-cat-input-container">
        <input type="text" 
               class="bro-cat-input" 
               id="bro-cat-input" 
               placeholder="Напиши что-нибудь коту... мяу!"
               maxlength="500">
        <button class="bro-cat-send" id="bro-cat-send" disabled>
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(widget);
  }

  // Привязка событий
  bindEvents() {
    const trigger = document.getElementById('bro-cat-trigger');
    const widget = document.getElementById('bro-cat-widget');
    const closeBtn = document.getElementById('bro-cat-close');
    const input = document.getElementById('bro-cat-input');
    const sendBtn = document.getElementById('bro-cat-send');
    const quickBtns = document.querySelectorAll('.bro-cat-quick-btn');

    // Открытие/закрытие виджета
    trigger.addEventListener('click', () => this.toggleWidget());
    closeBtn.addEventListener('click', () => this.closeWidget());

    // Отправка сообщений
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Активация кнопки отправки
    input.addEventListener('input', () => {
      const hasText = input.value.trim().length > 0;
      sendBtn.disabled = !hasText;
      sendBtn.style.opacity = hasText ? '1' : '0.5';
    });

    // Быстрые кнопки
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.dataset.question;
        this.sendMessage(question);
      });
    });
  }

  // Переключение виджета
  toggleWidget() {
    if (this.isOpen) {
      this.closeWidget();
    } else {
      this.openWidget();
    }
  }

  // Открытие виджета
  openWidget() {
    // Закрываем другие виджеты перед открытием кота
    this.closeOtherWidgets();
    
    const widget = document.getElementById('bro-cat-widget');
    const trigger = document.getElementById('bro-cat-trigger');
    
    widget.classList.add('active');
    trigger.classList.add('active');
    this.isOpen = true;
    
    // Фокус на поле ввода
    setTimeout(() => {
      document.getElementById('bro-cat-input').focus();
    }, 300);
  }

  // Закрытие виджета
  closeWidget() {
    const widget = document.getElementById('bro-cat-widget');
    const trigger = document.getElementById('bro-cat-trigger');
    
    widget.classList.remove('active');
    trigger.classList.remove('active');
    this.isOpen = false;
  }

  // Закрытие других виджетов
  closeOtherWidgets() {
    // Закрываем виджет Хипыча если он открыт
    const hipychWidget = document.getElementById('hipych-widget');
    const hipychTrigger = document.getElementById('hipych-trigger');
    
    if (hipychWidget && hipychWidget.classList.contains('active')) {
      hipychWidget.classList.remove('active');
      hipychTrigger.classList.remove('active');
      
      // Обновляем состояние в глобальном объекте если он существует
      if (window.hipychWidget && window.hipychWidget.isOpen) {
        window.hipychWidget.isOpen = false;
      }
    }
  }

  // Отправка сообщения
  async sendMessage(customMessage = null) {
    const input = document.getElementById('bro-cat-input');
    const message = customMessage || input.value.trim();
    
    if (!message) return;

    // Очищаем поле ввода
    if (!customMessage) {
      input.value = '';
      document.getElementById('bro-cat-send').disabled = true;
      document.getElementById('bro-cat-send').style.opacity = '0.5';
    }

    // Добавляем сообщение пользователя
    this.addMessage(message, 'user');

    // Показываем индикатор печатания
    this.showTyping();

    // ВРЕМЕННАЯ ЗАГЛУШКА API - УБИРАЕМ FETCH ЗАПРОС
    setTimeout(() => {
      this.hideTyping();
      const fakeResponse = `Мяу! Ты сказал: "${message}". Я пока не очень умный кот, но учусь! 🐾`;
      this.addMessage(fakeResponse, 'assistant');
    }, 1000);

    /* // УДАЛЯЕМ ИЛИ КОММЕНТИРУЕМ ОРИГИНАЛЬНЫЙ БЛОК TRY-CATCH
    try {
      // Отправляем запрос к Коту Бро через AI Studio API
      const response = await fetch(`${this.apiBaseUrl}/api/bro-cat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          user_id: this.sessionId,
          session_id: this.sessionId,
          source: 'ai_studio_website'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Скрываем индикатор печатания
      this.hideTyping();
      
      // Добавляем ответ
      this.addMessage(data.response || 'Мяу! Что-то пошло не так... 😿', 'assistant');
      
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      this.hideTyping();
      
      // Показываем сообщение об ошибке
      this.addMessage('Мяу! Кажется, у меня проблемы с подключением... 🙀 Попробуй позже!', 'assistant');
    }
    */
  }

  // Добавление сообщения в чат
  addMessage(content, sender) {
    const messagesContainer = document.getElementById('bro-cat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `bro-cat-message ${sender}`;
    
    messageElement.innerHTML = `
      <div class="bro-cat-message-avatar"></div>
      <div class="bro-cat-message-content">${content}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // Анимация появления (opacity и transform)
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(20px)'; // ВОЗВРАЩАЕМ TRANSFORM
    
    setTimeout(() => {
      messageElement.style.transition = 'all 0.3s ease'; // АНИМИРУЕМ ВСЁ
      messageElement.style.opacity = '1';
      messageElement.style.transform = 'translateY(0)'; // ВОЗВРАЩАЕМ TRANSFORM
      
      // Прокрутка к последнему сообщению ПОСЛЕ анимации, с нулевой задержкой setTimeout
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    }, 50);
  }

  // Показать индикатор печатания
  showTyping() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const messagesContainer = document.getElementById('bro-cat-messages');
    
    const typingElement = document.createElement('div');
    typingElement.className = 'bro-cat-typing';
    typingElement.id = 'bro-cat-typing';
    typingElement.innerHTML = `
      <div class="bro-cat-message-avatar"></div>
      <div class="bro-cat-typing-content">
        <div class="bro-cat-typing-dots">
          <span class="bro-cat-typing-dot"></span>
          <span class="bro-cat-typing-dot"></span>
          <span class="bro-cat-typing-dot"></span>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingElement);
    typingElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  // Скрыть индикатор печатания
  hideTyping() {
    const typingElement = document.getElementById('bro-cat-typing');
    if (typingElement) {
      typingElement.remove();
    }
    this.isTyping = false;
  }

  // Проверка подключения
  async checkConnection() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/status`);
      const isOnline = response.ok;
      this.updateConnectionStatus(isOnline);
    } catch (error) {
      this.updateConnectionStatus(false);
    }
  }

  // Обновление статуса подключения
  updateConnectionStatus(isOnline) {
    const statusElement = document.getElementById('bro-cat-status');
    if (statusElement) {
      statusElement.className = `bro-cat-status ${isOnline ? 'online' : 'offline'}`;
      statusElement.title = isOnline ? 'Кот в сети' : 'Кот спит';
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.broCatWidget = new BroCatWidget();
}); 