import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });

// Worker ko ghanta farak nahi padta ki job bulk se aayi ya single, wo apna kaam karega
const notificationWorker = new Worker(
  "NotificationQueue",
  async (job) => {
    console.log(`📨 Processing: Sending message to ${job.data.to}`);
  },
  { connection },
);
