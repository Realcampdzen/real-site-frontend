const OPENAI_API_URL = 'http://localhost:3001/chat';

async function sendMessageToBro(message) {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  return data.reply.trim();
}

document.addEventListener('DOMContentLoaded', () => {
  const chatButton = document.getElementById('chat-button');
  const chatBox = document.getElementById('chat-box');
  const chatWindow = document.getElementById('chat-window');
  const input = document.getElementById('chat-input');
  const sendButton = document.getElementById('chat-send');

  // Открытие и закрытие чата
  chatButton.addEventListener('click', () => {
    chatBox.classList.toggle('hidden');
  });

  // Отправка сообщения
  sendButton.addEventListener('click', async () => {
    const userMessage = input.value.trim();
    if (!userMessage) return;

    chatWindow.innerHTML += `<div class="chat-message user">Вы: ${userMessage}</div>`;
    input.value = '';

    try {
      const broReply = await sendMessageToBro(userMessage);
      chatWindow.innerHTML += `<div class="chat-message bro">Бро: ${broReply}</div>`;
      chatWindow.scrollTop = chatWindow.scrollHeight;
    } catch (err) {
      chatWindow.innerHTML += `<div class="chat-message bro">Ошибка: ${err.message}</div>`;
    }
  });
});
