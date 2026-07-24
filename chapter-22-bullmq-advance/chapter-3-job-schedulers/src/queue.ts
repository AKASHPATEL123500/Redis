import { JobScheduler, Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });

// 1. Pehle ek normal queue banayi
const maintenanceQueue = new Queue("MaintenanceQueue", { connection });

// 2. Ab hum banayenge ek JobScheduler (Ye hamara schedule manager hai)
const scheduler = new JobScheduler("MaintenanceQueue", {
  connection,
  // Aap chaho to scheduler level par hi default options set kar sakte ho
});

async function startScheduler() {
  // Scheduler ke andar schedule define kiya jata hai
  await scheduler.upsert(
    "weekly-alert", // Scheduler ID (Isse hum isko pehchante hain)
    {
      pattern: "0 23 * * 6", // Har Saturday (6) raat ko 11 baje (23:00)
      tz: "Asia/Kolkata", // India Timezone
    },
    {
      name: "sendAlertEmail", // Job ka naam jo queue mein jayega
      data: { message: "App will be down for 2 hours" }, // Job data
    },
  );

  console.log("📅 Job Scheduler active ho gaya hai!");
}

// 3. Worker (Jo sahi time par chalega)
const maintenanceWorker = new Worker(
  "MaintenanceQueue",
  async (job) => {
    console.log(`📢 Alert Triggered: ${job.data.message}`);
  },
  { connection },
);

startScheduler();
