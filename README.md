# mysql-kv
mysql-kv is a package that provides key-value store capabilities with time-to-live (TTL) expiration in MySQL.

## Table
```sql
CREATE TABLE MYSQL_KV (
    `KEY` VARCHAR(512) NOT NULL,
    `VALUE` LONGTEXT,
    `TTL` INT,
    `DATA_TYPE` VARCHAR(20),
    `EXPIRY_DATE` DATETIME,
    `CREATED_DATE` DATETIME,
    `UPDATED_DATE` DATETIME,
    PRIMARY KEY (`KEY`)
);
```

## Usage
```js
const { KV } = require('mysql-kv');

// See details: Other Configurations
const kv = new KV({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

await kv.get("key");                // get record by key
await kv.set("key", "value", 10);   // set record by key with value and time to live
await kv.delete("key");             // delete record by key
await kv.cleanup();                 // delete expired records
await kv.filter("key");             // filter by key - case insensitive
await kv.entries();                 // retrieve all KV records
await kv.custom(query, criteria);   // custom query: query - parameterized sql; criteria - array of ordered parameters for the sql
```

## Other Configurations
```js
const kv = new KV({
  host: process.env.DB_HOST,                    //The hostname of the database you are connecting to. (Default: localhost)
  database: process.env.DB_DATABASE,            //Name of the database to use for this connection (Optional).
  user: process.env.DB_USERNAME,                //The MySQL user to authenticate as.
  password: process.env.DB_PASSWORD,            //The password of that MySQL user.
  port: process.env.PORT,                       //Port for the database
  
  // The following configuration options have been pre-set to allow for ease of use.

  //ssl:
  //Object with ssl parameters or a string containing name of ssl profile.
  ssl: {
    rejectUnauthorized: false,
  },

  //socketPath:
  //The path to a unix domain socket to connect to. When used host and port are ignored.
  socketPath: `/var/run/mysqld/mysqld.sock` ?? `127.0.0.1:3306`

  //charset:
  //The charset for the connection. This is called "collation" in the SQL-level of MySQL (like utf8_general_ci).
  //If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used. (Default: 'UTF8_GENERAL_CI')
  charset: 'utf8mb4',

  //debug:
  //Prints protocol details to stdout.
  //Can be true/false or an array of packet type names that should be printed. (Default: false)
  debug: false,

  //trace:
  //Generates stack traces on Error to include call site of library entrance ("long stack traces").
  //Slight performance penalty for most calls. (Default: true)
  trace: false,

  //connectTimeout:
  //The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10000)
  connectTimeout: 10000,

  //waitForConnections:
  //Determines the pool's action when no connections are available and the limit has been reached.
  //If true, the pool will queue the connection request and call it when one becomes available. If false, the pool will immediately call back with an error. (Default: true)
  waitForConnections: true,

  //connectionLimit:
  //The maximum number of connections to create at once. (Default: 10)
  connectionLimit: 100,

  //queueLimit:
  //The maximum number of connection requests the pool will queue before returning an error from getConnection.
  //If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
  queueLimit: 0,

  //stringifyObjects:
  //Stringify objects instead of converting to values. (Default: false)
  stringifyObjects: false,

  //supportBigNumbers:
  //When dealing with big numbers (BIGINT and DECIMAL columns) in the database,
  //you should enable this option (Default: false)
  supportBigNumbers: false,

  //bigNumberStrings:
  //Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns)
  //to be always returned as JavaScript String objects (Default: false)
  bigNumberStrings: false,
});
```

## Need Assistance?
Contact the developer via [Discord](https://discord.gg/Urt5S2Ucju).

## Notifications
Want to get notified when the developer releases new projects?
<br/>Check out these [socials](https://linktr.ee/fidilen)!

## Buy Me a Coffee?
Did you find this application helpful and would like to support the developer?<br/>
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U6U7E7WXM)
