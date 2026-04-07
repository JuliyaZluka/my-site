// api/chat.js — умная имитация ИИ (без API, бесплатно)
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
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Сообщение не получено' });
    }

    // Приводим сообщение к нижнему регистру для удобного поиска ключевых слов
    const lowerMessage = message.toLowerCase();
    
    // База знаний Юлии (все ответы)
    let reply = '';
    
    // Вопросы о цене
    if (lowerMessage.includes('цена') || 
        lowerMessage.includes('стоит') || 
        lowerMessage.includes('сколько') ||
        lowerMessage.includes('денег') ||
        lowerMessage.includes('рублей')) {
      reply = '📌 Стоимость разработки одностраничного сайта — от 10 000 рублей. Точная цена зависит от сложности и дополнительных функций. Напишите, что вам нужно, и я сделаю индивидуальный расчёт!';
    }
    
    // Вопросы о сроках
    else if (lowerMessage.includes('срок') || 
             lowerMessage.includes('долго') ||
             lowerMessage.includes('дней') ||
             lowerMessage.includes('быстро')) {
      reply = '⏱️ Обычно разработка сайта занимает 3–7 дней. Всё зависит от сложности и скорости обратной связи с вами. Срочные заказы обсуждаем отдельно!';
    }
    
    // Вопросы об услугах
    else if (lowerMessage.includes('услуг') || 
             lowerMessage.includes('делаешь') ||
             lowerMessage.includes('созда') ||
             lowerMessage.includes('разработ') ||
             lowerMessage.includes('лендинг')) {
      reply = '💻 Я создаю продающие лендинги, адаптирую сайты под мобильные устройства, добавляю формы обратной связи и ИИ-ассистентов, как этот чат. Всё под ключ — от идеи до запуска!';
    }
    
    // Вопросы о портфолио
    else if (lowerMessage.includes('портфолио') || 
             lowerMessage.includes('пример') ||
             lowerMessage.includes('работа')) {
      reply = '🎨 Примеры моих работ можно посмотреть на этом сайте. Вот он — перед вами! Если нужны другие примеры — напишите, я покажу больше.';
    }
    
    // Вопросы о контактах
    else if (lowerMessage.includes('контакт') || 
             lowerMessage.includes('связаться') ||
             lowerMessage.includes('позвонить') ||
             lowerMessage.includes('написать') ||
             lowerMessage.includes('телефон') ||
             lowerMessage.includes('почта') ||
             lowerMessage.includes('email')) {
      reply = '📞 Связаться со мной можно по телефону: +7 978 450-31-08 или по почте: ddf25@mail.ru. Буду рада ответить на все вопросы!';
    }
    
    // Приветствия
    else if (lowerMessage.includes('привет') || 
             lowerMessage.includes('здравствуй') ||
             lowerMessage.includes('добрый день') ||
             lowerMessage.includes('доброе утро') ||
             lowerMessage.includes('добрый вечер') ||
             lowerMessage === 'hi' ||
             lowerMessage === 'hello') {
      reply = '👋 Привет! Я ИИ-помощник Юлии. Расскажу о создании сайтов, ценах и сроках. Что вас интересует?';
    }
    
    // Благодарности
    else if (lowerMessage.includes('спасиб') || 
             lowerMessage.includes('благодар')) {
      reply = '🙏 Пожалуйста! Обращайтесь, если появятся вопросы. Юлия всегда на связи!';
    }
    
    // Если ничего не подошло
    else {
      reply = '🤔 Я ещё учусь отвечать на такие вопросы. Лучше всего задать вопрос о создании сайтов, ценах, сроках или контактах. Например: "Сколько стоит сайт?" или "Какие у вас услуги?". Или напишите Юлии напрямую — она ответит лично!';
    }
    
    // Отправляем ответ
    res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Сервис временно недоступен' });
  }
}
