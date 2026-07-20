import { Worker } from "bullmq";

const w = new Worker(
  "news-email-queue",
  async (job) => {
    console.log(`start Worker PID: ${process.pid} | Job: ${job.id}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log(`Done Worker PID: ${process.pid} | Job: ${job.id}`);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
    concurrency: 5,
  },
);
