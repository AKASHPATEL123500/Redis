import express from "express";
import type { Request, Response } from "express";
import Redis from "ioredis";
import { connectDB } from "./config/db.ts";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 14000;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

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

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is runing on http://localhost:${PORT}`);
});
