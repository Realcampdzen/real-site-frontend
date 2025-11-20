// Glass UI чат-виджет с современными эффектами
class GlassUIWidget {
    constructor(options = {}) {
        this.botName = options.botName || "AI Assistant";
        this.botAvatar = options.botAvatar || "";
        this.theme = options.theme || "#6ea9d7";
        this.position = options.position || { bottom: '20px', right: '20px' };
        this.onSendMessage = options.onSendMessage || null;
        this.onClose = options.onClose || null;
        this.isVisible = options.isVisible || false;
        
        // Вычисляем z-index на основе позиции (чем выше, тем больше z-index)
        const bottomValue = parseInt(this.position.bottom);
        this.zIndex = 10000 + Math.floor(bottomValue / 10); // Хипыч: 10010, Кот Бро: 10025
        
        this.messages = [
            {
                id: '1',
                text: `Привет! Я ${this.botName}. Готов помочь! ✨`,
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
        // Создаем основной контейнер с Glass UI эффектами
        this.container = document.createElement('div');
        this.container.className = 'glass-ui-widget';
        this.container.id = `glass-ui-widget-${Date.now()}`;
        this.container.style.cssText = `
            position: fixed;
            bottom: ${this.position.bottom};
            right: ${this.position.right};
            width: 380px;
            height: 450px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(255, 255, 255, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            opacity: 0;
            visibility: hidden;
            transform: translateY(30px) scale(0.9);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: ${this.zIndex};
            max-width: calc(100vw - 40px);
            max-height: calc(100vh - 40px);
        `;

        // Создаем заголовок с градиентом
        const header = document.createElement('div');
        header.className = 'glass-chat-header';
        header.style.cssText = `
            background: linear-gradient(135deg, ${this.theme}dd, ${this.theme}aa);
            backdrop-filter: blur(15px);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            overflow: hidden;
        `;

        // Добавляем анимированный фон в заголовок
        const headerBg = document.createElement('div');
        headerBg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: headerShine 3s ease-in-out infinite;
        `;
        header.appendChild(headerBg);

        const headerInfo = document.createElement('div');
        headerInfo.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            position: relative;
            z-index: 1;
        `;

        if (this.botAvatar) {
            const avatarContainer = document.createElement('div');
            avatarContainer.style.cssText = `
                position: relative;
                width: 40px;
                height: 40px;
            `;

            const avatar = document.createElement('img');
            avatar.src = this.botAvatar;
            avatar.alt = this.botName;
            avatar.style.cssText = `
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid rgba(255, 255, 255, 0.3);
            `;

            const avatarGlow = document.createElement('div');
            avatarGlow.style.cssText = `
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border-radius: 50%;
                background: linear-gradient(45deg, ${this.theme}, transparent, ${this.theme});
                animation: avatarRotate 4s linear infinite;
                z-index: -1;
            `;

            avatarContainer.appendChild(avatarGlow);
            avatarContainer.appendChild(avatar);
            headerInfo.appendChild(avatarContainer);
        }

        const headerText = document.createElement('div');
        headerText.innerHTML = `
            <div style="font-weight: 700; font-size: 16px;">${this.botName}</div>
            <div style="font-size: 12px; opacity: 0.9;" id="glass-status-text">
                <span id="status-indicator" style="display: inline-block; width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 6px; animation: statusPulse 2s infinite;"></span>
                онлайн
            </div>
        `;
        headerInfo.appendChild(headerText);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
        `;
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
            closeButton.style.transform = 'scale(1.1)';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.background = 'rgba(255, 255, 255, 0.1)';
            closeButton.style.transform = 'scale(1)';
        });
        closeButton.addEventListener('click', () => {
            this.hide();
            if (this.onClose) this.onClose();
        });

        header.appendChild(headerInfo);
        header.appendChild(closeButton);

        // Создаем область сообщений с улучшенным дизайном
        const messagesArea = document.createElement('div');
        messagesArea.className = 'glass-messages-area';
        messagesArea.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.05) 0%, 
                rgba(255, 255, 255, 0.02) 100%);
            position: relative;
        `;

        // Добавляем декоративные элементы в фон
        const bgDecor = document.createElement('div');
        bgDecor.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
            pointer-events: none;
        `;
        messagesArea.appendChild(bgDecor);

        // Создаем контейнер для сообщений
        const messagesList = document.createElement('div');
        messagesList.className = 'glass-messages-list';
        messagesList.id = 'glass-messages-list';
        messagesList.style.cssText = `
            position: relative;
            z-index: 1;
        `;
        messagesArea.appendChild(messagesList);

        // Создаем улучшенный индикатор печатания
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'glass-typing-indicator';
        typingIndicator.id = 'glass-typing-indicator';
        typingIndicator.style.cssText = `
            padding: 15px 20px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            font-style: italic;
            display: none;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            margin: 10px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            z-index: 1;
        `;
        
        const typingDots = document.createElement('span');
        typingDots.innerHTML = `
            ${this.botName} печатает
            <span style="animation: typingDots 1.5s infinite;">...</span>
        `;
        typingIndicator.appendChild(typingDots);
        messagesArea.appendChild(typingIndicator);

        // Создаем улучшенное поле ввода
        const inputArea = document.createElement('div');
        inputArea.className = 'glass-input-area';
        inputArea.style.cssText = `
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        `;

        // Добавляем быстрые кнопки
        const quickButtons = document.createElement('div');
        quickButtons.className = 'glass-quick-buttons';
        quickButtons.id = 'glass-quick-buttons';
        quickButtons.style.cssText = `
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
            flex-wrap: wrap;
            justify-content: center;
        `;

        // Создаем быстрые кнопки в зависимости от бота
        const quickButtonsData = this.botName === 'Кот Бро' ? [
            { text: '🎪 Как работаешь?', question: 'Покажи как ты работаешь' },
            { text: '💰 Сколько стоишь?', question: 'Сколько стоит такой бот?' },
            { text: '🚀 Хочу такого!', question: 'Хочу заказать такого же бота' }
        ] : this.botName === 'Хипыч' ? [
            { text: '🎥 Настройка стрима', question: 'Помоги настроить стрим' },
            { text: '🔧 Техподдержка', question: 'Нужна техническая помощь' },
            { text: '📈 Раскрутка канала', question: 'Как набрать больше зрителей?' }
        ] : this.botName === 'НейроVалюша' ? [
            { text: '🌈 О лагере', question: 'Расскажи про Реальный Лагерь' },
            { text: '📚 Программа', question: 'Чему учат в лагере и 4К навыкам?' },
            { text: '🎯 Развитие', question: 'Как стать вожатым и развиваться?' }
        ] : [
            { text: '🧠 Возможности', question: 'Что ты умеешь?' },
            { text: '💡 Идеи', question: 'Дай совет для бизнеса' },
            { text: '🚀 Проекты', question: 'Расскажи о проектах' }
        ];

        quickButtonsData.forEach(buttonData => {
            const quickBtn = document.createElement('button');
            quickBtn.textContent = buttonData.text;
            quickBtn.className = 'glass-quick-btn';
            quickBtn.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 8px 12px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
                white-space: nowrap;
            `;
            
            quickBtn.addEventListener('mouseenter', () => {
                quickBtn.style.background = `linear-gradient(135deg, ${this.theme}40, ${this.theme}60)`;
                quickBtn.style.transform = 'translateY(-2px)';
                quickBtn.style.boxShadow = `0 4px 15px ${this.theme}30`;
            });
            
            quickBtn.addEventListener('mouseleave', () => {
                quickBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                quickBtn.style.transform = 'translateY(0)';
                quickBtn.style.boxShadow = 'none';
            });
            
            quickBtn.addEventListener('click', () => {
                const input = this.container.querySelector(`#glass-message-input-${this.botName.replace(/\s+/g, '-').toLowerCase()}`);
                if (input) {
                    input.value = buttonData.question;
                    // Скрываем быстрые кнопки после первого использования
                    quickButtons.style.display = 'none';
                    // Отправляем сообщение
                    this.handleSendMessage(buttonData.question);
                }
            });
            
            quickButtons.appendChild(quickBtn);
        });

        inputArea.appendChild(quickButtons);

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            display: flex;
            gap: 12px;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            padding: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        `;

        const messageInput = document.createElement('input');
        messageInput.type = 'text';
        messageInput.placeholder = `Напишите сообщение ${this.botName}...`;
        messageInput.className = 'glass-message-input';
        // Уникальный ID для каждого виджета
        messageInput.id = `glass-message-input-${this.botName.replace(/\s+/g, '-').toLowerCase()}`;
        messageInput.style.cssText = `
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
            background: transparent;
            color: white;
            transition: all 0.3s ease;
        `;
        messageInput.addEventListener('focus', () => {
            inputContainer.style.borderColor = `${this.theme}80`;
            inputContainer.style.boxShadow = `0 0 20px ${this.theme}40`;
        });
        messageInput.addEventListener('blur', () => {
            inputContainer.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            inputContainer.style.boxShadow = 'none';
        });

        const sendButton = document.createElement('button');
        sendButton.innerHTML = '🚀';
        sendButton.className = 'glass-send-button';
        sendButton.style.cssText = `
            background: linear-gradient(135deg, ${this.theme}, ${this.theme}dd);
            color: white;
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 16px;
            box-shadow: 0 4px 15px ${this.theme}40;
        `;
        sendButton.addEventListener('mouseenter', () => {
            sendButton.style.transform = 'scale(1.1) rotate(15deg)';
            sendButton.style.boxShadow = `0 8px 25px ${this.theme}60`;
        });
        sendButton.addEventListener('mouseleave', () => {
            sendButton.style.transform = 'scale(1) rotate(0deg)';
            sendButton.style.boxShadow = `0 4px 15px ${this.theme}40`;
        });

        inputContainer.appendChild(messageInput);
        inputContainer.appendChild(sendButton);
        inputArea.appendChild(inputContainer);

        // Собираем виджет
        this.container.appendChild(header);
        this.container.appendChild(messagesArea);
        this.container.appendChild(inputArea);

        // Добавляем CSS анимации
        this.addGlassUIStyles();

        // Добавляем в DOM
        document.body.appendChild(this.container);

        // Рендерим начальные сообщения
        this.renderMessages();
    }

    addGlassUIStyles() {
        const styles = `
            @keyframes headerShine {
                0%, 100% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
            }

            @keyframes avatarRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            @keyframes statusPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
            }

            @keyframes typingDots {
                0%, 20% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }

            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .glass-ui-widget::-webkit-scrollbar {
                width: 6px;
            }

            .glass-ui-widget::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
            }

            .glass-ui-widget::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 3px;
            }

            .glass-ui-widget::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }

            .glass-messages-area::-webkit-scrollbar {
                width: 4px;
            }

            .glass-messages-area::-webkit-scrollbar-track {
                background: transparent;
            }

            .glass-messages-area::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
            }

            /* Адаптивные стили для мобильных устройств - БЕЗ ПОЗИЦИОНИРОВАНИЯ */
            @media (max-width: 768px) {
                .glass-ui-widget {
                    max-width: calc(100vw - 20px) !important;
                    max-height: calc(100vh - 100px) !important;
                    border-radius: 20px !important;
                }
                
                .glass-ui-widget .glass-chat-header {
                    padding: 15px !important;
                }
                
                .glass-ui-widget .glass-messages-area {
                    padding: 15px !important;
                }
                
                .glass-ui-widget .glass-input-area {
                    padding: 15px !important;
                }
            }

            @media (max-width: 480px) {
                .glass-ui-widget {
                    max-width: calc(100vw - 10px) !important;
                    max-height: calc(100vh - 80px) !important;
                    border-radius: 16px !important;
                }
                
                .glass-ui-widget .glass-chat-header {
                    padding: 12px !important;
                }
                
                .glass-ui-widget .glass-messages-area {
                    padding: 12px !important;
                }
                
                .glass-ui-widget .glass-input-area {
                    padding: 12px !important;
                }
            }

            /* Сброс всех возможных конфликтующих стилей */
            .glass-ui-widget * {
                box-sizing: border-box;
            }
            
            .glass-ui-widget {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                line-height: normal !important;
                text-align: left !important;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        // Используем уникальный ID для каждого виджета
        const inputId = `glass-message-input-${this.botName.replace(/\s+/g, '-').toLowerCase()}`;
        const messageInput = this.container.querySelector(`#${inputId}`);
        const sendButton = this.container.querySelector('.glass-send-button');

        if (!messageInput || !sendButton) {
            console.error(`❌ GlassUIWidget: Не найдены элементы для ${this.botName}`, {
                messageInput: !!messageInput,
                sendButton: !!sendButton,
                inputId: inputId,
                container: this.container
            });
            return;
        }

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
        const messagesList = this.container.querySelector('#glass-messages-list');
        messagesList.innerHTML = '';

        this.messages.forEach((message, index) => {
            const messageElement = document.createElement('div');
            messageElement.className = `glass-message ${message.isBot ? 'bot-message' : 'user-message'}`;
            
            const messageStyle = message.isBot ? `
                display: flex;
                margin-bottom: 20px;
                align-items: flex-start;
                gap: 12px;
                animation: messageSlideIn 0.4s ease-out ${index * 0.1}s both;
            ` : `
                display: flex;
                margin-bottom: 20px;
                justify-content: flex-end;
                animation: messageSlideIn 0.4s ease-out ${index * 0.1}s both;
            `;
            
            messageElement.style.cssText = messageStyle;

            if (message.isBot && this.botAvatar) {
                const avatar = document.createElement('img');
                avatar.src = this.botAvatar;
                avatar.style.cssText = `
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-top: 4px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                `;
                messageElement.appendChild(avatar);
            }

            const bubble = document.createElement('div');
            bubble.className = 'glass-message-bubble';
            bubble.style.cssText = message.isBot ? `
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(15px);
                color: white;
                padding: 14px 18px;
                border-radius: 20px 20px 20px 6px;
                max-width: 75%;
                word-wrap: break-word;
                line-height: 1.5;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
            ` : `
                background: linear-gradient(135deg, ${this.theme}dd, ${this.theme});
                color: white;
                padding: 14px 18px;
                border-radius: 20px 20px 6px 20px;
                max-width: 75%;
                word-wrap: break-word;
                line-height: 1.5;
                box-shadow: 0 4px 15px ${this.theme}40;
                position: relative;
                overflow: hidden;
            `;

            // Добавляем блик для сообщений бота
            if (message.isBot) {
                const shine = document.createElement('div');
                shine.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    animation: messageShine 2s ease-in-out infinite;
                `;
                bubble.appendChild(shine);
            }

            const textContent = document.createElement('div');
            textContent.textContent = message.text;
            textContent.style.position = 'relative';
            textContent.style.zIndex = '1';
            bubble.appendChild(textContent);

            messageElement.appendChild(bubble);
            messagesList.appendChild(messageElement);
        });

        // Прокручиваем вниз с анимацией
        setTimeout(() => {
            const messagesArea = this.container.querySelector('.glass-messages-area');
            messagesArea.scrollTo({
                top: messagesArea.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    setTyping(isTyping) {
        this.isTyping = isTyping;
        const typingIndicator = this.container.querySelector('#glass-typing-indicator');
        const statusText = this.container.querySelector('#glass-status-text');
        
        if (isTyping) {
            typingIndicator.style.display = 'block';
            statusText.innerHTML = `
                <span id="status-indicator" style="display: inline-block; width: 6px; height: 6px; background: #fbbf24; border-radius: 50%; margin-right: 6px; animation: statusPulse 1s infinite;"></span>
                печатает...
            `;
        } else {
            typingIndicator.style.display = 'none';
            statusText.innerHTML = `
                <span id="status-indicator" style="display: inline-block; width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 6px; animation: statusPulse 2s infinite;"></span>
                онлайн
            `;
        }
    }

    show() {
        console.log(`%c🔮 GlassUIWidget.show() вызван для ${this.botName}`, 'color: #3b82f6; font-weight: bold;');
        console.log(`%c📍 Позиция: bottom: ${this.position.bottom}, right: ${this.position.right}, z-index: ${this.zIndex}`, 'color: #10b981;');
        
        this.isVisible = true;
        
        // Сбрасываем позиционирование к стандартным значениям
        this.resetPosition();
        
        this.container.style.opacity = '1';
        this.container.style.visibility = 'visible';
        this.container.style.transform = 'translateY(0) scale(1)';
        
        console.log(`%c✅ ${this.botName} чат показан с z-index: ${this.zIndex}`, 'color: #10b981; font-weight: bold;');
        
        // Фокус на поле ввода с задержкой
        setTimeout(() => {
            const inputId = `glass-message-input-${this.botName.replace(/\s+/g, '-').toLowerCase()}`;
            const input = this.container.querySelector(`#${inputId}`);
            if (input) input.focus();
        }, 400);
    }

    hide() {
        this.isVisible = false;
        this.container.style.opacity = '0';
        this.container.style.visibility = 'hidden';
        this.container.style.transform = 'translateY(30px) scale(0.9)';
    }

    resetPosition() {
        console.log(`%c🔄 Сброс позиционирования для ${this.botName}`, 'color: #f97316; font-weight: bold;');
        console.log(`%c📍 Устанавливаем: bottom: ${this.position.bottom}, right: ${this.position.right}, z-index: ${this.zIndex}`, 'color: #fbbf24;');
        
        // Принудительно сбрасываем все позиционирующие стили
        this.container.style.setProperty('position', 'fixed', 'important');
        this.container.style.setProperty('bottom', this.position.bottom, 'important');
        this.container.style.setProperty('right', this.position.right, 'important');
        this.container.style.setProperty('left', 'auto', 'important');
        this.container.style.setProperty('top', 'auto', 'important');
        this.container.style.setProperty('width', '380px', 'important');
        this.container.style.setProperty('height', '450px', 'important');
        this.container.style.setProperty('max-width', 'calc(100vw - 40px)', 'important');
        this.container.style.setProperty('max-height', 'calc(100vh - 40px)', 'important');
        this.container.style.setProperty('z-index', this.zIndex.toString(), 'important');
        this.container.style.setProperty('transform', 'none', 'important');
        
        console.log(`%c✅ Позиционирование ${this.botName} сброшено с !important (z-index: ${this.zIndex})`, 'color: #10b981;');
        
        // Дополнительная проверка через setTimeout
        setTimeout(() => {
            const computed = window.getComputedStyle(this.container);
            console.log(`%c🔍 Проверка позиции ${this.botName}: bottom=${computed.bottom}, right=${computed.right}, z-index=${computed.zIndex}`, 'color: #8b5cf6;');
        }, 100);
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Добавляем дополнительные стили для анимаций
const additionalStyles = `
    @keyframes messageShine {
        0%, 100% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
    }
`;

const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);

// Экспортируем класс
window.GlassUIWidget = GlassUIWidget; 