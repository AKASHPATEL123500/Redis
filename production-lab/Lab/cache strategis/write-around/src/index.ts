import express from "express";
import Redis from "ioredis";
import type { Request, Response } from "express";
import { connectDB } from "./db.ts";
import User from "./model.ts";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// write-Through Caching
/*
Cache = user create time hi db aur redis donomein user ko save kar lena hai aur next time hum redise se res kar denge

Example :
*/

// function that return userKey
function userKey(userId: string) {
  return `user:${userId}`;
}

async function cacheService(userId: string, callback: () => Promise<any>) {
  const cache = await redis.get(userKey(userId));

  const parseCache = JSON.parse(cache);

  if (cache) {
    return parseCache;
  }

  const data = await callback();

  if (!data) {
    return null;
  }

  const convertIntoString = JSON.stringify(data);

  await redis.set(userKey(userId), convertIntoString, "EX", 120);

  return data;
}

app.listen(3000, () => {
  connectDB();
  console.log(`Server is running on http://localhost:3000`);
});
