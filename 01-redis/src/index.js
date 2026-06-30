import express from "express";
import redis from "./config/redis.js";
const app = express();
const PORT = process.env.PORT || 12000;

app.get("/redis", async (req, res) => {
  const replay = await redis.ping();

  res.json({
    redis: replay,
  });
});
app.listen(PORT, () => {
  console.log("Server is running on 12000");
});
