// Glass UI Кот Бро - дружелюбный кот-помощник с glassmorphism дизайном
class GlassUIBroCat {
    constructor() {
        this.name = "Кот Бро";
        this.avatar = "images/bro-avatar.jpg";
        this.theme = "#f97316";
        this.isVisible = false;
        
        this.responses = [
            "🐱 Мяу! Я Кот Бро - захватчик этого сайта! *потягивается*",
            "😸 Видишь, как я общаюсь? Хочешь себе такого же мемного помощника?",
            "🎪 Я живое доказательство того, что AI-боты могут быть крутыми!",
            "💰 От 18,000₽ - и у тебя будет свой харизматичный помощник!",
            "🚀 Я изменил этот сайт, сделал его живым и интересным!",
            "😺 Мой секрет - характер! Клиенты не уходят, а остаются поболтать!",
            "🎯 Хочешь +200% к конверсии? Заказывай своего 'Кота Бро'!",
            "🤖 Я не просто болтаю - я РАБОТАЮ! Продажи через эмоции!",
            "⭐ Окупаюсь за месяц! Мой хозяин уже в плюсе! *мурчит*",
            "🎭 Заказать клона: @Stivanovv - и твой бизнес оживет!"
        ];
        
        this.init();
    }

    init() {
        // СНАЧАЛА добавляем стили анимаций, чтобы они были определены
        this.addGlassUIStyles();
        // ПОТОМ создаем кнопку, которая использует эти анимации
        this.createFloatingButton();
        this.createChatWidget();
    }

    createFloatingButton() {
        // Создаем плавающую кнопку с Glass UI эффектами
        this.floatingButton = document.createElement('div');
        this.floatingButton.className = 'glass-ui-bro-cat-button';
        this.floatingButton.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, ${this.theme}dd, ${this.theme});
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 
                0 15px 35px rgba(249, 115, 22, 0.4),
                inset 0 2px 0 rgba(255, 255, 255, 0.3),
                inset 0 -2px 0 rgba(0, 0, 0, 0.1);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1003;
            overflow: hidden;
            animation: catFloat 3s ease-in-out infinite;
        `;
        this.floatingButton.dataset.tooltip = 'Кот Бро • мемный AI-гид';

        // Добавляем анимированный фон с кошачьими мотивами
        const buttonBg = document.createElement('div');
        buttonBg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: catShine 2.5s ease-in-out infinite;
            border-radius: 50%;
        `;
        this.floatingButton.appendChild(buttonBg);

        // Добавляем аватар
        if (this.avatar) {
            const avatarImg = document.createElement('img');
            avatarImg.src = this.avatar;
            avatarImg.alt = this.name;
            avatarImg.style.cssText = `
                width: 64px;
                height: 64px;
                border-radius: 50%;
                object-fit: cover;
                position: relative;
                z-index: 1;
                border: 2px solid rgba(255, 255, 255, 0.5);
                filter: saturate(1.2);
            `;
            this.floatingButton.appendChild(avatarImg);
        } else {
            const icon = document.createElement('div');
            icon.innerHTML = '🐱';
            icon.style.cssText = `
                font-size: 32px;
                position: relative;
                z-index: 1;
                animation: catWiggle 2s ease-in-out infinite;
            `;
            this.floatingButton.appendChild(icon);
        }

        // Добавляем индикатор уведомлений с кошачьим стилем
        const notificationBadge = document.createElement('div');
        notificationBadge.className = 'glass-cat-notification-badge';
        notificationBadge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.8);
            animation: catBadgePulse 1.8s infinite;
        `;
        notificationBadge.textContent = '🐾';
        this.floatingButton.appendChild(notificationBadge);

        // Добавляем hover эффекты (через CSS класс, чтобы не конфликтовать с анимацией)
        this.floatingButton.addEventListener('mouseenter', () => {
            this.floatingButton.classList.add('glass-ui-bro-cat-hover');
        });

        this.floatingButton.addEventListener('mouseleave', () => {
            this.floatingButton.classList.remove('glass-ui-bro-cat-hover');
        });

        this.floatingButton.addEventListener('click', () => {
            this.toggleChat();
            // Добавляем кошачий эффект клика
            this.addCatClickEffect();
        });

        document.body.appendChild(this.floatingButton);
    }

    createChatWidget() {
        console.log('%c🐱 Создание чат-виджета Кота Бро...', 'color: #f97316; font-weight: bold;');
        
        this.glassWidget = new GlassUIWidget({
            botName: "Кот Бро",
            botAvatar: "images/bro-avatar.jpg",
            theme: "#f97316",
            position: { bottom: '200px', right: '20px' },
            onSendMessage: this.handleMessage.bind(this),
            onClose: this.handleClose.bind(this)
        });
        
        console.log('%c✅ Чат-виджет Кота Бро создан с позицией: bottom: 200px, right: 20px', 'color: #10b981;');
    }

    addGlassUIStyles() {
        const styles = `
            @keyframes catFloat {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg);
                    filter: hue-rotate(0deg);
                }
                33% { 
                    transform: translateY(-6px) rotate(-2deg);
                    filter: hue-rotate(8deg);
                }
                66% { 
                    transform: translateY(-3px) rotate(1deg);
                    filter: hue-rotate(15deg);
                }
            }

            @keyframes catShine {
                0%, 100% { 
                    transform: translateX(-100%) rotate(45deg) scale(0.8);
                    opacity: 0;
                }
                50% { 
                    transform: translateX(100%) rotate(45deg) scale(1.2);
                    opacity: 1;
                }
            }

            @keyframes catWiggle {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-5deg) scale(1.1); }
                75% { transform: rotate(5deg) scale(0.9); }
            }

            @keyframes catBadgePulse {
                0%, 100% { 
                    transform: scale(1) rotate(0deg);
                    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7);
                }
                50% { 
                    transform: scale(1.3) rotate(180deg);
                    box-shadow: 0 0 0 8px rgba(251, 191, 36, 0);
                }
            }

            .glass-ui-bro-cat-button::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, ${this.theme}, transparent, ${this.theme});
                border-radius: 50%;
                z-index: -1;
                animation: catBorderRotate 3s linear infinite;
            }

            @keyframes catBorderRotate {
                from { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.05); }
                to { transform: rotate(360deg) scale(1); }
            }

            .cat-click-effect {
                position: absolute;
                pointer-events: none;
                font-size: 20px;
                color: ${this.theme};
                animation: catClickPop 1s ease-out forwards;
                z-index: 10000;
            }

            @keyframes catClickPop {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.5) rotate(180deg);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(2) rotate(360deg);
                    opacity: 0;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    addCatClickEffect() {
        const effects = ['🐾', '😸', '💫', '✨', '🌟'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        
        const clickEffect = document.createElement('div');
        clickEffect.className = 'cat-click-effect';
        clickEffect.textContent = effect;
        
        const rect = this.floatingButton.getBoundingClientRect();
        clickEffect.style.left = (rect.left + rect.width / 2) + 'px';
        clickEffect.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(clickEffect);
        
        setTimeout(() => {
            if (clickEffect.parentNode) {
                clickEffect.parentNode.removeChild(clickEffect);
            }
        }, 1000);
    }

    async handleMessage(message) {
        // Имитируем кошачью задержку (коты любят подумать)
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 2200));
        
        // Возвращаем случайный кошачий ответ
        const response = this.responses[Math.floor(Math.random() * this.responses.length)];
        return response;
    }

    handleClose() {
        console.log('%c🐱 Кот Бро: handleClose() вызван', 'color: #f97316; font-weight: bold;');
        this.hideChat();
    }

    // Универсальная функция для закрытия всех других чатов
    closeOtherChats() {
        // Закрываем Хипыча, если он открыт
        if (window.glassUIHipych && window.glassUIHipych.isVisible) {
            console.log('%c🔄 Закрываем Хипыча перед открытием Кота Бро', 'color: #fbbf24;');
            window.glassUIHipych.hideChat();
        }
        
        // Закрываем старый чат (chat-overlay), если он открыт
        const oldChatOverlay = document.getElementById('chat-overlay');
        if (oldChatOverlay && !oldChatOverlay.classList.contains('hidden')) {
            oldChatOverlay.classList.add('hidden');
        }
    }

    showChat() {
        console.log('%c🐱 Кот Бро: showChat() вызван', 'color: #f97316; font-weight: bold;');
        
        // Закрываем все другие открытые чаты
        this.closeOtherChats();
        
        this.isVisible = true;
        this.glassWidget.show();
        
        // Скрываем уведомление
        const badge = this.floatingButton.querySelector('.glass-cat-notification-badge');
        if (badge) {
            badge.style.display = 'none';
        }
        
        // Добавляем эффект активации
        this.floatingButton.style.background = `linear-gradient(135deg, ${this.theme}, ${this.theme}cc)`;
        this.floatingButton.style.filter = 'brightness(1.1)';
        
        console.log('%c✅ Кот Бро: чат показан', 'color: #10b981; font-weight: bold;');
    }

    hideChat() {
        console.log('%c🐱 Кот Бро: hideChat() вызван', 'color: #f97316; font-weight: bold;');
        
        this.isVisible = false;
        this.glassWidget.hide();
        
        // Возвращаем обычный вид кнопки
        this.floatingButton.style.background = `linear-gradient(135deg, ${this.theme}dd, ${this.theme})`;
        this.floatingButton.style.filter = 'brightness(1)';
        
        console.log('%c✅ Кот Бро: чат скрыт', 'color: #10b981; font-weight: bold;');
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
        if (this.glassWidget) {
            this.glassWidget.destroy();
        }
    }
}

// Инициализируем Glass UI Кота Бро
function initGlassUIBroCat() {
    if (!window.glassUIBroCat) {
        window.glassUIBroCat = new GlassUIBroCat();
        
        console.log('%c🐱 Glass UI Кот Бро загружен!', 'color: #f97316; font-size: 16px; font-weight: bold;');
        console.log('%c✨ Кошачьи glassmorphism эффекты активны', 'color: #fbbf24; font-size: 12px;');
    }
}

// Инициализируем сразу если DOM готов, или ждем события
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlassUIBroCat);
} else {
    // DOM уже загружен, инициализируем сразу
    initGlassUIBroCat();
} 