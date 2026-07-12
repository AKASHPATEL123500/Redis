import { Worker } from "bullmq";

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log("Jobs recive successfully");
    console.log(job.data);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

console.log("🚀 Worker Started...");
