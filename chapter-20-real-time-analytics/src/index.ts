import { connectDB } from "./test/db.ts";
import express from "express";
import Redis from "ioredis";
import path from "path";
import { fileURLToPath } from "url";
import type { Request, Response } from "express";
import Url from "./model.ts";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());
const redis = new Redis("redis://localhost:6379");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function urlKey(shortCode: string) {
  return `url:${shortCode}`;
}

function clickKey(shortCode: string) {
  return `click:${shortCode}`;
}

function shortUrl(shortCode: string) {
  const BASE_URL = "http://localhost:3000";
  return `${BASE_URL}/${shortCode}`;
}

app.post("/user", async (req: Request, res: Response) => {
  const { originalUrl } = req.body ?? {};

  if (!originalUrl) {
    return res.json({ message: "Please fill url" });
  }
  const shortCode = nanoid(7);
  console.log("Code: ", shortCode);

  const url = await Url.create({
    originalUrl,
    shortCode,
  });

  return res.json({
    success: true,
    message: "Short url generated successfully",
    shortUrl: shortUrl(shortCode),
    url: url,
  });
});

app.get("/analytics/overview", async (req: Request, res: Response) => {
  const totalUrls = await Url.countDocuments();
  const [clickSum] = await Url.aggregate([
    { $group: { _id: null, totalClicks: { $sum: "$clickCount" } } },
  ]);
  const cacheKeys = await redis.keys("url:*");
  const cacheHits = Number((await redis.get("cache:hits")) ?? 0);
  const cacheMisses = Number((await redis.get("cache:misses")) ?? 0);

  const topLinks = await Url.find()
    .sort({ clickCount: -1 })
    .limit(5)
    .select("shortCode originalUrl clickCount")
    .lean();

  return res.json({
    totalUrls,
    totalClicks: clickSum?.totalClicks ?? 0,
    cacheEntries: cacheKeys.length,
    cacheHits,
    cacheMisses,
    topLinks,
  });
});

app.get("/dashboard", async (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.get("/analytics/link/:shortCode", async (req: Request, res: Response) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode }).lean();
  if (!url) {
    return res.status(404).json({ message: "Url not found" });
  }

  const cacheStatus = (await redis.exists(urlKey(shortCode)))
    ? "cached"
    : "not cached";
  const ttl = await redis.ttl(urlKey(shortCode));
  const redisClicks = Number((await redis.get(clickKey(shortCode))) ?? 0);

  return res.json({
    ...url,
    shortUrl: shortUrl(shortCode),
    cacheStatus,
    cacheTTL: ttl,
    redisClicks,
  });
});

app.get("/ttl/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  const ttl = await redis.ttl(urlKey(shortCode));

  if (ttl === -2) {
    return res.json({
      message: "This Key is alredy expired",
    });
  }
  return res.json({
    message: "time to live check successfully",
    ExpireIn: ttl,
  });
});

app.get("/:shortCode", async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;

    const cacheOriginalUrl = await redis.get(urlKey(shortCode));
    if (cacheOriginalUrl) {
      await redis.incr("cache:hits");
      await redis.incr(clickKey(shortCode));

      // TODO: BullMQ ke baad is DB update ko background job me move karenge.
      // await Url.updateOne({ shortCode }, { $inc: { clickCount: 1 } });
      return res.redirect(cacheOriginalUrl);
    }

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ message: "Url not found" });
    }

    await redis.set(urlKey(shortCode), url.originalUrl);
    await redis.expire(urlKey(shortCode), 3600);
    await redis.incr("cache:misses");
    await redis.incr(clickKey(shortCode));

    // TODO: BullMQ ke baad is DB update ko background job me move karenge.
    // await Url.updateOne({ shortCode }, { $inc: { clickCount: 1 } });

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Oops! Code mein error aaya hai:", (error as Error).message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
});

app.get("/click", async (req, res) => {});

await connectDB();
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
