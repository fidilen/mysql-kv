# planetscale-kv
Package utility for mysql-kv, this is built via Planetscale database. Possibly useable for other MySQL servers.

## Table
```sql
CREATE TABLE TTL (
    `KEY` VARCHAR(512) NOT NULL,
    `VALUE` LONGTEXT,
    TTL INT,
    DATA_TYPE VARCHAR(20),
    EXPIRY_DATE_ISO VARCHAR(255),
    EXPIRY_DATE DATETIME,
    CREATED_DATE DATETIME,
    UPDATED_DATE DATETIME,
    PRIMARY KEY (`KEY`)
);
```

## Usage
```js
const { KV } = require('planetscale-kv');

const kv = new KV(process.env.DATABASE_URL);

await kv.get("key");
await kv.set("key", "value", 10);
await kv.delete("key");
```

## Need Assistance?
Contact the developer via [Discord](https://discord.gg/Urt5S2Ucju).

## Notifications
Want to get notified when the developer releases new projects?
<br/>Check out these [socials](https://linktr.ee/fidilen)!

## Buy Me a Coffee?
Did you find this application helpful and would like to support the developer?<br/>
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U6U7E7WXM)
