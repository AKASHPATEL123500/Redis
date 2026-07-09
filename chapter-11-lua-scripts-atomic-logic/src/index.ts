import express from "express";
import Redis from "ioredis";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/lua/v1", async (req: Request, res: Response) => {
  const result = await redis.eval(
    `
    return "Hello Akash"
    `,
    0,
  );

  return res.json({ result: result });
});

app.get("/lua/v2", async (req: Request, res: Response) => {
  const result = await redis.eval(
    `
     redis.call("SET","name","Akash")
     return redis.call("GET","name")
    `,
    0,
  );
  return res.json({ result: result });
});

app.get("/lua/v3", async (req: Request, res: Response) => {
  const result = await redis.eval(
    `
    redis.call("SET","age","22")

    redis.call("INCR","age")

    return redis.call("GET","age")
    
    `,
    0,
  );

  res.json({ result: result });
});

app.get("/lua/v4", async (req: Request, res: Response) => {
  const result = await redis.eval(
    `
redis.call("SET",KEYS[1],ARGV[1])

return redis.call("GET",KEYS[1])

`,

    1,

    "framework",

    "Express",
  );

  res.json({ result: result });
});

app.get("/lua/v5", async (req: Request, res: Response) => {
  const result = await redis.eval(
    `
redis.call("SET",KEYS[1],ARGV[1])
return redis.call("GET",KEYS[1])

`,
    1,

    "database",

    "Redis",
  );

  res.json({ result: result });
});

app.get("/lua/v6", async (req: Request, res: Response) => {
  const result = await redis.eval(
    `
redis.call("SET",KEYS[1],ARGV[1])
redis.call("INCR",KEYS[2])
return redis.call("GET",KEYS[2])

`,

    2,

    "username",
    "loginCount",

    "Akash",
  );

  res.json({ result: result });
});

app.get("/lua/v7", async (req: Request, res: Response) => {
  const script = `
  local marks = 40;
  if marks >= 50 then
  return "PASS"
  end
  return "FAIL"
  `;

  const scriptAge = `
  local age = 18;

  if age >= 18 then
  return "You can vote!"
  end
  return "You are Teen"
  `;

  await redis.set("balance", 1000);

  const scriptBalance = `
  local balance = tonumber(redis.call("GET", KEYS[1])) or 0
  local amount = tonumber(ARGV[1]) or 0

  if balance >= amount then
    local newBalance = balance - amount
    redis.call("SET", KEYS[1], newBalance)
    return newBalance
  end

  return "Insufficient Balance"
  `;

  const before = await redis.get("balance");
  const response = await redis.eval(scriptBalance, 1, "balance", 1000);
  const after = await redis.get("balance");
  // syntax:
  // redis.eval(script, numberOfKeys, key1, key2, ...arg1, arg2);

  res.json({
    currentBlance: response,
    before: before,
    acfter: after,
    explanation: {
      keys: "KEYS[1] is the Redis key name passed from the script call",
      argv: "ARGV[1] is the value passed to the script",
    },
  });
});

app.get("/lua/rate-limit", async (req: Request, res: Response) => {
  const clientId = req.query.clientId || "anonymous";
  const limit = 5;
  const windowSeconds = 60;

  const script = `
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])

    local current = redis.call("INCR", key)

    if current == 1 then
      redis.call("EXPIRE", key, window)
    end

    if current > limit then
      return 0
    end

    return 1
  `;

  const key = `rate-limit:${clientId}`;
  const response = await redis.eval(script, 1, key, limit, windowSeconds);
  const currentCount = await redis.get(key);
  const currentValue = Number(currentCount ?? 0);
  const remaining = Math.max(limit - currentValue, 0);

  res.json({
    allowed: response === 1,
    clientId,
    limit,
    windowSeconds,
    remaining: Number(remaining),
  });
});

function userKey(username: string): string {
  return `user:${username}`;
}

app.post("/rate-limit", async (req, res) => {
  const { username } = req.body;

  const key = `rate-limit:${username}`;

  const current = await redis.get(key);

  // First Request
  if (!current) {
    await redis.set(key, 1);
    await redis.expire(key, 60);

    return res.json({
      success: true,
      totalRequests: 1,
      message: "Request Allowed",
    });
  }

  const count = Number(current);

  // Limit Cross
  if (count >= 5) {
    const retryAfter = await redis.ttl(key);

    return res.status(429).json({
      success: false,
      message: "Too Many Requests",
      retryAfter,
    });
  }

  const newCount = count + 1;

  await redis.set(key, newCount);

  return res.json({
    success: true,
    totalRequests: newCount,
    message: "Request Allowed",
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
