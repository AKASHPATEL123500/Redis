import Redis from "ioredis";
import "dotenv/config";

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("TCP connected");
});

redis.on("ready", (redy) => {
  console.log("Redis is ready", redy);
});

redis.on("error", (err) => {
  console.log("Redis Error: ", err.message);
});

redis.on("end", () => {
  console.log("Redis is end");
});
export default redis;
