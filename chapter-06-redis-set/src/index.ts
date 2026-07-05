import express from "express";
import type { Request, Response } from "express";
import Redis from "ioredis";

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

app.post("/posts/:postId/like", async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  const key = userKey(userId);
  await redis.sadd(key, postId);
  return res.status(200).json({
    success: true,
    message: "Post liked successfully",
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
