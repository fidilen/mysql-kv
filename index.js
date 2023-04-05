const mysql = require('mysql2');

const table_name = `MYSQL_KV`;

class KV {
    constructor(params) {
        this.params = params;
    }

    async get(key, defaultValue = null) {
        const sql = 'SELECT * FROM ' + table_name + ' WHERE `KEY` = ? AND ((TTL > 0 AND EXPIRY_DATE >= ?) OR TTL = 0)';

        let value;

        try {
            const rows = await execute(this.params, sql, [key, new Date()]);

            const data = rows?.shift();

            value = defaultValue;

            if (data?.VALUE) {
                value = await parseValue(data.DATA_TYPE, data.VALUE);
            }
        } catch (e) {
            throw new Error(e);
        }

        return value;
    }

    async set(key, value, ttl = 0) {
        const sql =
            ' INSERT INTO ' + table_name + ' (`KEY`, `VALUE`, TTL, DATA_TYPE, EXPIRY_DATE, CREATED_DATE, UPDATED_DATE) ' +
            `   VALUES (?, ?, ?, ?, ?, ?, ?) ` +
            ` ON DUPLICATE KEY UPDATE ` +
            '    `VALUE` = ? ' +
            `   , TTL = ? ` +
            `   , DATA_TYPE = ? ` +
            `   , EXPIRY_DATE = ? ` +
            `   , UPDATED_DATE = ? `;

        const dateNow = new Date();
        const expiryDate = new Date(dateNow.getTime() + (ttl * 1000));

        const dataType = typeof value;

        value = (dataType == "object") ? JSON.stringify(value) : `${value}`;

        try {
            if (!Number.isInteger(ttl)) {
                throw new Error("Value for ttl is not an integer.");
            }

            const rows = await execute(this.params, sql, [
                key, value, ttl, dataType, expiryDate, dateNow, dateNow,
                value, ttl, dataType, expiryDate, dateNow
            ]);

            return rows;
        } catch (e) {
            throw new Error(e);
        }
    }

    async delete(key) {
        const sql = 'DELETE FROM ' + table_name + ' WHERE `KEY` = ? ';

        try {
            await execute(this.params, sql, [key]);
        } catch (e) {
            throw new Error(e);
        }
    }

    async cleanup() {
        const sql = 'DELETE FROM ' + table_name + ' WHERE TTL > 0 AND EXPIRY_DATE < ? ';

        try {
            await execute(this.params, sql, [new Date()]);
        } catch (e) {
            throw new Error(e);
        }
    }

    async filter(key, defaultValue = []) {
        const sql = 'SELECT * FROM ' + table_name + ' WHERE UPPER(`KEY`) LIKE UPPER(?) AND ((TTL > 0 AND EXPIRY_DATE >= ?) OR TTL = 0)';

        let data;

        try {
            const rows = await execute(this.params, sql, [`%${key}%`, new Date()]);

            data = await Promise.all(rows?.map(async (row) => {
                return {
                    key: row.KEY,
                    value: await parseValue(row.DATA_TYPE, row.VALUE)
                }
            })) || defaultValue;
        } catch (e) {
            throw new Error(e);
        }

        return data;
    }
}

async function execute(params, sql, criteria) {
    let pool = mysql.createPool(params);

    try {
        const [rows] = await pool.promise().execute(sql, criteria);

        return rows;
    } catch (e) {
        throw new Error(e);
    }
}

async function parseValue(type, value) {
    let parsed = value;

    switch (type) {
        case "object":
        case "number":
        case "boolean":
            parsed = JSON.parse(value);

            break;
        case "string":
        default:
            parsed = value;

            break;
    }

    return parsed;
}

module.exports = { KV };