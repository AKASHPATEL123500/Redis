import express from "express";
import Redis from "ioredis";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
