import React, { useState, useEffect, useRef } from 'react';
import {
  MinChatUiProvider,
  MainContainer,
  MessageInput,
  MessageContainer,
  MessageList,
  MessageHeader
} from "@minchat/react-chat-ui";

const ModernChatWidget = ({ 
  botName = "AI Assistant", 
  botAvatar = "", 
  theme = "#6ea9d7",
  onSendMessage,
  isVisible = false,
  onClose
}) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: `Привет! Я ${botName}. Как дела? 👋`,
      user: {
        id: 'bot',
        name: botName,
        avatar: botAvatar
      },
      timestamp: new Date()
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      user: {
        id: 'user',
        name: 'Вы'
      },
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Вызываем callback для отправки сообщения
      if (onSendMessage) {
        const botResponse = await onSendMessage(message);
        
        // Добавляем ответ бота
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponse || "Извините, произошла ошибка. Попробуйте еще раз.",
          user: {
            id: 'bot',
            name: botName,
            avatar: botAvatar
          },
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Извините, произошла ошибка. Попробуйте еще раз.",
        user: {
          id: 'bot',
          name: botName,
          avatar: botAvatar
        },
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Кастомные цвета для стильного дизайна
  const customColorSet = {
    // Контейнер
    "--container-background-color": "rgba(255, 255, 255, 0.95)",
    
    // Заголовок
    "--message-header-background-color": theme,
    "--message-header-text-color": "#ffffff",
    
    // Список сообщений
    "--messagelist-background-color": "rgba(248, 250, 252, 0.8)",
    
    // Входящие сообщения (от бота)
    "--incoming-message-background-color": "#f1f5f9",
    "--incoming-message-text-color": "#334155",
    "--incoming-message-name-text-color": theme,
    "--incoming-message-timestamp-color": "#64748b",
    
    // Исходящие сообщения (от пользователя)
    "--outgoing-message-background-color": theme,
    "--outgoing-message-text-color": "#ffffff",
    "--outgoing-message-timestamp-color": "rgba(255, 255, 255, 0.8)",
    
    // Поле ввода
    "--input-background-color": "#ffffff",
    "--input-text-color": "#334155",
    "--input-placeholder-color": "#94a3b8",
    "--input-send-color": theme,
    "--input-element-color": theme,
  };

  if (!isVisible) return null;

  return (
    <div className="modern-chat-widget">
      <MinChatUiProvider theme={theme} colorSet={customColorSet}>
        <MainContainer style={{ 
          height: '500px', 
          width: '350px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <MessageContainer>
            <MessageHeader 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {botAvatar && (
                  <img 
                    src={botAvatar} 
                    alt={botName}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{botName}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {isTyping ? 'печатает...' : 'онлайн'}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </MessageHeader>
            
            <MessageList
              currentUserId="user"
              messages={messages}
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)'
              }}
            />
            
            {isTyping && (
              <div style={{
                padding: '8px 16px',
                fontSize: '14px',
                color: '#64748b',
                fontStyle: 'italic'
              }}>
                {botName} печатает...
              </div>
            )}
            
            <MessageInput 
              placeholder={`Напишите сообщение ${botName}...`}
              onSend={handleSendMessage}
              style={{
                margin: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            />
          </MessageContainer>
        </MainContainer>
      </MinChatUiProvider>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ModernChatWidget; 