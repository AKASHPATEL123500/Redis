import { Worker } from "bullmq";

// Worker queue ko listen kar raha hai
const reportWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`⏰ Time ho gaya! Job ID: ${job.id} chal rahi hai.`);
    console.log(`📊 User ${job.data.userId} ki report ban rahi hai...`);

    // Yahan aap apna asli kaam karoge (jaise DB query ya Email bhejna)
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

reportWorker.on("completed", () => console.log("✅ Kaam khatam!"));
