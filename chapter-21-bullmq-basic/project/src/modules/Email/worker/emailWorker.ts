import { Worker, Job } from "bullmq";
import { redisConnectionConfig } from "../../conf/redis.ts";
import { QUEUE_NAME } from "../constants/queue.name.ts";
import { emailRegistry } from "../registry.ts";

export const emailWorker = new Worker(
  QUEUE_NAME.EMAIL,
  async (job: Job) => {
    console.log(`[Email Worker] Job intercepted: ${job.name}`);

    const handler = emailRegistry[job.name as keyof typeof emailRegistry];
    if (!handler) {
      throw new Error(`Unknown Job : ${job.name}`);
    }
    await handler(job);
  },
  {
    connection: redisConnectionConfig,
    concurrency: 2,
  },
);
