import { Worker } from "bullmq";

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log(new Date().toLocaleTimeString());
    console.log(`Processing Job ${job.id}`);
    throw new Error("SMTP server Down");
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

// --- Worker Event -----

// Error
worker.on("failed", (job, err) => {
  console.log("--------------------");
  console.log("❌ Failed");
  console.log("Job:", job?.id);
  console.log("attepts: ", job?.attemptsStarted);

  console.log("Message:", err.message);
});
worker.on("completed", (job) => {
  console.log("✅ Completed:", job.id);
});
