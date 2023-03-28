const mysql = require('mysql2');

const table_name = `MYSQL_KV`;

class KV {
    constructor(database_url) {
        this.database_url = database_url;
    }

    async get(key, defaultValue = null) {
        const sql = 'SELECT * FROM ' + table_name + ' WHERE `KEY` = ? AND ((TTL > 0 AND EXPIRY_DATE >= ?) OR TTL = 0)';

        let connection, value;

        try {
            connection = mysql.createConnection(this.database_url);

            const [rows] = await connection.promise().query(sql, [key, new Date()]);

            const data = rows?.shift();

            value = defaultValue;

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
        } catch (e) {
            console.error(e);
        } finally {
            if (connection) {
                await connection.end();
            }
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

        let connection;

        try {
            if (!Number.isInteger(ttl)) {
                throw new Error("Value for ttl is not an integer.");
            }

            connection = mysql.createConnection(this.database_url);

            const [rows] = await connection.promise().query(sql, [
                key, value, ttl, dataType, expiryDate, dateNow, dateNow,
                value, ttl, dataType, expiryDate, dateNow
            ]);

            if (connection) {
                try {
                    await connection.end();
                } catch (e) {
                    console.error(e);
                }
            }

            return rows;
        } catch (e) {
            console.error(e);
        }
    }

    async delete(key) {
        const sql = 'DELETE FROM ' + table_name + ' WHERE `KEY` = ? ';

        let connection;

        try {
            connection = mysql.createConnection(this.database_url);

            await connection.promise().query(sql, [key]);
        } catch (e) {
            console.error(e);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async cleanup() {
        const sql = 'DELETE FROM ' + table_name + ' WHERE TTL > 0 AND EXPIRY_DATE < ? ';

        let connection;

        try {
            connection = mysql.createConnection(this.database_url);
            
            await connection.promise().query(sql, [new Date()]);
        } catch (e) {
            console.error(e);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = { KV };