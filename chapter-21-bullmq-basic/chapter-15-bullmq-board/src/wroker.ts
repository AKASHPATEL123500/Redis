import { Worker } from "bullmq";

const w = new Worker(
  "email-queue",
  async (job) => {
    await job.updateProgress(10);
    await job.updateProgress(50);
    await job.updateProgress(100);
    console.log("job is started");
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
    concurrency: 10,
  },
);
