const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai'); // v3 синтаксис

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Ты — рыжий кот Бро, нейроассистент Степана. Пиши коротко, дружелюбно, с лёгкой иронией.',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('❌ Ошибка на сервере:', error.message);
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Сервер работает на http://localhost:${port}`);
});
