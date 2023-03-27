const { KV } = require(process.cwd() + '/index.js');

const kv = new KV(process.env.DATABASE_URL);

let data;

(async function () {
    // --- string
    await kv.set("KEY_1", "value_1");

    data = await kv.get("KEY_1");
    console.log("string value:", typeof data == "string" && data == "value_1");

    // --- number
    await kv.set("KEY_1", 11, 10);

    data = await kv.get("KEY_1");
    console.log("number value:", typeof data == "number" && data == 11);

    // --- object
    await kv.set("KEY_1", { a: "b", "c": "d" }, 23);

    data = await kv.get("KEY_1");
    console.log("object value:", typeof data == "object" && JSON.stringify(data) == JSON.stringify({ a: "b", c: "d" }));

    // --- null
    await kv.set("KEY_1", null, 30);

    data = await kv.get("KEY_1");
    console.log("null value:", typeof data == "object" && data == null);


    // --- delete
    await kv.delete("KEY_1");

    data = await kv.get("KEY_1");

    console.log(`deleted:`, data == null);

    // --- for cleanup
    await kv.set("KEY_2", "cleanup", 1);
    await kv.set("KEY_3", "retained");
    await kv.set("KEY_4", "after 5 seconds", 5);

    data = await kv.get("KEY_2");
    console.log("for cleanup:", typeof data == "string" && data == "cleanup");

    await sleep(2000);

    await kv.cleanup();

    data = await kv.get("KEY_2");
    console.log("cleaned up data:", typeof data == "object" && data == null);

    data = await kv.get("KEY_3");
    console.log("retained data:", typeof data == "string" && data == "retained");

    data = await kv.get("KEY_4");
    console.log("for cleanup after 5 seconds:", typeof data == "string" && data == "after 5 seconds");

    await sleep(5000);

    await kv.cleanup();

    data = await kv.get("KEY_4");
    console.log("5 seconds passed:", typeof data == "object" && data == null);
})();

async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms || 0);
    });
}
