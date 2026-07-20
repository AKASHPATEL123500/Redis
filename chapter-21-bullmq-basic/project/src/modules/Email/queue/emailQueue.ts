import { Queue } from "bullmq";
import { redisConnectionConfig } from "../../conf/redis.ts";
import { QUEUE_NAME } from "../constants/queue.name.ts";

export const emailQueue = new Queue(QUEUE_NAME.EMAIL, {
  connection: redisConnectionConfig,
  defaultJobOptions: {
    attempts: 3, // Default : 3 baar hi try kiya jayega ek job ko faild per
    delay: 100000,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    // 🔥 REAL PRODUCTION SETTING
    removeOnComplete: {
      count: 500, // Sirf last 500 successful jobs ka record rakhega
      age: 24 * 3600, // 24 ghante baad apne aap delete
    },
    removeOnFail: {
      count: 1000, // Max 1000 failed jobs dashboard me dikhengi debug ke liye
      age: 7 * 24 * 3600, // 7 din baad purani failed jobs delete (Redis RAM safe rahega)
    },
  },
});
