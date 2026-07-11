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

// function test(callback) {
//   console.log("start");

//   callback();

//   console.log("end");
// }

// test(() => {
//   console.log("Data se data aa raha hai.");
// });

app.post("/user", async (req: Request, res: Response) => {
  const { name, email, age, role } = req.body;
  const payload = {
    name,
    email,
    age,
    role,
  };

  const user = await User.create(payload);

  const stringObj = JSON.stringify(user);

  const cache = await redis.set(userKey(user._id.toString()), stringObj);
  const expireIn = await redis.expire(userKey(user._id.toString()), 120);

  return res.status(201).json({
    status: "success",
    success: true,
    message: "User created successfully",
    Data: user,
    cacheSaved: cache,
    expireIn: expireIn,
  });
});

app.get("/user/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  const data = await cacheService(userId, async () => {
    return await User.findById(userId);
  });

  if (!data) {
    return res.json({ message: "User Not found!" });
  }

  const ttl = await redis.ttl(userKey(userId));
  if (data) {
    return res.json({
      status: "success",
      stausCode: 200,
      message: "User get successfully",
      data: data,
      ttl: ttl,
    });
  }
});

app.get("/ttl/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  const resutl = await redis.ttl(userKey(userId));

  return res.json({
    status: "success",
    message: "ttl check",
    data: resutl,
  });
});
app.listen(3000, () => {
  connectDB();
  console.log(`Server is running on http://localhost:3000`);
});
