import { QueueEvents } from "bullmq";
import { redisConnectionConfig } from "../../conf/redis.ts";

export const emailEvents = new QueueEvents("email-queue", {
  connection: redisConnectionConfig,
});

// ⏳ 1. TRIGGER HOGA: Jab job queue me aayegi lekin delay timer chal raha hoga
emailEvents.on("delayed", ({ jobId, delay }) => {
  console.log(`\n==================================================`);
  console.log(`⏳ [QUEUE STATUS] Job is DELAYED | ID: ${jobId}`);
  console.log(`⏱️  Waiting Time: ${delay / 1000} seconds before execution...`);
  console.log(`==================================================`);
});

// 🏃‍♂️ 2. TRIGGER HOGA: Jab 10 second khatam honge aur Worker job uthayega
emailEvents.on("active", ({ jobId }) => {
  console.log(
    `🚀 [QUEUE STATUS] Job is now ACTIVE | ID: ${jobId} (Worker started processing)`,
  );
});

// ✅ 3. TRIGGER HOGA: Jab email successfully send ho jayegi
emailEvents.on("completed", ({ jobId }) => {
  console.log(`✅ [QUEUE STATUS] Job COMPLETED Successfully | ID: ${jobId}\n`);
});

// ❌ 4. TRIGGER HOGA: Agar code me koi error aaya
emailEvents.on("failed", ({ jobId, failedReason }) => {
  console.error(`❌ [QUEUE STATUS] Job FAILED | ID: ${jobId}`);
  console.error(`🚨 Reason: ${failedReason}\n`);
});
