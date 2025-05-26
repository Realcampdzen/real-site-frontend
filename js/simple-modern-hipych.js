// Современный Хипыч с красивым чат-виджетом
class SimpleModernHipych {
    constructor() {
        this.isVisible = false;
        this.apiUrl = 'http://localhost:3000/api/chat';
        this.chatWidget = null;
        this.init();
    }

    init() {
        this.createTriggerButton();
        this.setupEventListeners();
    }

    createTriggerButton() {
        // Удаляем старую кнопку если есть
        const oldTrigger = document.querySelector('.simple-modern-hipych-trigger');
        if (oldTrigger) oldTrigger.remove();

        const trigger = document.createElement('div');
        trigger.className = 'simple-modern-hipych-trigger';
        trigger.innerHTML = `
            <div class="simple-avatar-container">
                <img src="images/hipych-avatar.jpg" alt="Хипыч" class="simple-avatar-image">
                <div class="simple-status-indicator"></div>
            </div>
            <div class="simple-tooltip">Хипыч AI</div>
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
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        `;

        document.body.appendChild(trigger);
    }

    setupEventListeners() {
        const trigger = document.querySelector('.simple-modern-hipych-trigger');
        
        trigger.addEventListener('click', () => {
            this.toggleChat();
        });

        // Hover эффекты
        trigger.addEventListener('mouseenter', () => {
            trigger.style.transform = 'scale(1.1)';
            trigger.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
        });

        trigger.addEventListener('mouseleave', () => {
            trigger.style.transform = 'scale(1)';
            trigger.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
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
                botName: "Хипыч",
                botAvatar: "images/hipych-avatar.jpg",
                theme: "#3b82f6", // Синий цвет для Хипыча
                onSendMessage: this.sendMessage.bind(this),
                onClose: () => this.hideChat()
            });
            
            // Позиционируем чат
            this.chatWidget.container.style.bottom = '90px';
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
const simpleModernHipychStyles = `
    .simple-modern-hipych-trigger::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
        border-radius: 50%;
    }

    .simple-avatar-container {
        position: relative;
        width: 50px;
        height: 50px;
    }

    .simple-avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .simple-status-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border-radius: 50%;
        border: 2px solid white;
        animation: simplePulse 2s infinite;
    }

    .simple-tooltip {
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

    .simple-modern-hipych-trigger:hover .simple-tooltip {
        opacity: 1;
        visibility: visible;
        bottom: 75px;
    }

    .simple-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.8);
    }

    @keyframes simplePulse {
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
`;

// Добавляем стили в документ
const simpleStyleSheet = document.createElement('style');
simpleStyleSheet.textContent = simpleModernHipychStyles;
document.head.appendChild(simpleStyleSheet);

// Инициализируем современного Хипыча
let simpleModernHipych;
document.addEventListener('DOMContentLoaded', () => {
    simpleModernHipych = new SimpleModernHipych();
});

// Экспортируем для использования в других файлах
window.SimpleModernHipych = SimpleModernHipych; 