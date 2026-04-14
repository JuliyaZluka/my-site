// api/chat.js — финальная версия для DotPain (DeepSeek)
export default async function handler(req, res) {
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
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Метод не поддерживается' });

  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API ключ не настроен' });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://llms.dotpoin.com/v1/chat/completions', {
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

Твоя задача: отвечать на вопросы о ценах, сроках, услугах и контактах. Отвечай кратко, полезно и вежливо.

Информация о Юлии:
- Стоимость сайта: от 10 000 руб. за простой лендинг, лендинг с внедренным ИИ-ассистентом 15 000р. 
- Срок разработки: 3-7 дней зависит от сложности
- Услуги: лендинги, адаптация под мобильные устройства, формы обратной связи, ИИ-ассистенты
- Контакты: телефон +7 978 450-31-09, телеграмм:@Juliyazluka, email ddf25@mail.ru

Правила ответов:
1. Сначала дай полезный ответ на вопрос.
2. Не предлагай связаться с Юлией, если вопрос стандартный (цена, сроки, услуги).
3. Только если вопрос совсем не по теме (например, про погоду или политику), мягко скажи: "Я специализируюсь на сайтах. По этому вопросу лучше написать Юлии лично."
4. Не повторяй контакты в каждом ответе — только если пользователь явно спросил "как связаться".`
          },
          { role: 'user', content: message }
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
    res.status(500).json({ error: 'Сервис временно недоступен' });
  }
}
