const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const { connectToDb, getDb } = require('./db'); // Путь к вашему модулю подключения к базе данных
const BOT=process.env.BOT_TOKEN
// Замените 'YOUR_BOT_TOKEN' на ваш действительный токен бота
const bot = new TelegramBot(BOT, { polling: true });

// Путь к вашему изображению
const photoPath = path.join(__dirname, 'logo.png'); // Замените 'your-photo-file.png' на ваше имя файла изображения

// Содержание сообщения
const message = `
<b>Welcome to</b> <b><u>USDTStaking App</u></b>
<b>Stack-To-Earn</b>

Welcome, <a href="https://t.me/usdtstaking_news">USDTStaking App</a>! 🤝

🚀 <b>Discover the revolutionary Stack-To-Earn app built on Telegram!</b>

Experience limitless opportunities for Stake USDT. Our infrastructure, powered by TRON blockchain, ensures optimized transactions and reduced transfer fees.

Be among the pioneers in earning with Tonix!

Complete missions, invite friends, rent additional mining power to earn even more.

Don't miss the opportunity to increase your income and strive for financial independence with us! 💰🚀

<b>Tap Start App 👇</b>
`;

// Кнопки (Клавиатура)
const options = {
    parse_mode: 'HTML',
    reply_markup: {
        inline_keyboard: [
            [
                { text: '⚡ Start App ⚡', web_app: { url: 'https://66afb02aa7f4c7c3d41e2066--luxury-narwhal-b92ac9.netlify.app/' } },
            ],
            [
                { text: '🎁 Join Community! 🎁', url: 'https://t.me/usdtstaking_group/1' }
            ]
        ]
    }
};

// Функция для обработки сообщений
const handleMessage = async (msg) => {
    const chatId = msg.chat.id;
    const db = getDb();
    const usersCollection = db.collection('usersDATA');

    // Сохранение пользователя в базу данных
    const user = {
        chatId: chatId,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        username: msg.from.username,
    };
    await usersCollection.updateOne({ chatId: chatId }, { $set: user }, { upsert: true });

    // Отправка фото с подписью
    bot.sendPhoto(chatId, photoPath, { caption: message, ...options });
};

// Подключение к базе данных и запуск бота
connectToDb((err) => {
    if (err) {
        console.error('Failed to connect to the database', err);
        process.exit(1);
    } else {
        console.log('Connected to the database');
        bot.on('message', handleMessage);
    }
});
