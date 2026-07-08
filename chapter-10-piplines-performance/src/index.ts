import express from "express";
import Redis from "ioredis";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/user/normal-import", async (req: Request, res: Response) => {
  const users = req.body;

  console.time("Normal import");
  const startTime = performance.now();

  for (const user of users) {
    await redis.hset(`user:${user.id}`, {
      id: user.id.toString(),
      name: user.name,
      age: user.age.toString(),
    });
  }

  const endTime = performance.now();
  console.timeEnd("Normal import");
  return res.status(200).json({
    success: true,
    message: `User imported using normal redis command`,
    performance: `${(endTime - startTime).toFixed(2)}ms`,
  });
});

app.post("/user/pipline", async (req: Request, res: Response) => {
  const users = req.body;

  console.time("Pipline Time");
  const startTime = performance.now();

  const pipline = redis.pipeline();

  for (const user of users) {
    await pipline.hset(`user:${user.id}`, {
      id: user.id.toString(),
      name: user.name,
      age: user.age.toString,
    });
  }

  const resutl = await pipline.exec();

  const endTime = performance.now();
  console.timeEnd("Pipline Time");

  return res.status(200).json({
    success: true,
    message: `User imported using normal redis command`,
    performance: `${(endTime - startTime).toFixed(2)}ms`,
    totalCommands: resutl?.length,
  });
});

const pipeline = redis.pipeline();

pipeline.set("name", "Akash");

pipeline.set("city", "Lucknow");

pipeline.get("name");

pipeline.del("city");

pipeline.incr("name");
const result = await pipeline.exec();
console.log(result);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
