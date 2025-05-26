/**
 * UI компонент для мультиагентного чата AI Studio
 * Современный Glass UI дизайн с поддержкой множественных агентов
 */

class MultiAgentChatUI {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.isVisible = false;
        
        // Настройки
        this.options = {
            theme: options.theme || 'glass',
            position: options.position || 'center',
            width: options.width || '800px',
            height: options.height || '600px',
            showParticipants: options.showParticipants !== false,
            enableMentions: options.enableMentions !== false,
            enableExport: options.enableExport !== false,
            ...options
        };
        
        // Инициализация чат-хаба
        this.chatHub = new MultiAgentChatHub({
            onMessageReceived: (message) => this.displayMessage(message),
            onAgentActivated: (agent) => this.updateParticipants(),
            onAgentResponse: (message) => this.displayMessage(message)
        });
        
        // Регистрация агентов
        this.registerAgents();
        
        // Создание UI
        this.createUI();
        
        console.log('🎨 MultiAgentChatUI инициализирован');
    }

    /**
     * Регистрация всех агентов в системе
     */
    registerAgents() {
        const agents = [
            {
                id: 'health-assistant',
                name: 'Доктор Анна',
                avatar: '🩺',
                color: '#10b981',
                triggers: ['здоровье', 'медицина', 'анализ', 'симптомы', 'врач', 'лечение', 'диагноз', 'анна'],
                personality: 'Заботливый медицинский консультант',
                apiEndpoint: '/api/chat/health-assistant'
            },
            {
                id: 'business-advisor',
                name: 'Максим Стратег',
                avatar: '📈',
                color: '#3b82f6',
                triggers: ['бизнес', 'стратегия', 'прибыль', 'инвестиции', 'рынок', 'конкуренты', 'максим'],
                personality: 'Опытный бизнес-стратег',
                apiEndpoint: '/api/chat/business-advisor'
            },
            {
                id: 'support-agent',
                name: 'Техно-Саша',
                avatar: '🎧',
                color: '#8b5cf6',
                triggers: ['техника', 'настройка', 'интеграция', 'код', 'разработка', 'API', 'саша'],
                personality: 'Дружелюбный техгуру',
                apiEndpoint: '/api/chat/support-agent'
            },
            {
                id: 'content-creator',
                name: 'Креатив-Лиза',
                avatar: '✍️',
                color: '#f59e0b',
                triggers: ['контент', 'реклама', 'пост', 'текст', 'маркетинг', 'бренд', 'лиза'],
                personality: 'Творческая муза контента',
                apiEndpoint: '/api/chat/content-creator'
            },
            {
                id: 'hipych-ai',
                name: 'Хипыч AI',
                avatar: '🎮',
                color: '#e11d48',
                triggers: ['хипыч', 'игры', 'геймер', 'стрим', 'технологии', 'AI', 'круто', 'кайф'],
                personality: 'Геймер и AI-энтузиаст',
                apiEndpoint: '/api/hipych/chat'
            },
            {
                id: 'entertainment-bot',
                name: 'Кот Бро',
                avatar: '🐱',
                color: '#ef4444',
                triggers: ['кот', 'развлечение', 'игра', 'мем', 'шутка', 'бро'],
                personality: 'Весёлый кот-компаньон',
                apiEndpoint: '/chat'
            }
        ];

        agents.forEach(agent => {
            this.chatHub.registerAgent(agent.id, agent);
        });
    }

    /**
     * Создание пользовательского интерфейса
     */
    createUI() {
        // Основной контейнер чата
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'multiagent-chat-overlay';
        this.chatContainer.style.display = 'none';
        
        this.chatContainer.innerHTML = `
            <div class="multiagent-chat-window">
                <div class="chat-header">
                    <div class="chat-title">
                        <span class="title-icon">🤖</span>
                        <span class="title-text">Мультиагентный чат AI Studio</span>
                    </div>
                    <div class="chat-controls">
                        <button class="control-btn export-btn" title="Экспорт диалога">📥</button>
                        <button class="control-btn clear-btn" title="Очистить чат">🧹</button>
                        <button class="control-btn close-btn" title="Закрыть">✕</button>
                    </div>
                </div>
                
                <div class="chat-body">
                    <div class="participants-panel">
                        <h4>Участники</h4>
                        <div class="participants-list"></div>
                    </div>
                    
                    <div class="chat-main">
                        <div class="messages-container">
                            <div class="welcome-message">
                                <div class="welcome-icon">🚀</div>
                                <h3>Добро пожаловать в мультиагентный чат!</h3>
                                <p>Здесь работает команда AI-экспертов. Задайте вопрос, и релевантные специалисты автоматически подключатся к обсуждению.</p>
                                <div class="quick-actions">
                                    <button class="quick-btn" onclick="this.sendQuickMessage('Хочу открыть бизнес')">💼 Бизнес-вопрос</button>
                                    <button class="quick-btn" onclick="this.sendQuickMessage('Нужна техническая помощь')">🔧 Техподдержка</button>
                                    <button class="quick-btn" onclick="this.sendQuickMessage('Создать контент')">✨ Контент</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="input-container">
                            <div class="input-wrapper">
                                <input type="text" class="message-input" placeholder="Напишите сообщение... (используйте @имя для обращения к конкретному агенту)" maxlength="1000">
                                <button class="send-btn">📤</button>
                            </div>
                            <div class="input-hints">
                                <span class="hint">💡 Совет: Попробуйте @анна для медицинских вопросов</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем стили
        this.addStyles();
        
        // Добавляем в контейнер
        this.container.appendChild(this.chatContainer);
        
        // Привязываем события
        this.bindEvents();
        
        // Инициализируем участников
        this.updateParticipants();
    }

    /**
     * Добавление стилей для чата
     */
    addStyles() {
        if (document.getElementById('multiagent-chat-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'multiagent-chat-styles';
        styles.textContent = `
            .multiagent-chat-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .multiagent-chat-window {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(25px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                width: ${this.options.width};
                height: ${this.options.height};
                max-width: 95vw;
                max-height: 95vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .chat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 25px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.05);
            }
            
            .chat-title {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .title-icon {
                font-size: 1.5rem;
            }
            
            .chat-controls {
                display: flex;
                gap: 10px;
            }
            
            .control-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 8px 12px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
            }
            
            .control-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }
            
            .chat-body {
                display: flex;
                flex: 1;
                overflow: hidden;
            }
            
            .participants-panel {
                width: 200px;
                background: rgba(255, 255, 255, 0.05);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                padding: 20px;
                overflow-y: auto;
            }
            
            .participants-panel h4 {
                margin-bottom: 15px;
                color: #10b981;
                font-size: 1rem;
            }
            
            .participant-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                border-radius: 10px;
                margin-bottom: 8px;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .participant-item:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .participant-item.active {
                background: rgba(16, 185, 129, 0.2);
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            
            .participant-avatar {
                font-size: 1.2rem;
            }
            
            .participant-info {
                flex: 1;
            }
            
            .participant-name {
                font-size: 0.9rem;
                font-weight: 500;
                margin-bottom: 2px;
            }
            
            .participant-status {
                font-size: 0.7rem;
                opacity: 0.7;
            }
            
            .chat-main {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            
            .messages-container {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                scroll-behavior: smooth;
            }
            
            .welcome-message {
                text-align: center;
                padding: 40px 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                margin-bottom: 20px;
            }
            
            .welcome-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }
            
            .welcome-message h3 {
                margin-bottom: 10px;
                color: #10b981;
            }
            
            .welcome-message p {
                opacity: 0.9;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            
            .quick-actions {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .quick-btn {
                background: rgba(16, 185, 129, 0.2);
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 20px;
                padding: 8px 16px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            .quick-btn:hover {
                background: rgba(16, 185, 129, 0.3);
                transform: translateY(-2px);
            }
            
            .message {
                display: flex;
                margin-bottom: 15px;
                animation: slideIn 0.3s ease;
            }
            
            .message.user {
                justify-content: flex-end;
            }
            
            .message-content {
                max-width: 70%;
                padding: 12px 16px;
                border-radius: 15px;
                position: relative;
            }
            
            .message.user .message-content {
                background: rgba(16, 185, 129, 0.3);
                border: 1px solid rgba(16, 185, 129, 0.4);
            }
            
            .message.agent .message-content {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .message-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 5px;
                font-size: 0.85rem;
                opacity: 0.8;
            }
            
            .message-avatar {
                font-size: 1rem;
            }
            
            .message-text {
                line-height: 1.4;
                word-wrap: break-word;
            }
            
            .message-time {
                font-size: 0.7rem;
                opacity: 0.6;
                margin-top: 5px;
            }
            
            .input-container {
                padding: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.05);
            }
            
            .input-wrapper {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .message-input {
                flex: 1;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 25px;
                padding: 12px 20px;
                color: white;
                font-size: 1rem;
                outline: none;
                transition: all 0.3s ease;
            }
            
            .message-input::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
            
            .message-input:focus {
                border-color: #10b981;
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
            }
            
            .send-btn {
                background: #10b981;
                border: none;
                border-radius: 50%;
                width: 45px;
                height: 45px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .send-btn:hover {
                background: #059669;
                transform: scale(1.1);
            }
            
            .send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            .input-hints {
                margin-top: 8px;
                text-align: center;
            }
            
            .hint {
                font-size: 0.8rem;
                opacity: 0.6;
            }
            
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                margin-bottom: 10px;
                animation: pulse 1.5s infinite;
            }
            
            .typing-dots {
                display: flex;
                gap: 3px;
            }
            
            .typing-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #10b981;
                animation: bounce 1.4s infinite ease-in-out;
            }
            
            .typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .typing-dot:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { 
                    opacity: 0; 
                    transform: translateY(20px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            @keyframes bounce {
                0%, 80%, 100% { 
                    transform: scale(0);
                } 
                40% { 
                    transform: scale(1);
                }
            }
            
            /* Адаптивность */
            @media (max-width: 768px) {
                .multiagent-chat-window {
                    width: 95vw;
                    height: 95vh;
                }
                
                .participants-panel {
                    width: 150px;
                }
                
                .chat-header {
                    padding: 15px 20px;
                }
                
                .chat-title {
                    font-size: 1rem;
                }
                
                .title-text {
                    display: none;
                }
                
                .message-content {
                    max-width: 85%;
                }
                
                .quick-actions {
                    flex-direction: column;
                    align-items: center;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        const messageInput = this.chatContainer.querySelector('.message-input');
        const sendBtn = this.chatContainer.querySelector('.send-btn');
        const closeBtn = this.chatContainer.querySelector('.close-btn');
        const clearBtn = this.chatContainer.querySelector('.clear-btn');
        const exportBtn = this.chatContainer.querySelector('.export-btn');
        
        // Отправка сообщения
        const sendMessage = () => {
            const message = messageInput.value.trim();
            if (message) {
                this.sendMessage(message);
                messageInput.value = '';
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Закрытие чата
        closeBtn.addEventListener('click', () => this.hide());
        
        // Очистка чата
        clearBtn.addEventListener('click', () => this.clearChat());
        
        // Экспорт диалога
        exportBtn.addEventListener('click', () => this.exportChat());
        
        // Закрытие по клику вне окна
        this.chatContainer.addEventListener('click', (e) => {
            if (e.target === this.chatContainer) {
                this.hide();
            }
        });
        
        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            if (this.isVisible && e.key === 'Escape') {
                this.hide();
            }
        });
    }

    /**
     * Отправка сообщения
     */
    async sendMessage(message) {
        // Отображаем сообщение пользователя
        this.displayMessage({
            text: message,
            senderId: 'user',
            timestamp: new Date()
        });
        
        // Показываем индикатор печати
        this.showTypingIndicator();
        
        // Обрабатываем сообщение через чат-хаб
        await this.chatHub.processMessage(message, 'user');
        
        // Скрываем индикатор печати
        this.hideTypingIndicator();
    }

    /**
     * Отображение сообщения в чате
     */
    displayMessage(message) {
        const messagesContainer = this.chatContainer.querySelector('.messages-container');
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        
        // Удаляем приветственное сообщение при первом сообщении
        if (welcomeMessage && message.senderId === 'user') {
            welcomeMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.senderId === 'user' ? 'user' : 'agent'}`;
        
        const agent = message.senderId !== 'user' ? this.chatHub.agents.get(message.senderId) : null;
        
        messageElement.innerHTML = `
            <div class="message-content" ${agent ? `style="border-left: 3px solid ${agent.color}"` : ''}>
                ${agent ? `
                    <div class="message-header">
                        <span class="message-avatar">${agent.avatar}</span>
                        <span class="message-sender">${agent.name}</span>
                    </div>
                ` : ''}
                <div class="message-text">${this.formatMessage(message.text)}</div>
                <div class="message-time">${this.formatTime(message.timestamp)}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Форматирование сообщения (поддержка упоминаний)
     */
    formatMessage(text) {
        return text.replace(/@(\w+)/g, '<span style="color: #10b981; font-weight: bold;">@$1</span>');
    }

    /**
     * Форматирование времени
     */
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Показать индикатор печати
     */
    showTypingIndicator() {
        const messagesContainer = this.chatContainer.querySelector('.messages-container');
        
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.innerHTML = `
            <span>🤖 Агенты думают...</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Скрыть индикатор печати
     */
    hideTypingIndicator() {
        const typingIndicator = this.chatContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Обновление списка участников
     */
    updateParticipants() {
        const participantsList = this.chatContainer.querySelector('.participants-list');
        const agents = this.chatHub.getAllAgents();
        
        participantsList.innerHTML = agents.map(agent => `
            <div class="participant-item ${agent.isActive ? 'active' : ''}" 
                 data-agent-id="${agent.id}"
                 onclick="this.mentionAgent('${agent.id}')">
                <div class="participant-avatar">${agent.avatar}</div>
                <div class="participant-info">
                    <div class="participant-name">${agent.name}</div>
                    <div class="participant-status">
                        ${agent.isActive ? '🟢 Активен' : '⚪ Ожидает'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Упоминание агента
     */
    mentionAgent(agentId) {
        const agent = this.chatHub.agents.get(agentId);
        if (agent) {
            const messageInput = this.chatContainer.querySelector('.message-input');
            const mention = `@${agent.name.toLowerCase().replace(/\s+/g, '')} `;
            messageInput.value = mention + messageInput.value;
            messageInput.focus();
        }
    }

    /**
     * Быстрое сообщение
     */
    sendQuickMessage(message) {
        this.sendMessage(message);
    }

    /**
     * Очистка чата
     */
    clearChat() {
        if (confirm('Очистить историю чата?')) {
            this.chatHub.clearChat();
            const messagesContainer = this.chatContainer.querySelector('.messages-container');
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">🚀</div>
                    <h3>Чат очищен!</h3>
                    <p>Готов к новому диалогу с командой AI-экспертов.</p>
                </div>
            `;
            this.updateParticipants();
        }
    }

    /**
     * Экспорт диалога
     */
    exportChat() {
        const chatData = this.chatHub.exportChat();
        const blob = new Blob([JSON.stringify(chatData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `multiagent-chat-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Показать чат
     */
    show() {
        this.chatContainer.style.display = 'flex';
        this.isVisible = true;
        
        // Фокус на поле ввода
        setTimeout(() => {
            const messageInput = this.chatContainer.querySelector('.message-input');
            messageInput.focus();
        }, 300);
    }

    /**
     * Скрыть чат
     */
    hide() {
        this.chatContainer.style.display = 'none';
        this.isVisible = false;
    }

    /**
     * Переключить видимость чата
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiAgentChatUI;
} 