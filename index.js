const mysql = require('mysql2');

const table_name = `MYSQL_KV`;

class KV {
    constructor(database_url) {
        this.connection = mysql.createConnection(database_url);
    }

    async get(key, defaultValue = null) {
        const sql = 'SELECT * FROM ' + table_name + ' WHERE `KEY` = ? AND ((TTL > 0 AND EXPIRY_DATE >= ?) OR TTL = 0)';

        try {
            const [rows] = await this.connection.promise().query(sql, [key, new Date()]);

            const data = rows?.shift();

            let value = defaultValue;

            if (data?.VALUE) {
                switch (data.DATA_TYPE) {
                    case "object":
                    case "number":
                    case "boolean":
                        value = JSON.parse(data.VALUE);

                        break;
                    case "string":
                    default:
                        value = data.VALUE;

                        break;
                }
            }


            return value;
        } catch (e) {
            console.error(e);
        }
    }

    async set(key, value, ttl = 0) {
        const sql =
            ' INSERT INTO ' + table_name + ' (`KEY`, `VALUE`, TTL, DATA_TYPE, EXPIRY_DATE_ISO, EXPIRY_DATE, CREATED_DATE, UPDATED_DATE) ' +
            `   VALUES (?, ?, ?, ?, ?, ?, ?, ?) ` +
            ` ON DUPLICATE KEY UPDATE ` +
            '    `VALUE` = ? ' +
            `   , TTL = ? ` +
            `   , DATA_TYPE = ? ` +
            `   , EXPIRY_DATE_ISO = ? ` +
            `   , EXPIRY_DATE = ? ` +
            `   , UPDATED_DATE = ? `;

        const dateNow = new Date();
        const expiryDate = new Date(dateNow.getTime() + (ttl * 1000));
        const expiryDateISOString = expiryDate.toISOString();

        const dataType = typeof value;

        value = (dataType == "object") ? JSON.stringify(value) : `${value}`;

        try {
            if (!Number.isInteger(ttl)) {
                throw new Error("Value for ttl is not an integer.");
            }

            const [rows] = await this.connection.promise().query(sql, [
                key, value, ttl, dataType, expiryDateISOString, expiryDate, dateNow, dateNow,
                value, ttl, dataType, expiryDateISOString, expiryDate, dateNow
            ]);

            return rows;
        } catch (e) {
            console.error(e);
        }
    }

    async delete(key) {
        const sql = 'DELETE FROM ' + table_name + ' WHERE `KEY` = ? ';

        try {
            await this.connection.promise().query(sql, [key]);

            return;
        } catch (e) {
            console.error(e);
        }
    }

    async cleanup() {
        const sql = 'DELETE FROM ' + table_name + ' WHERE TTL > 0 AND EXPIRY_DATE < ? ';

        try {
            await this.connection.promise().query(sql, [new Date()]);

            return;
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = { KV };