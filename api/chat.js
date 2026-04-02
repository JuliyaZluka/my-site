// api/chat.js — версия для VseGPT
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
  const VSEGPT_API_KEY = process.env.VSEGPT_API_KEY;

  if (!VSEGPT_API_KEY) {
    console.error('VSEGPT_API_KEY is not set');
    return res.status(500).json({ error: 'API ключ не настроен на сервере' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Сообщение не получено' });
    }

    // Запрос к API VseGPT
    const response = await fetch('https://api.vseppt.ru/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VSEGPT_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b',  // мощная бесплатная модель
        messages: [
          {
            role: 'system',
            content: `Ты — дружелюбный помощник Юлии, которая создаёт одностраничные сайты.
Отвечай кратко, по делу, вежливо.
Информация о Юлии:
- Стоимость сайта: от 10 000 руб.
- Срок разработки: 3-7 дней
- Услуги: лендинги, адаптация под мобильные устройства, формы обратной связи, ИИ-ассистенты
- Контакты: телефон +7 965 106-85-68, email ddf25@mail.ru
Если вопрос не по теме — предложи связаться с Юлией напрямую.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    // Проверка на ошибки
    if (data.error) {
      console.error('VseGPT API error:', data.error);
      return res.status(500).json({ error: `Ошибка: ${data.error.message || 'неизвестная ошибка'}` });
    }
    
    // Извлекаем ответ
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Сервис временно недоступен. Попробуйте позже.' });
  }
}
