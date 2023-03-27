require('dotenv').config();
const schedule = require('node-schedule');
const { KV } = require('mysql-kv');

const kv = new KV(process.env.DATABASE_URL);

// Executes every 15th minute of each hour
schedule.scheduleJob('15 * * * *', async () => {
    try {
        await kv.cleanup();
    } catch (e) {
        console.error(e);
    }
});