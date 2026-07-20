import { Worker } from "bullmq";

const w = new Worker(
  "email-queue",
  async (job) => {
    console.log("Start", job.id);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Done", job.id);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
    concurrency: 5,
  },
);
