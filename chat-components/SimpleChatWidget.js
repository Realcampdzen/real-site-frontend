// Простой но красивый чат-виджет без внешних зависимостей
class SimpleChatWidget {
    constructor(options = {}) {
        this.botName = options.botName || "AI Assistant";
        this.botAvatar = options.botAvatar || "";
        this.theme = options.theme || "#6ea9d7";
        this.onSendMessage = options.onSendMessage || null;
        this.onClose = options.onClose || null;
        this.isVisible = options.isVisible || false;
        
        this.messages = [
            {
                id: '1',
                text: `Привет! Я ${this.botName}. Как дела? 👋`,
                isBot: true,
                timestamp: new Date()
            }
        ];
        
        this.isTyping = false;
        this.container = null;
        
        this.init();
    }

    init() {
        this.createWidget();
        this.setupEventListeners();
        if (this.isVisible) {
            this.show();
        }
    }

    createWidget() {
        // Создаем основной контейнер
        this.container = document.createElement('div');
        this.container.className = 'simple-chat-widget';
        this.container.style.cssText = `
            position: fixed;
            width: 350px;
            height: 500px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10000;
        `;

        // Создаем заголовок
        const header = document.createElement('div');
        header.className = 'chat-header';
        header.style.cssText = `
            background: ${this.theme};
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const headerInfo = document.createElement('div');
        headerInfo.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        if (this.botAvatar) {
            const avatar = document.createElement('img');
            avatar.src = this.botAvatar;
            avatar.alt = this.botName;
            avatar.style.cssText = `
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
            `;
            headerInfo.appendChild(avatar);
        }

        const headerText = document.createElement('div');
        headerText.innerHTML = `
            <div style="font-weight: bold;">${this.botName}</div>
            <div style="font-size: 12px; opacity: 0.8;" id="status-text">онлайн</div>
        `;
        headerInfo.appendChild(headerText);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
        `;
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = 'transparent';
        });
        closeButton.addEventListener('click', () => {
            this.hide();
            if (this.onClose) this.onClose();
        });

        header.appendChild(headerInfo);
        header.appendChild(closeButton);

        // Создаем область сообщений
        const messagesArea = document.createElement('div');
        messagesArea.className = 'messages-area';
        messagesArea.style.cssText = `
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%);
        `;

        // Создаем контейнер для сообщений
        const messagesList = document.createElement('div');
        messagesList.className = 'messages-list';
        messagesList.id = 'messages-list';
        messagesArea.appendChild(messagesList);

        // Создаем индикатор печатания
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.style.cssText = `
            padding: 8px 16px;
            font-size: 14px;
            color: #64748b;
            font-style: italic;
            display: none;
        `;
        typingIndicator.textContent = `${this.botName} печатает...`;
        messagesArea.appendChild(typingIndicator);

        // Создаем поле ввода
        const inputArea = document.createElement('div');
        inputArea.className = 'input-area';
        inputArea.style.cssText = `
            padding: 16px;
            border-top: 1px solid #e2e8f0;
            background: white;
        `;

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
        `;

        const messageInput = document.createElement('input');
        messageInput.type = 'text';
        messageInput.placeholder = `Напишите сообщение ${this.botName}...`;
        messageInput.className = 'message-input';
        messageInput.id = 'message-input';
        messageInput.style.cssText = `
            flex: 1;
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
        `;
        messageInput.addEventListener('focus', () => {
            messageInput.style.borderColor = this.theme;
        });
        messageInput.addEventListener('blur', () => {
            messageInput.style.borderColor = '#e2e8f0';
        });

        const sendButton = document.createElement('button');
        sendButton.innerHTML = '➤';
        sendButton.className = 'send-button';
        sendButton.style.cssText = `
            background: ${this.theme};
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            font-size: 16px;
        `;
        sendButton.addEventListener('mouseenter', () => {
            sendButton.style.transform = 'scale(1.1)';
        });
        sendButton.addEventListener('mouseleave', () => {
            sendButton.style.transform = 'scale(1)';
        });

        inputContainer.appendChild(messageInput);
        inputContainer.appendChild(sendButton);
        inputArea.appendChild(inputContainer);

        // Собираем виджет
        this.container.appendChild(header);
        this.container.appendChild(messagesArea);
        this.container.appendChild(inputArea);

        // Добавляем в DOM
        document.body.appendChild(this.container);

        // Рендерим начальные сообщения
        this.renderMessages();
    }

    setupEventListeners() {
        const messageInput = this.container.querySelector('#message-input');
        const sendButton = this.container.querySelector('.send-button');

        const sendMessage = () => {
            const message = messageInput.value.trim();
            if (message) {
                this.handleSendMessage(message);
                messageInput.value = '';
            }
        };

        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    async handleSendMessage(message) {
        // Добавляем сообщение пользователя
        const userMessage = {
            id: Date.now().toString(),
            text: message,
            isBot: false,
            timestamp: new Date()
        };

        this.messages.push(userMessage);
        this.renderMessages();
        this.setTyping(true);

        try {
            if (this.onSendMessage) {
                const botResponse = await this.onSendMessage(message);
                
                const botMessage = {
                    id: (Date.now() + 1).toString(),
                    text: botResponse || "Извините, произошла ошибка. Попробуйте еще раз.",
                    isBot: true,
                    timestamp: new Date()
                };

                this.messages.push(botMessage);
                this.renderMessages();
            }
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
            
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                text: "Извините, произошла ошибка. Попробуйте еще раз.",
                isBot: true,
                timestamp: new Date()
            };

            this.messages.push(errorMessage);
            this.renderMessages();
        } finally {
            this.setTyping(false);
        }
    }

    renderMessages() {
        const messagesList = this.container.querySelector('#messages-list');
        messagesList.innerHTML = '';

        this.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.isBot ? 'bot-message' : 'user-message'}`;
            
            const messageStyle = message.isBot ? `
                display: flex;
                margin-bottom: 16px;
                align-items: flex-start;
                gap: 8px;
            ` : `
                display: flex;
                margin-bottom: 16px;
                justify-content: flex-end;
            `;
            
            messageElement.style.cssText = messageStyle;

            if (message.isBot && this.botAvatar) {
                const avatar = document.createElement('img');
                avatar.src = this.botAvatar;
                avatar.style.cssText = `
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-top: 4px;
                `;
                messageElement.appendChild(avatar);
            }

            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.style.cssText = message.isBot ? `
                background: #f1f5f9;
                color: #334155;
                padding: 12px 16px;
                border-radius: 18px 18px 18px 4px;
                max-width: 70%;
                word-wrap: break-word;
                line-height: 1.4;
            ` : `
                background: ${this.theme};
                color: white;
                padding: 12px 16px;
                border-radius: 18px 18px 4px 18px;
                max-width: 70%;
                word-wrap: break-word;
                line-height: 1.4;
            `;

            bubble.textContent = message.text;
            messageElement.appendChild(bubble);
            messagesList.appendChild(messageElement);
        });

        // Прокручиваем вниз
        setTimeout(() => {
            const messagesArea = this.container.querySelector('.messages-area');
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }, 100);
    }

    setTyping(isTyping) {
        this.isTyping = isTyping;
        const typingIndicator = this.container.querySelector('#typing-indicator');
        const statusText = this.container.querySelector('#status-text');
        
        if (isTyping) {
            typingIndicator.style.display = 'block';
            statusText.textContent = 'печатает...';
        } else {
            typingIndicator.style.display = 'none';
            statusText.textContent = 'онлайн';
        }
    }

    show() {
        this.isVisible = true;
        this.container.style.opacity = '1';
        this.container.style.visibility = 'visible';
        this.container.style.transform = 'translateY(0) scale(1)';
        
        // Фокус на поле ввода
        setTimeout(() => {
            const input = this.container.querySelector('#message-input');
            if (input) input.focus();
        }, 300);
    }

    hide() {
        this.isVisible = false;
        this.container.style.opacity = '0';
        this.container.style.visibility = 'hidden';
        this.container.style.transform = 'translateY(20px) scale(0.95)';
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Экспортируем класс
window.SimpleChatWidget = SimpleChatWidget; 