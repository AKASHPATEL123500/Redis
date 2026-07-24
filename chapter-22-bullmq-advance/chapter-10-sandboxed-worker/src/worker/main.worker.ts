import { Worker } from "bullmq";
import { redisConnectionConfig } from "../queue/queue.ts";

new Worker(
  "email-queue",
  new URL("../proccess/email.proccess.ts", import.meta.url).pathname,
  {
    connection: redisConnectionConfig,
  },
);
