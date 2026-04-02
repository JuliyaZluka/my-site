// api/chat.js — полная версия с системным промптом
export default async function handler(req, res) {
  // Разрешаем запросы с вашего сайта
  const allowedOrigins = [
    'https://juliyazluka.github.io',
    'https://my-site-bice-three.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Ответ на предварительный запрос браузера
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const VSEGPT_API_KEY = process.env.VSEGPT_API_KEY;

  if (!VSEGPT_API_KEY) {
    return res.status(500).json({ error: 'API ключ не настроен' });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://api.vseppt.ru/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VSEGPT_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b',
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
Отвечай кратко, по делу, вежливо, без лишних слов. Если вопрос не по теме — предложи связаться с Юлией напрямую.`
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
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Сервис временно недоступен. Попробуйте позже.' });
  }
}
