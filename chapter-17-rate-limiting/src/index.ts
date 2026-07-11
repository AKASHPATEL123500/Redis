import express from "express";
import Redis from "ioredis";
import { ratelimter } from "./midlewere.ts";
import type { Request, Response } from "express";
const app = express();

const redis = new Redis("redis://localhost:6379");

// window fixed ratelimiting
app.post("/user", ratelimter, async (req, res) => {
  console.log("User IP: ", req.ip);
  console.log("User IPs: ", req.ips);
  console.log("User host: ", req.host);
  console.log("User hostname: ", req.hostname);
  console.log("User orginalurl: ", req.originalUrl);
  console.log("User protocol: ", req.protocol);
  console.log("User httpversion: ", req.httpVersion);
  console.log("User httpversionmajor: ", req.httpVersionMajor);
  return res.json({ message: "success" });
});

//window sliding
app.post("/window-slide", async (req: Request, res: Response) => {
  const key = `rate:limit:${req.ip}`;
  const now = Date.now();
  const window = 60 * 1000;
  const limit = 5;

  const rem = await redis.zremrangebyscore(key, 0, now - window);

  console.log("Remove : ", rem);

  const add = await redis.zadd(key, now.toString(), now.toString());

  console.log("Add : ", add);

  const count = await redis.zcard(key);

  console.log("Count : ", count);

  await redis.expire(key, 60);

  if (count > limit) {
    return res.status(429).json({
      status: "block",
      success: false,
      message: "Too many request",
    });
  }

  res.json({ message: "success" });
});

app.get("/live", async (req: Request, res: Response) => {
  const key = `rate:limit:${req.ip}`;

  const resilt = await redis.zrange(key, 0, -1, "WITHSCORES");
  const count = await redis.zcard(key);
  const ttl = await redis.ttl(key);
  console.log("result : ", resilt);
  res.json({
    result: resilt,
    count: count,
    ttl: ttl,
  });
});
app.listen(3000, () => {
  console.log(`Server is ruuing on http://localhost:3000`);
});
