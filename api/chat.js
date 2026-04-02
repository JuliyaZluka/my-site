// api/chat.js
export default async function handler(req, res) {
  // Настройка CORS — разрешаем запросы с ваших доменов
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
  
  // Обрабатываем предварительный OPTIONS запрос
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  // Получаем API ключ из переменных окружения Vercel
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'API ключ не настроен на сервере' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Сообщение не получено' });
    }

    // Запрос к Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Ты — дружелюбный помощник Юлии, которая создаёт одностраничные сайты.
Твоя задача: отвечать на вопросы о ценах, сроках, услугах.
Информация о Юлии:
- Стоимость сайта: от 10 000 руб.
- Срок разработки: 3-7 дней
- Услуги: лендинги, адаптация под мобильные устройства, формы обратной связи, ИИ-ассистенты
- Контакты: телефон +7 965 106-85-68, email ddf25@mail.ru
Отвечай кратко, по делу, вежливо, без лишних слов. Если вопрос не по теме — предложи связаться с Юлией напрямую.

Вопрос пользователя: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    const data = await response.json();

    // Проверка на ошибки от Gemini API
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return res.status(500).json({ error: `Ошибка Gemini: ${data.error.message}` });
    }
    
    // Извлекаем ответ
    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Сервис временно недоступен. Попробуйте позже.' });
  }
}
