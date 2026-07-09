import Redis from "ioredis";
const redis = new Redis("redis://localhost:6379");

async function testLua() {
  const testKey = "test:count:akash";

  // Test karne ke liye pehle purani key ko delete kar dete hain
  await redis.del(testKey);

  // Ekdum choti Lua script: Agar key nahi hai to 1 bhejegi, agar hai to 0
  const simpleScript = `
    local exists = redis.call('exists', KEYS[1])
    if exists == 1 then
        return "Bhai key pehle se hai!"
    else
        redis.call('set', KEYS[1], "nawa_data")
        return "Nayi key bana di!"
    end
  `;

  // Pehli baar chalayenge (Jab key nahi hai)
  const res1 = await redis.eval(simpleScript, 1, testKey);
  console.log("First Run Output:", res1);

  // Dusri baar chalayenge (Jab key ab ban chuki hai)
  const res2 = await redis.eval(simpleScript, 1, testKey);
  console.log("Second Run Output:", res2);

  redis.eval(simpleScript, 1, testKey);

  redis.quit();
}

testLua();
