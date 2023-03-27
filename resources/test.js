const { KV } = require(process.cwd() + '/index.js');

const kv = new KV(process.env.DATABASE_URL);

let data;

(async function () {
    // --- string
    await kv.set("KEY_1", "value_1");

    data = await kv.get("KEY_1");

    console.log(typeof data, data, typeof data == "string" && data == "value_1");

    // --- number
    await kv.set("KEY_1", 11, 10);

    data = await kv.get("KEY_1");

    console.log(typeof data, data, typeof data == "number" && data == 11);

    // --- object
    await kv.set("KEY_1", { a: "b", "c": "d" }, 23);

    data = await kv.get("KEY_1");

    console.log(typeof data, data, typeof data == "object" && JSON.stringify(data) == JSON.stringify({ a: "b", c: "d" }));

    // --- null
    await kv.set("KEY_1", null, 30);

    data = await kv.get("KEY_1");

    console.log(typeof data, data, typeof data == "object" && data == null);


    // --- delete
    await kv.delete("KEY_1");

    data = await kv.get("KEY_1");

    console.log(`Deleted`, data, data == null);
})();