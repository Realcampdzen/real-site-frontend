/**
 * Мультиагентный чат-хаб для AI Studio
 * Управляет взаимодействием между несколькими AI-ассистентами
 */

class MultiAgentChatHub {
    constructor(options = {}) {
        this.agents = new Map();
        this.chatHistory = [];
        this.activeAgents = new Set();
        this.contextManager = new ContextManager();
        this.messageQueue = [];
        this.isProcessing = false;
        
        // Настройки
        this.maxHistoryLength = options.maxHistoryLength || 100;
        this.responseDelay = options.responseDelay || 1000;
        this.maxActiveAgents = options.maxActiveAgents || 3;
        
        // Колбэки
        this.onMessageReceived = options.onMessageReceived || null;
        this.onAgentActivated = options.onAgentActivated || null;
        this.onAgentResponse = options.onAgentResponse || null;
        
        console.log('🤖 MultiAgentChatHub инициализирован');
    }

    /**
     * Регистрация нового агента в системе
     */
    registerAgent(agentId, agentConfig) {
        const agent = {
            id: agentId,
            name: agentConfig.name,
            avatar: agentConfig.avatar,
            color: agentConfig.color,
            triggers: agentConfig.triggers || [],
            personality: agentConfig.personality || '',
            apiEndpoint: agentConfig.apiEndpoint,
            isActive: false,
            lastActivity: null,
            messageCount: 0
        };

        this.agents.set(agentId, agent);
        console.log(`✅ Агент ${agent.name} зарегистрирован`);
        
        return agent;
    }

    /**
     * Обработка входящего сообщения
     */
    async processMessage(message, senderId = 'user') {
        console.log(`📨 Обработка сообщения от ${senderId}:`, message);

        // Добавляем сообщение в историю
        const messageObj = {
            id: Date.now().toString(),
            text: message,
            senderId: senderId,
            timestamp: new Date(),
            mentions: this.contextManager.detectMentions(message)
        };

        this.chatHistory.push(messageObj);
        this.trimHistory();

        // Уведомляем UI о новом сообщении
        if (this.onMessageReceived) {
            this.onMessageReceived(messageObj);
        }

        // Если сообщение от пользователя, активируем агентов
        if (senderId === 'user') {
            await this.activateRelevantAgents(message);
            await this.processAgentResponses(message);
        }

        return messageObj;
    }

    /**
     * Активация релевантных агентов на основе сообщения
     */
    async activateRelevantAgents(message) {
        const relevantAgents = this.findRelevantAgents(message);
        
        // Ограничиваем количество активных агентов
        const agentsToActivate = relevantAgents.slice(0, this.maxActiveAgents);
        
        for (const agentId of agentsToActivate) {
            await this.activateAgent(agentId);
        }
    }

    /**
     * Поиск релевантных агентов по ключевым словам
     */
    findRelevantAgents(message) {
        const lowerMessage = message.toLowerCase();
        const relevantAgents = [];
        const agentScores = new Map();

        // Проверяем прямые упоминания (@агент)
        const mentions = this.contextManager.detectMentions(message);
        for (const mention of mentions) {
            if (this.agents.has(mention)) {
                relevantAgents.push(mention);
                agentScores.set(mention, 100); // Максимальный приоритет для упоминаний
            }
        }

        // Проверяем триггеры для каждого агента
        for (const [agentId, agent] of this.agents) {
            if (relevantAgents.includes(agentId)) continue; // Уже добавлен через упоминание

            let score = 0;
            for (const trigger of agent.triggers) {
                if (lowerMessage.includes(trigger.toLowerCase())) {
                    score += 10;
                }
            }

            if (score > 0) {
                agentScores.set(agentId, score);
                relevantAgents.push(agentId);
            }
        }

        // Сортируем по релевантности
        return relevantAgents.sort((a, b) => 
            (agentScores.get(b) || 0) - (agentScores.get(a) || 0)
        );
    }

    /**
     * Активация конкретного агента
     */
    async activateAgent(agentId) {
        const agent = this.agents.get(agentId);
        if (!agent) return;

        if (!this.activeAgents.has(agentId)) {
            this.activeAgents.add(agentId);
            agent.isActive = true;
            agent.lastActivity = new Date();

            console.log(`🔥 Агент ${agent.name} активирован`);

            if (this.onAgentActivated) {
                this.onAgentActivated(agent);
            }
        }
    }

    /**
     * Обработка ответов от активных агентов
     */
    async processAgentResponses(userMessage) {
        if (this.isProcessing) {
            this.messageQueue.push(userMessage);
            return;
        }

        this.isProcessing = true;

        try {
            const responses = [];
            
            // Получаем ответы от всех активных агентов
            for (const agentId of this.activeAgents) {
                const agent = this.agents.get(agentId);
                if (!agent) continue;

                try {
                    const response = await this.getAgentResponse(agentId, userMessage);
                    if (response) {
                        responses.push({
                            agentId,
                            agent,
                            response,
                            delay: Math.random() * 2000 + 1000 // Случайная задержка 1-3 сек
                        });
                    }
                } catch (error) {
                    console.error(`❌ Ошибка получения ответа от ${agent.name}:`, error);
                }
            }

            // Отправляем ответы с задержками для реалистичности
            for (const { agentId, agent, response, delay } of responses) {
                setTimeout(async () => {
                    await this.sendAgentMessage(agentId, response);
                }, delay);
            }

        } finally {
            this.isProcessing = false;
            
            // Обрабатываем очередь сообщений
            if (this.messageQueue.length > 0) {
                const nextMessage = this.messageQueue.shift();
                setTimeout(() => this.processAgentResponses(nextMessage), 500);
            }
        }
    }

    /**
     * Получение ответа от конкретного агента
     */
    async getAgentResponse(agentId, userMessage) {
        const agent = this.agents.get(agentId);
        if (!agent || !agent.apiEndpoint) return null;

        try {
            // Получаем контекст для агента
            const context = this.contextManager.getRelevantContext(agentId, userMessage);
            
            const response = await fetch(agent.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    context: context,
                    chatHistory: this.getRecentHistory(5),
                    activeAgents: Array.from(this.activeAgents)
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.reply || data.response || data.message;
            }
        } catch (error) {
            console.error(`❌ Ошибка API для ${agent.name}:`, error);
        }

        return null;
    }

    /**
     * Отправка сообщения от агента
     */
    async sendAgentMessage(agentId, message) {
        const agent = this.agents.get(agentId);
        if (!agent) return;

        const messageObj = {
            id: Date.now().toString(),
            text: message,
            senderId: agentId,
            senderName: agent.name,
            senderAvatar: agent.avatar,
            senderColor: agent.color,
            timestamp: new Date()
        };

        this.chatHistory.push(messageObj);
        this.trimHistory();

        agent.messageCount++;
        agent.lastActivity = new Date();

        console.log(`💬 ${agent.name}: ${message}`);

        // Уведомляем UI
        if (this.onAgentResponse) {
            this.onAgentResponse(messageObj);
        }

        // Обновляем контекст
        this.contextManager.updateContext(agentId, {
            lastMessage: message,
            timestamp: new Date()
        });

        return messageObj;
    }

    /**
     * Получение недавней истории чата
     */
    getRecentHistory(count = 10) {
        return this.chatHistory.slice(-count);
    }

    /**
     * Очистка истории чата
     */
    trimHistory() {
        if (this.chatHistory.length > this.maxHistoryLength) {
            this.chatHistory = this.chatHistory.slice(-this.maxHistoryLength);
        }
    }

    /**
     * Деактивация агента
     */
    deactivateAgent(agentId) {
        const agent = this.agents.get(agentId);
        if (agent) {
            this.activeAgents.delete(agentId);
            agent.isActive = false;
            console.log(`😴 Агент ${agent.name} деактивирован`);
        }
    }

    /**
     * Получение списка активных агентов
     */
    getActiveAgents() {
        return Array.from(this.activeAgents).map(id => this.agents.get(id));
    }

    /**
     * Получение всех зарегистрированных агентов
     */
    getAllAgents() {
        return Array.from(this.agents.values());
    }

    /**
     * Экспорт диалога
     */
    exportChat() {
        return {
            history: this.chatHistory,
            agents: this.getAllAgents(),
            timestamp: new Date(),
            totalMessages: this.chatHistory.length
        };
    }

    /**
     * Очистка чата
     */
    clearChat() {
        this.chatHistory = [];
        this.activeAgents.clear();
        this.contextManager.clearContext();
        
        // Сбрасываем статистику агентов
        for (const agent of this.agents.values()) {
            agent.isActive = false;
            agent.messageCount = 0;
            agent.lastActivity = null;
        }
        
        console.log('🧹 Чат очищен');
    }
}

/**
 * Менеджер контекста для мультиагентного чата
 */
class ContextManager {
    constructor() {
        this.globalContext = {};
        this.agentContexts = new Map();
        this.conversationFlow = [];
    }

    /**
     * Обновление контекста агента
     */
    updateContext(agentId, contextData) {
        if (!this.agentContexts.has(agentId)) {
            this.agentContexts.set(agentId, {});
        }
        
        const agentContext = this.agentContexts.get(agentId);
        Object.assign(agentContext, contextData);
        
        this.conversationFlow.push({
            agentId,
            action: 'context_update',
            data: contextData,
            timestamp: new Date()
        });
    }

    /**
     * Получение релевантного контекста для агента
     */
    getRelevantContext(agentId, message) {
        const agentContext = this.agentContexts.get(agentId) || {};
        
        return {
            agent: agentContext,
            global: this.globalContext,
            recentFlow: this.conversationFlow.slice(-5),
            messageAnalysis: this.analyzeMessage(message)
        };
    }

    /**
     * Определение упоминаний других агентов
     */
    detectMentions(message) {
        const mentions = [];
        const mentionPattern = /@(\w+)/g;
        let match;
        
        while ((match = mentionPattern.exec(message)) !== null) {
            mentions.push(match[1].toLowerCase());
        }
        
        return mentions;
    }

    /**
     * Анализ сообщения для извлечения ключевой информации
     */
    analyzeMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        return {
            isQuestion: message.includes('?') || lowerMessage.includes('как') || lowerMessage.includes('что'),
            isRequest: lowerMessage.includes('хочу') || lowerMessage.includes('нужно') || lowerMessage.includes('помоги'),
            sentiment: this.detectSentiment(message),
            topics: this.extractTopics(message),
            urgency: this.detectUrgency(message)
        };
    }

    /**
     * Определение тональности сообщения
     */
    detectSentiment(message) {
        const positive = ['хорошо', 'отлично', 'супер', 'класс', 'спасибо'];
        const negative = ['плохо', 'ужасно', 'проблема', 'ошибка', 'не работает'];
        
        const lowerMessage = message.toLowerCase();
        
        if (positive.some(word => lowerMessage.includes(word))) return 'positive';
        if (negative.some(word => lowerMessage.includes(word))) return 'negative';
        
        return 'neutral';
    }

    /**
     * Извлечение тем из сообщения
     */
    extractTopics(message) {
        const topics = [];
        const topicKeywords = {
            'медицина': ['здоровье', 'врач', 'лечение', 'анализ', 'симптомы'],
            'бизнес': ['прибыль', 'стратегия', 'продажи', 'клиенты', 'рынок'],
            'технологии': ['код', 'программа', 'сайт', 'бот', 'API'],
            'контент': ['текст', 'реклама', 'пост', 'маркетинг', 'бренд']
        };
        
        const lowerMessage = message.toLowerCase();
        
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                topics.push(topic);
            }
        }
        
        return topics;
    }

    /**
     * Определение срочности сообщения
     */
    detectUrgency(message) {
        const urgentWords = ['срочно', 'быстро', 'немедленно', 'сейчас', 'прямо сейчас'];
        const lowerMessage = message.toLowerCase();
        
        return urgentWords.some(word => lowerMessage.includes(word)) ? 'high' : 'normal';
    }

    /**
     * Очистка контекста
     */
    clearContext() {
        this.globalContext = {};
        this.agentContexts.clear();
        this.conversationFlow = [];
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MultiAgentChatHub, ContextManager };
} 