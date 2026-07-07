import express from "express";
import Redis from "ioredis";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function userKey(userId: string) {
  return `user:${userId}`;
}

app.post("/upgrade-premium", async (req: Request, res: Response) => {
  const { userId, name, username, planType, price } = req.body;

  // 1. Transaction Shuru (MULTI) -> Commands line mein lagna shuru
  const tx = redis.multi();

  // 2. Pehli Command queue karo: Profile ko premium status do
  tx.hset(userKey(userId), {
    id: userId,
    name: name,
    username: username,
    planType: planType || "monthly gold pro",
    price: price || "$10",
    isPremium: "true",
  });

  // 3. Dusri Command queue karo: 30 din ki expiry lagao (30 * 24 * 60 * 60 seconds)
  const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
  tx.expire(userKey(userId), thirtyDaysInSeconds);

  // 4. Fire (EXEC): Ab Redis dono commands ko ek jhatke mein chala dega
  const result = await tx.exec();

  return res.status(200).json({
    success: true,
    message: `User ${userId} successfully upgraded to Premium!`,
    redisResponse: result, // Ye dikhayega ki dono commands chal gayi
  });
});

app.get("/ttl", async (req: Request, res: Response) => {
  const { userId } = req.body;
  const result = await redis.ttl(userKey(userId));

  return res.status(200).json({
    success: true,
    message: `ttl chech successfully`,
    redisResponse: result, // Ye dikhayega ki dono commands chal gayi
  });
});

app.get("/get-user", async (req: Request, res: Response) => {
  const { userId } = req.body;

  const exists = await redis.exists(userKey(userId));
  if (!exists) {
    return res.status(404).json({
      success: false,
      message: "User nahi mila ya fir uska pack Expire ho gaya hai! (-2)",
    });
  }
  const result = await redis.hgetall(userKey(userId));

  console.dir(result, { depth: null, colors: true });
  return res.status(200).json({
    success: true,
    message: `user get successfully`,
    redisResponse: result, // Ye dikhayega ki dono commands chal gayi
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
