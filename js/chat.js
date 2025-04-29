// js/chat.js

const OPENAI_API_KEY = 'ТВОЙ_КЛЮЧ_СЮДА'; // Вставь сюда свой OpenAI API-ключ

async function sendMessageToBro(message) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o', // Или 'gpt-4o-mini', если будет доступен
      messages: [
        { role: 'system', content: 'Ты рыжий кот Бро, нейроассистент Степана. Пиши коротко, дружелюбно, с лёгкой иронией.' },
        { role: 'user', content: message }
      ],
      max_tokens: 200,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

document.getElementById('chat-send').addEventListener('click', async () => {
  const input = document.getElementById('chat-input');
  const chatWindow = document.getElementById('chat-window');
  const userMessage = input.value.trim();

  if (!userMessage) return;

  chatWindow.innerHTML += `<div class="chat-message user">Вы: ${userMessage}</div>`;
  input.value = '';

  const broReply = await sendMessageToBro(userMessage);

  chatWindow.innerHTML += `<div class="chat-message bro">Бро: ${broReply}</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

document.getElementById('chat-button').addEventListener('click', () => {
  const chatBox = document.getElementById('chat-box');
  chatBox.classList.toggle('hidden');
});
