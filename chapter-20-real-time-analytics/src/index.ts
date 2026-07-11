import { connectDB } from "./test/db.ts";
import express from "express";
import Redis from "ioredis";
import type { Request, Response } from "express";
import Url from "./model.ts";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());
const redis = new Redis("redis://localhost:6379");

app.post("/user", async (req: Request, res: Response) => {
  const { originalUrl } = req.body ?? {};

  if (!originalUrl) {
    return res.json({ message: "Please fill url" });
  }
  const shortCode = nanoid(7);
  console.log("Code: ", shortCode);

  const BASE_URL = "http://localhost:3000/user";
  const shortUrl = `${BASE_URL}/${shortCode}`;

  const url = await Url.create({
    originalUrl,
    shortCode,
  });

  return res.json({
    success: true,
    message: "Short url gen successfully",
    shortUrl: shortUrl,
    url: url,
  });
});

app.get("/user/:shortCode", async (req: Request, res: Response) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode });

  if (!url) {
    return res.json({ message: "Url not found" });
  }

  res.redirect(url.originalUrl);
});
app.listen(3000, () => {
  connectDB();
  console.log(`Server is ruuing on http://localhost:3000`);
});
