import type { Request, Response, NextFunction } from "express";
import Redis from "ioredis";

const redis = new Redis("redis://localhost:6379");

export async function ratelimter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const key = `rate-limit:${req.ip}`;

  const count = await redis.incr(key);

  if (count === 1) await redis.expire(key, 60);

  if (count > 5) {
    const ttl = await redis.ttl(key);
    return res.status(429).json({
      status: "false",
      statusType: "rate-limit",
      statusCode: "429",
      success: false,
      message: `Too many requuest with this ip. try again ${ttl} seconds`,
    });
  }

  next();
}
