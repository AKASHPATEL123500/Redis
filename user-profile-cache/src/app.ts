import express from "express";
import redis from "./config/redis.ts";
import authRouter from "./routes/user.route.ts";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hello, World!");
});

app.get("/redis", async (req, res) => {
  const result = await redis.ping();
  res.json({ message: "Redis is working!", result });
});

app.use("/api/v1/auth", authRouter);
export default app;
