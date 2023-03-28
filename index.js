require('dotenv').config();
const schedule = require('node-schedule');
const { KV } = require('mysql-kv');
const axios = require('axios');

const kv = new KV(process.env.DATABASE_URL);

// Executes every 15th minute of each hour, modify cron below
schedule.scheduleJob('0 * * * *', async () => {
    try {
        await kv.cleanup();

        await notifyDiscordWebhook(); // this is optional
    } catch (e) {
        console.error(e);
    }
});

async function notifyDiscordWebhook() {
    axios.post(`${process.env.DISCORD_WEBHOOK_URL}`, {
        username: "KV Cleaner",
        avatar_url: "",
        content: `Cleanup triggered: <t:${Math.floor(new Date().getTime() / 1000)}>`
    }).catch(function (error) {
        console.log(error);
    });
}