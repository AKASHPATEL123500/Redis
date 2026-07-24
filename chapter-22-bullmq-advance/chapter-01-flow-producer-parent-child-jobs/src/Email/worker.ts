import { Worker } from "bullmq";
import { redisConnectionConfig } from "../flow-producers-queue.ts";

// Delay function (3000ms = 3 seconds)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// child 1
new Worker(
  "email-queue",
  async (job) => {
    // bussines logic hota hai
    console.log(" Worker Started and complted work");

    return {
      status: true,
      sentMail: true,
      reciver: true,
      sentAt: new Date(),
      metaData: {
        id: job.id,
        name: job.name,
        queueName: job.queueName,
        attempts: job.attemptsMade,
        timestamps: job.timestamp,
        data: job.data,
      },
    };
  },
  {
    connection: redisConnectionConfig,
  },
);
// child 2
new Worker(
  "analytics-queue",
  async (job) => {
    console.log("Analytics Worker Started");
    const result = {
      analyticsProcessed: true,
      metadata: { jobId: job.id, queueName: job.queueName },
    };
    console.log("Analytics Worker Done!");
    return result;
  },
  {
    connection: redisConnectionConfig,
  },
);

// nested child workers for analytics branch
new Worker(
  "db-queue",
  async (job) => {
    console.log("DB Worker Started", job.data);
    return { savedTo: "db", userId: job.data.userId };
  },
  { connection: redisConnectionConfig },
);

new Worker(
  "redis-queue",
  async (job) => {
    console.log("Redis Worker Started", job.data);
    return { savedTo: "redis", userId: job.data.userId };
  },
  { connection: redisConnectionConfig },
);

new Worker(
  "click-house-queue",
  async (job) => {
    console.log("ClickHouse Worker Started", job.data);
    return { savedTo: "click-house", userId: job.data.userId };
  },
  { connection: redisConnectionConfig },
);

// Parent
new Worker(
  "signup-queue",
  async (job) => {
    console.log("Parent Worker Started");
    const data = await job.getChildrenValues();
    console.log("Parent Data : ", data);

    console.log("Workflow Complete");
  },
  {
    connection: redisConnectionConfig,
  },
);
