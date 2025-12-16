/**
 * Хипыч - Геймерский AI-ассистент AI Studio
 * Интеграция с внешним API на localhost:3002
 */

class HipychWidget {
  constructor() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:7',message:'HipychWidget constructor entry',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    this.isOpen = false;
    this.isTyping = false;
    this.sessionId = this.generateSessionId();
    this.apiBaseUrl = 'http://localhost:3001'; // Проксирование через AI Studio API
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:12',message:'HipychWidget constructor before init',data:{sessionId:this.sessionId,apiBaseUrl:this.apiBaseUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    this.init();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:13',message:'HipychWidget constructor exit',data:{sessionId:this.sessionId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }

  // Генерация уникального ID сессии
  generateSessionId() {
    return 'hipych_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Инициализация виджета
  init() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:21',message:'init entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    this.createWidget();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:23',message:'createWidget completed',data:{triggerExists:!!document.getElementById('hipych-trigger'),widgetExists:!!document.getElementById('hipych-widget')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    this.bindEvents();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:25',message:'bindEvents completed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    this.checkConnection();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:26',message:'init exit',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
  }

  // Создание HTML структуры виджета
  createWidget() {
    // Кнопка вызова Хипыча
    const triggerButton = document.createElement('button');
    triggerButton.className = 'hipych-trigger';
    triggerButton.id = 'hipych-trigger';
    triggerButton.innerHTML = '';
    triggerButton.title = 'Хипыч - Демо AI помощник AI Studio';
    document.body.appendChild(triggerButton);

    // Виджет чата
    const widget = document.createElement('div');
    widget.className = 'hipych-widget';
    widget.id = 'hipych-widget';
    widget.innerHTML = `
      <div class="hipych-header">
        <div class="hipych-info">
          <div class="hipych-avatar"></div>
          <div>
            <div class="hipych-title">Хипыч AI</div>
            <div class="hipych-subtitle">Демо-ассистент AI Studio</div>
          </div>
        </div>
        <div class="hipych-status" id="hipych-status"></div>
        <button class="hipych-close" id="hipych-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="hipych-messages" id="hipych-messages">
        <div class="hipych-message assistant">
          <div class="hipych-message-avatar"></div>
          <div class="hipych-message-content">
            Чё кого, гном! 🎮 Попал на тусовку Хипыча от AI Studio! Готов показать, как работают наши крутые боты! 🚀
          </div>
        </div>
      </div>
      
      <div class="hipych-quick-actions">
        <button class="hipych-quick-btn" data-question="Что умеют ваши боты?">🤖 Возможности</button>
        <button class="hipych-quick-btn" data-question="Сколько стоит бот?">💰 Цены</button>
        <button class="hipych-quick-btn" data-question="Покажи демо">🎮 Демо</button>
        <button class="hipych-quick-btn" data-question="Как заказать?">📞 Заказ</button>
      </div>
      
      <div class="hipych-input-container">
        <input type="text" 
               class="hipych-input" 
               id="hipych-input" 
               placeholder="Напиши что-нибудь Хипычу..."
               maxlength="500">
        <button class="hipych-send" id="hipych-send" disabled>
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(widget);
  }

  // Привязка событий
  bindEvents() {
    const trigger = document.getElementById('hipych-trigger');
    const widget = document.getElementById('hipych-widget');
    const closeBtn = document.getElementById('hipych-close');
    const input = document.getElementById('hipych-input');
    const sendBtn = document.getElementById('hipych-send');
    const quickBtns = document.querySelectorAll('.hipych-quick-btn');

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

    // Закрытие при клике вне виджета
    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target) && !trigger.contains(e.target) && this.isOpen) {
        // Не закрываем автоматически, пользователь должен нажать крестик
      }
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:142',message:'openWidget entry',data:{isOpenBefore:this.isOpen},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    // Закрываем другие виджеты перед открытием Хипыча
    this.closeOtherWidgets();
    
    const widget = document.getElementById('hipych-widget');
    const trigger = document.getElementById('hipych-trigger');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:147',message:'openWidget before classList.add',data:{widgetExists:!!widget,triggerExists:!!trigger},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    widget.classList.add('active');
    trigger.classList.add('active');
    this.isOpen = true;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:151',message:'openWidget after classList.add',data:{isOpen:this.isOpen,widgetHasActive:widget.classList.contains('active'),triggerHasActive:trigger.classList.contains('active')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // Фокус на поле ввода
    setTimeout(() => {
      document.getElementById('hipych-input').focus();
    }, 300);
  }

  // Закрытие виджета
  closeWidget() {
    const widget = document.getElementById('hipych-widget');
    const trigger = document.getElementById('hipych-trigger');
    
    widget.classList.remove('active');
    trigger.classList.remove('active');
    this.isOpen = false;
  }

  // Закрытие других виджетов
  closeOtherWidgets() {
    // Закрываем виджет кота Бро если он открыт
    const broCatWidget = document.getElementById('bro-cat-widget');
    const broCatTrigger = document.getElementById('bro-cat-trigger');
    
    if (broCatWidget && broCatWidget.classList.contains('active')) {
      broCatWidget.classList.remove('active');
      broCatTrigger.classList.remove('active');
      
      // Обновляем состояние в глобальном объекте если он существует
      if (window.broCatWidget && window.broCatWidget.isOpen) {
        window.broCatWidget.isOpen = false;
      }
    }
  }

  // Отправка сообщения
  async sendMessage(customMessage = null) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:187',message:'sendMessage entry',data:{hasCustomMessage:!!customMessage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const input = document.getElementById('hipych-input');
    const message = customMessage || input.value.trim();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:190',message:'sendMessage message extracted',data:{messageLength:message.length,hasMessage:!!message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    if (!message) return;

    // Очищаем поле ввода
    if (!customMessage) {
      input.value = '';
      document.getElementById('hipych-send').disabled = true;
      document.getElementById('hipych-send').style.opacity = '0.5';
    }

    // Добавляем сообщение пользователя
    this.addMessage(message, 'user');

    // Показываем индикатор печатания
    this.showTyping();

    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:206',message:'sendMessage before fetch',data:{apiUrl:`${this.apiBaseUrl}/api/hipych/chat`,messageLength:message.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      // Отправляем запрос к Хипычу через AI Studio API
      const response = await fetch(`${this.apiBaseUrl}/api/hipych/chat`, {
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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:220',message:'sendMessage fetch response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      const data = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:222',message:'sendMessage data parsed',data:{hasResponse:!!data.response},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Скрываем индикатор печатания
      this.hideTyping();

      if (data.response) {
        // Добавляем ответ Хипыча
        this.addMessage(data.response, 'assistant');
        this.updateConnectionStatus(true);
      } else {
        throw new Error('Пустой ответ от сервера');
      }

    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:234',message:'sendMessage error caught',data:{errorName:error.name,errorMessage:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      console.error('Ошибка при отправке сообщения:', error);
      this.hideTyping();
      this.updateConnectionStatus(false);
      
      // Fallback ответ
      this.addMessage(
        'Упс! Что-то пошло не так 😅 Хипыч временно недоступен. Попробуй позже или свяжись с @Stivanovv напрямую!',
        'assistant'
      );
    }
  }

  // Добавление сообщения в чат
  addMessage(content, sender) {
    const messagesContainer = document.getElementById('hipych-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `hipych-message ${sender}`;
    
    const avatarClass = sender === 'user' ? 'hipych-message-avatar' : 'hipych-message-avatar';
    const avatarContent = sender === 'user' ? '👤' : '';
    
    messageDiv.innerHTML = `
      <div class="${avatarClass}">${avatarContent}</div>
      <div class="hipych-message-content">${content}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Прокрутка к последнему сообщению
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Показать индикатор печатания
  showTyping() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const messagesContainer = document.getElementById('hipych-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'hipych-typing';
    typingDiv.id = 'hipych-typing-indicator';
    typingDiv.innerHTML = `
      Хипыч печатает
      <div class="hipych-typing-dots">
        <div class="hipych-typing-dot"></div>
        <div class="hipych-typing-dot"></div>
        <div class="hipych-typing-dot"></div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Скрыть индикатор печатания
  hideTyping() {
    this.isTyping = false;
    const typingIndicator = document.getElementById('hipych-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Проверка подключения к Хипычу
  async checkConnection() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:300',message:'checkConnection entry',data:{apiUrl:`${this.apiBaseUrl}/api/hipych/status`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/hipych/status`);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:302',message:'checkConnection response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      this.updateConnectionStatus(response.ok);
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/123b5067-f4c4-44e8-8d77-9891ae5437b6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'hipych.js:305',message:'checkConnection error caught',data:{errorName:error.name,errorMessage:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      console.error('Ошибка проверки соединения:', error);
      this.updateConnectionStatus(false);
    }
  }

  // Обновление статуса подключения
  updateConnectionStatus(isOnline) {
    const statusIndicator = document.getElementById('hipych-status');
    if (statusIndicator) {
      statusIndicator.className = isOnline ? 'hipych-status' : 'hipych-status offline';
      statusIndicator.title = isOnline ? 'Хипыч онлайн' : 'Хипыч недоступен';
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Создаём экземпляр Хипыча на всех страницах
  console.log('🎮 Инициализация Хипыча...');
  window.hipychWidget = new HipychWidget();
  console.log('✅ Хипыч создан!');
  
  // Периодическая проверка подключения
  setInterval(() => {
    window.hipychWidget.checkConnection();
  }, 30000); // каждые 30 секунд
}); 