// api/chat.js
export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  // Получаем API ключ из переменных окружения (защищено)
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

  // Если ключ не задан
  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API ключ не настроен' });
  }

  try {
    const { message } = req.body;

    // Проверяем, что сообщение пришло
    if (!message) {
      return res.status(400).json({ error: 'Сообщение не получено' });
    }

    // Запрос к DeepSeek API
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
- Имя: Юлия
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

    // Проверяем ответ от DeepSeek
    if (data.error) {
      console.error('DeepSeek API error:', data.error);
      return res.status(500).json({ error: 'Ошибка от нейросети' });
    }

    const reply = data.choices[0].message.content;
    
    // Возвращаем ответ
    res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Сервис временно недоступен. Попробуйте позже.' });
  }
}
