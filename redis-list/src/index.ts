import express from "express";
import type { Request, Response } from "express";
import Redis from "ioredis";
import { connectDB } from "./config/db.ts";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 14000;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function userKey(userId: string) {
  return `activity:${userId}`;
}

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "server is ready",
  });
});

app.get("/redis", async (req: Request, res: Response) => {
  const replay = await redis.ping();
  return res.status(200).json({
    success: true,
    source: "redis",
    redis: replay,
  });
});

app.post("/activity", async (req: Request, res: Response) => {
  const { userId, activity } = req.body;

  if (!userId || !activity) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const result = await redis.lpush(userKey(userId), activity);

  // mujhe sirf 20 latest activities chahiye, isliye mai 20 se zyada activities ko trim kar dunga
  await redis.ltrim(userKey(userId), 0, 19);

  return res.status(201).json({
    status: "success",
    success: true,
    source: "redis",
    data: result,
  });
});

app.get("/activity/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  const activities = await redis.lrange(userKey(userId), 0, -1);
  return res.status(200).json({
    success: true,
    source: "redis",
    data: activities,
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
