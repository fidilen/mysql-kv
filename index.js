require('dotenv').config();
const schedule = require('node-schedule');
const { KV } = require('mysql-kv');
const axios = require('axios');

const kv = new KV({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

// Executes every 15th minute of each hour, modify cron below
schedule.scheduleJob('15 * * * *', async () => {
    await cleanup();
});

// immediate trigger
(async () => {
    await cleanup();
})();

async function cleanup() {
    try {
        await kv.cleanup();

        await notifyDiscordWebhook(); // this is optional
    } catch (e) {
        console.error(e);

        await notifyDiscordWebhook(e);
    }
}

async function notifyDiscordWebhook(error) {
    const message = error || `Cleanup triggered: <t:${Math.floor(new Date().getTime() / 1000)}>`;

    axios.post(`${process.env.DISCORD_WEBHOOK_URL}`, {
        username: "KV Cleaner",
        avatar_url: "",
        content: message
    }).catch(function (error) {
        console.log(error);
    });
}