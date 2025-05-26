// Glass UI Хипыч - современный AI помощник с glassmorphism дизайном
class GlassUIHipych {
    constructor() {
        this.name = "Хипыч";
        this.avatar = "images/hipych-avatar.jpg";
        this.theme = "#3b82f6";
        this.isVisible = false;
        
        this.responses = [
            "Привет! Я Хипыч - твой стримерский админ! 🎥✨",
            "Помогу с настройкой стрима и техническими вопросами! 🔧",
            "Нужна помощь с OBS? Я знаю все секреты! 📹",
            "Давай настроим твой канал на максимум! 🚀",
            "Проблемы с железом? Расскажи, разберемся! 💻",
            "Я помогу оптимизировать твой стрим для лучшего качества! ⚡",
            "Хочешь больше зрителей? Поделюсь фишками! 📈",
            "Техподдержка 24/7 - это про меня! 🛠️",
            "Настройка донатов, алертов, ботов - все умею! 💰",
            "Вместе сделаем твой стрим профессиональным! 🎬"
        ];
        
        this.init();
    }

    init() {
        this.createFloatingButton();
        this.createChatWidget();
    }

    createFloatingButton() {
        // Создаем плавающую кнопку с Glass UI эффектами
        this.floatingButton = document.createElement('div');
        this.floatingButton.className = 'glass-ui-hipych-button';
        this.floatingButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, ${this.theme}dd, ${this.theme});
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 
                0 15px 35px rgba(59, 130, 246, 0.4),
                inset 0 2px 0 rgba(255, 255, 255, 0.3),
                inset 0 -2px 0 rgba(0, 0, 0, 0.1);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1002;
            overflow: hidden;
            animation: glassFloat 4s ease-in-out infinite;
        `;

        // Добавляем анимированный фон
        const buttonBg = document.createElement('div');
        buttonBg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: buttonShine 3s ease-in-out infinite;
            border-radius: 50%;
        `;
        this.floatingButton.appendChild(buttonBg);

        // Добавляем аватар
        if (this.avatar) {
            const avatarImg = document.createElement('img');
            avatarImg.src = this.avatar;
            avatarImg.alt = this.name;
            avatarImg.style.cssText = `
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
                position: relative;
                z-index: 1;
                border: 2px solid rgba(255, 255, 255, 0.5);
            `;
            this.floatingButton.appendChild(avatarImg);
        } else {
            const icon = document.createElement('div');
            icon.innerHTML = '🤖';
            icon.style.cssText = `
                font-size: 32px;
                position: relative;
                z-index: 1;
            `;
            this.floatingButton.appendChild(icon);
        }

        // Добавляем индикатор уведомлений
        const notificationBadge = document.createElement('div');
        notificationBadge.className = 'glass-notification-badge';
        notificationBadge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.8);
            animation: badgePulse 2s infinite;
        `;
        notificationBadge.textContent = '!';
        this.floatingButton.appendChild(notificationBadge);

        // Добавляем hover эффекты
        this.floatingButton.addEventListener('mouseenter', () => {
            this.floatingButton.style.transform = 'scale(1.15) rotate(5deg)';
            this.floatingButton.style.boxShadow = `
                0 25px 50px rgba(59, 130, 246, 0.6),
                inset 0 2px 0 rgba(255, 255, 255, 0.4),
                inset 0 -2px 0 rgba(0, 0, 0, 0.2)
            `;
        });

        this.floatingButton.addEventListener('mouseleave', () => {
            this.floatingButton.style.transform = 'scale(1) rotate(0deg)';
            this.floatingButton.style.boxShadow = `
                0 15px 35px rgba(59, 130, 246, 0.4),
                inset 0 2px 0 rgba(255, 255, 255, 0.3),
                inset 0 -2px 0 rgba(0, 0, 0, 0.1)
            `;
        });

        this.floatingButton.addEventListener('click', () => {
            this.toggleChat();
        });

        // Добавляем стили анимаций
        this.addGlassUIStyles();

        document.body.appendChild(this.floatingButton);
    }

    createChatWidget() {
        console.log('%c🤖 Создание чат-виджета Хипыча...', 'color: #3b82f6; font-weight: bold;');
        
        this.chatWidget = new GlassUIWidget({
            botName: this.name,
            botAvatar: this.avatar,
            theme: this.theme,
            position: { bottom: '100px', right: '20px' },
            onSendMessage: (message) => this.handleMessage(message),
            onClose: () => this.hideChat(),
            isVisible: false
        });
        
        console.log('%c✅ Чат-виджет Хипыча создан с позицией: bottom: 100px, right: 20px', 'color: #10b981;');
    }

    addGlassUIStyles() {
        const styles = `
            @keyframes glassFloat {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg);
                    filter: hue-rotate(0deg);
                }
                25% { 
                    transform: translateY(-8px) rotate(2deg);
                    filter: hue-rotate(5deg);
                }
                50% { 
                    transform: translateY(-5px) rotate(-1deg);
                    filter: hue-rotate(10deg);
                }
                75% { 
                    transform: translateY(-10px) rotate(1deg);
                    filter: hue-rotate(5deg);
                }
            }

            @keyframes buttonShine {
                0%, 100% { 
                    transform: translateX(-100%) rotate(45deg);
                    opacity: 0;
                }
                50% { 
                    transform: translateX(100%) rotate(45deg);
                    opacity: 1;
                }
            }

            @keyframes badgePulse {
                0%, 100% { 
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                }
                50% { 
                    transform: scale(1.2);
                    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
                }
            }

            .glass-ui-hipych-button::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, ${this.theme}, transparent, ${this.theme});
                border-radius: 50%;
                z-index: -1;
                animation: borderRotate 4s linear infinite;
            }

            @keyframes borderRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    async handleMessage(message) {
        // Имитируем задержку обработки
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Возвращаем случайный ответ
        const response = this.responses[Math.floor(Math.random() * this.responses.length)];
        return response;
    }

    showChat() {
        console.log('%c🤖 Хипыч: showChat() вызван', 'color: #3b82f6; font-weight: bold;');
        
        this.isVisible = true;
        this.chatWidget.show();
        
        // Скрываем уведомление
        const badge = this.floatingButton.querySelector('.glass-notification-badge');
        if (badge) {
            badge.style.display = 'none';
        }
        
        // Добавляем эффект активации
        this.floatingButton.style.background = `linear-gradient(135deg, ${this.theme}, ${this.theme}cc)`;
        
        console.log('%c✅ Хипыч: чат показан', 'color: #10b981; font-weight: bold;');
    }

    hideChat() {
        console.log('%c🤖 Хипыч: hideChat() вызван', 'color: #3b82f6; font-weight: bold;');
        
        this.isVisible = false;
        this.chatWidget.hide();
        
        // Возвращаем обычный вид кнопки
        this.floatingButton.style.background = `linear-gradient(135deg, ${this.theme}dd, ${this.theme})`;
        
        console.log('%c✅ Хипыч: чат скрыт', 'color: #10b981; font-weight: bold;');
    }

    toggleChat() {
        if (this.isVisible) {
            this.hideChat();
        } else {
            this.showChat();
        }
    }

    destroy() {
        if (this.floatingButton && this.floatingButton.parentNode) {
            this.floatingButton.parentNode.removeChild(this.floatingButton);
        }
        if (this.chatWidget) {
            this.chatWidget.destroy();
        }
    }
}

// Инициализируем Glass UI Хипыча
function initGlassUIHipych() {
    if (!window.glassUIHipych) {
        window.glassUIHipych = new GlassUIHipych();
        
        console.log('%c🤖 Glass UI Хипыч загружен!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
        console.log('%c✨ Glassmorphism эффекты активны', 'color: #10b981; font-size: 12px;');
    }
}

// Инициализируем сразу если DOM готов, или ждем события
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlassUIHipych);
} else {
    // DOM уже загружен, инициализируем сразу
    initGlassUIHipych();
} 