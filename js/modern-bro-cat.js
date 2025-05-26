// Современный Кот Бро с MinChat UI
class ModernBroCat {
    constructor() {
        this.isVisible = false;
        this.apiUrl = 'http://localhost:3001/api/chat';
        this.init();
    }

    init() {
        this.createTriggerButton();
        this.createChatContainer();
        this.setupEventListeners();
    }

    createTriggerButton() {
        // Удаляем старую кнопку если есть
        const oldTrigger = document.querySelector('.modern-bro-cat-trigger');
        if (oldTrigger) oldTrigger.remove();

        const trigger = document.createElement('div');
        trigger.className = 'modern-bro-cat-trigger';
        trigger.innerHTML = `
            <div class="modern-cat-avatar-container">
                <img src="images/bro-avatar.jpg" alt="Кот Бро" class="modern-cat-avatar-image">
                <div class="modern-cat-status-indicator"></div>
            </div>
            <div class="modern-cat-tooltip">Кот Бро AI</div>
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
        `;

        document.body.appendChild(trigger);
    }

    createChatContainer() {
        // Удаляем старый контейнер если есть
        const oldContainer = document.querySelector('.modern-bro-cat-container');
        if (oldContainer) oldContainer.remove();

        const container = document.createElement('div');
        container.className = 'modern-bro-cat-container';
        container.style.cssText = `
            position: fixed;
            bottom: 170px;
            right: 20px;
            z-index: 1002;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        container.innerHTML = `
            <div id="modern-bro-cat-chat"></div>
        `;

        document.body.appendChild(container);
    }

    setupEventListeners() {
        const trigger = document.querySelector('.modern-bro-cat-trigger');
        
        trigger.addEventListener('click', () => {
            this.toggleChat();
        });

        // Hover эффекты
        trigger.addEventListener('mouseenter', () => {
            trigger.style.transform = 'scale(1.1) rotate(5deg)';
        });

        trigger.addEventListener('mouseleave', () => {
            trigger.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    toggleChat() {
        this.isVisible = !this.isVisible;
        const container = document.querySelector('.modern-bro-cat-container');
        
        if (this.isVisible) {
            this.showChat();
        } else {
            this.hideChat();
        }
    }

    showChat() {
        const container = document.querySelector('.modern-bro-cat-container');
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        container.style.transform = 'translateY(0) scale(1)';

        // Инициализируем React компонент
        this.initReactChat();
    }

    hideChat() {
        const container = document.querySelector('.modern-bro-cat-container');
        container.style.opacity = '0';
        container.style.visibility = 'hidden';
        container.style.transform = 'translateY(20px) scale(0.95)';
    }

    async initReactChat() {
        const chatContainer = document.getElementById('modern-bro-cat-chat');
        
        // Создаем React элемент с помощью createElement
        const chatElement = React.createElement(ModernChatWidget, {
            botName: "Кот Бро",
            botAvatar: "images/bro-avatar.jpg",
            theme: "#f97316", // Оранжевый цвет для Кота Бро
            isVisible: true,
            onSendMessage: this.sendMessage.bind(this),
            onClose: () => this.hideChat()
        });

        // Рендерим React компонент
        ReactDOM.render(chatElement, chatContainer);
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
const modernBroCatStyles = `
    .modern-bro-cat-trigger {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        box-shadow: 0 10px 25px rgba(249, 115, 22, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .modern-bro-cat-trigger::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
        border-radius: 50%;
    }

    .modern-cat-avatar-container {
        position: relative;
        width: 50px;
        height: 50px;
    }

    .modern-cat-avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .modern-cat-status-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border-radius: 50%;
        border: 2px solid white;
        animation: catPulse 2s infinite;
    }

    .modern-cat-tooltip {
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
    }

    .modern-bro-cat-trigger:hover .modern-cat-tooltip {
        opacity: 1;
        visibility: visible;
        bottom: 75px;
    }

    .modern-cat-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.8);
    }

    @keyframes catPulse {
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
    .modern-bro-cat-trigger:hover {
        animation: catWiggle 0.5s ease-in-out;
    }

    @keyframes catWiggle {
        0%, 100% { transform: scale(1.1) rotate(5deg); }
        25% { transform: scale(1.1) rotate(-5deg); }
        75% { transform: scale(1.1) rotate(5deg); }
    }

    .modern-bro-cat-container .modern-chat-widget {
        animation: catSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes catSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px) rotate(-5deg);
        }
        to {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
        }
    }
`;

// Добавляем стили в документ
const catStyleSheet = document.createElement('style');
catStyleSheet.textContent = modernBroCatStyles;
document.head.appendChild(catStyleSheet);

// Инициализируем современного Кота Бро
let modernBroCat;
document.addEventListener('DOMContentLoaded', () => {
    modernBroCat = new ModernBroCat();
});

// Экспортируем для использования в других файлах
window.ModernBroCat = ModernBroCat; 