// Современный Хипыч с MinChat UI
class ModernHipych {
    constructor() {
        this.isVisible = false;
        this.apiUrl = 'http://localhost:3000/api/chat';
        this.init();
    }

    init() {
        this.createTriggerButton();
        this.createChatContainer();
        this.setupEventListeners();
    }

    createTriggerButton() {
        // Удаляем старую кнопку если есть
        const oldTrigger = document.querySelector('.modern-hipych-trigger');
        if (oldTrigger) oldTrigger.remove();

        const trigger = document.createElement('div');
        trigger.className = 'modern-hipych-trigger';
        trigger.innerHTML = `
            <div class="modern-avatar-container">
                <img src="images/hipych-avatar.jpg" alt="Хипыч" class="modern-avatar-image">
                <div class="modern-status-indicator"></div>
            </div>
            <div class="modern-tooltip">Хипыч AI</div>
        `;

        // Стили для современной кнопки
        trigger.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1002;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: scale(1);
        `;

        document.body.appendChild(trigger);
    }

    createChatContainer() {
        // Удаляем старый контейнер если есть
        const oldContainer = document.querySelector('.modern-hipych-container');
        if (oldContainer) oldContainer.remove();

        const container = document.createElement('div');
        container.className = 'modern-hipych-container';
        container.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            z-index: 1001;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        container.innerHTML = `
            <div id="modern-hipych-chat"></div>
        `;

        document.body.appendChild(container);
    }

    setupEventListeners() {
        const trigger = document.querySelector('.modern-hipych-trigger');
        
        trigger.addEventListener('click', () => {
            this.toggleChat();
        });

        // Hover эффекты
        trigger.addEventListener('mouseenter', () => {
            trigger.style.transform = 'scale(1.1)';
        });

        trigger.addEventListener('mouseleave', () => {
            trigger.style.transform = 'scale(1)';
        });
    }

    toggleChat() {
        this.isVisible = !this.isVisible;
        const container = document.querySelector('.modern-hipych-container');
        
        if (this.isVisible) {
            this.showChat();
        } else {
            this.hideChat();
        }
    }

    showChat() {
        const container = document.querySelector('.modern-hipych-container');
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        container.style.transform = 'translateY(0) scale(1)';

        // Инициализируем React компонент
        this.initReactChat();
    }

    hideChat() {
        const container = document.querySelector('.modern-hipych-container');
        container.style.opacity = '0';
        container.style.visibility = 'hidden';
        container.style.transform = 'translateY(20px) scale(0.95)';
    }

    async initReactChat() {
        const chatContainer = document.getElementById('modern-hipych-chat');
        
        // Создаем React элемент с помощью createElement
        const chatElement = React.createElement(ModernChatWidget, {
            botName: "Хипыч",
            botAvatar: "images/hipych-avatar.jpg",
            theme: "#3b82f6", // Синий цвет для Хипыча
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
                    bot: 'hipych'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response || "Извините, произошла ошибка. Попробуйте еще раз.";
        } catch (error) {
            console.error('Ошибка отправки сообщения Хипычу:', error);
            return "Извините, сервер временно недоступен. Попробуйте позже.";
        }
    }
}

// CSS стили для современного дизайна
const modernHipychStyles = `
    .modern-hipych-trigger {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .modern-hipych-trigger::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
        border-radius: 50%;
    }

    .modern-avatar-container {
        position: relative;
        width: 50px;
        height: 50px;
    }

    .modern-avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .modern-status-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border-radius: 50%;
        border: 2px solid white;
        animation: pulse 2s infinite;
    }

    .modern-tooltip {
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

    .modern-hipych-trigger:hover .modern-tooltip {
        opacity: 1;
        visibility: visible;
        bottom: 75px;
    }

    .modern-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.8);
    }

    @keyframes pulse {
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

    .modern-chat-widget {
        animation: slideInUp 0.3s ease-out;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = modernHipychStyles;
document.head.appendChild(styleSheet);

// Инициализируем современного Хипыча
let modernHipych;
document.addEventListener('DOMContentLoaded', () => {
    modernHipych = new ModernHipych();
});

// Экспортируем для использования в других файлах
window.ModernHipych = ModernHipych; 