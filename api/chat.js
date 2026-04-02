// api/chat.js
export default async function handler(req, res) {
  // Настройка CORS — разрешаем запросы с GitHub Pages
  const allowedOrigins = [
    'https://juliyazluka.github.io',
    'https://my-site-bice-three.vercel.app'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Обрабатываем OPTIONS запрос
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API ключ не настроен' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Сообщение не получено' });
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `Ты — дружелюбный помощник Юлии, которая создаёт одностраничные сайты.
Твоя задача: отвечать на вопросы о ценах, сроках, услугах.
Информация о Юлии:
- Стоимость сайта: от 10 000 руб.
- Срок разработки: 3-7 дней
- Услуги: лендинги, адаптация под мобильные устройства, формы обратной связи, ИИ-ассистенты
- Контакты: телефон +7 965 106-85-68, email ddf25@mail.ru
Отвечай кратко, по делу, вежливо.`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Сервис временно недоступен' });
  }
}
