import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Yeh connection baaki app (cache, rate limiting) ke liye use hoga
const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // BullMQ demands this
});

// Yeh plain object configs BullMQ ke Queue/Worker ko chahiye hota hai
const redisConnectionConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

export { redis as default, redisConnectionConfig };
