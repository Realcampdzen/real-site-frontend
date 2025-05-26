// Современный Кот Бро с красивым чат-виджетом
class SimpleModernBroCat {
    constructor() {
        this.isVisible = false;
        this.apiUrl = 'http://localhost:3001/api/chat';
        this.chatWidget = null;
        this.init();
    }

    init() {
        this.createTriggerButton();
        this.setupEventListeners();
    }

    createTriggerButton() {
        // Удаляем старую кнопку если есть
        const oldTrigger = document.querySelector('.simple-modern-bro-cat-trigger');
        if (oldTrigger) oldTrigger.remove();

        const trigger = document.createElement('div');
        trigger.className = 'simple-modern-bro-cat-trigger';
        trigger.innerHTML = `
            <div class="simple-cat-avatar-container">
                <img src="images/bro-avatar.jpg" alt="Кот Бро" class="simple-cat-avatar-image">
                <div class="simple-cat-status-indicator"></div>
            </div>
            <div class="simple-cat-tooltip">Кот Бро AI</div>
        `;

        // Стили для современной кнопки
        trigger.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 1003;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: scale(1);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            box-shadow: 0 10px 25px rgba(249, 115, 22, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        `;

        document.body.appendChild(trigger);
    }

    setupEventListeners() {
        const trigger = document.querySelector('.simple-modern-bro-cat-trigger');
        
        trigger.addEventListener('click', () => {
            this.toggleChat();
        });

        // Hover эффекты с кошачьими движениями
        trigger.addEventListener('mouseenter', () => {
            trigger.style.transform = 'scale(1.1) rotate(5deg)';
            trigger.style.boxShadow = '0 15px 35px rgba(249, 115, 22, 0.5)';
        });

        trigger.addEventListener('mouseleave', () => {
            trigger.style.transform = 'scale(1) rotate(0deg)';
            trigger.style.boxShadow = '0 10px 25px rgba(249, 115, 22, 0.4)';
        });
    }

    toggleChat() {
        if (this.isVisible) {
            this.hideChat();
        } else {
            this.showChat();
        }
    }

    showChat() {
        this.isVisible = true;
        
        // Создаем чат-виджет если его нет
        if (!this.chatWidget) {
            this.chatWidget = new SimpleChatWidget({
                botName: "Кот Бро",
                botAvatar: "images/bro-avatar.jpg",
                theme: "#f97316", // Оранжевый цвет для Кота Бро
                onSendMessage: this.sendMessage.bind(this),
                onClose: () => this.hideChat()
            });
            
            // Позиционируем чат
            this.chatWidget.container.style.bottom = '170px';
            this.chatWidget.container.style.right = '20px';
        }

        this.chatWidget.show();
    }

    hideChat() {
        this.isVisible = false;
        if (this.chatWidget) {
            this.chatWidget.hide();
        }
    }

    async sendMessage(message) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    bot: 'bro-cat'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response || "Мяу! Что-то пошло не так. Попробуй еще раз! 🐱";
        } catch (error) {
            console.error('Ошибка отправки сообщения Коту Бро:', error);
            return "Мяу! Сервер спит как кот. Попробуй позже! 😴🐱";
        }
    }
}

// CSS стили для современного дизайна Кота Бро
const simpleModernBroCatStyles = `
    .simple-modern-bro-cat-trigger::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
        border-radius: 50%;
    }

    .simple-cat-avatar-container {
        position: relative;
        width: 50px;
        height: 50px;
    }

    .simple-cat-avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .simple-cat-status-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border-radius: 50%;
        border: 2px solid white;
        animation: simpleCatPulse 2s infinite;
    }

    .simple-cat-tooltip {
        position: absolute;
        bottom: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        pointer-events: none;
    }

    .simple-modern-bro-cat-trigger:hover .simple-cat-tooltip {
        opacity: 1;
        visibility: visible;
        bottom: 75px;
    }

    .simple-cat-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.8);
    }

    @keyframes simpleCatPulse {
        0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
    }

    /* Специальные эффекты для кота */
    .simple-modern-bro-cat-trigger:hover {
        animation: simpleCatWiggle 0.5s ease-in-out;
    }

    @keyframes simpleCatWiggle {
        0%, 100% { transform: scale(1.1) rotate(5deg); }
        25% { transform: scale(1.1) rotate(-5deg); }
        75% { transform: scale(1.1) rotate(5deg); }
    }
`;

// Добавляем стили в документ
const simpleCatStyleSheet = document.createElement('style');
simpleCatStyleSheet.textContent = simpleModernBroCatStyles;
document.head.appendChild(simpleCatStyleSheet);

// Инициализируем современного Кота Бро
let simpleModernBroCat;
document.addEventListener('DOMContentLoaded', () => {
    simpleModernBroCat = new SimpleModernBroCat();
});

// Экспортируем для использования в других файлах
window.SimpleModernBroCat = SimpleModernBroCat; 