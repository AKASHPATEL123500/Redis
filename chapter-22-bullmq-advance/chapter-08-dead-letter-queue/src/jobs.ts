import { Worker, Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });

// 1. Hamari Asli Main Queue aur ek special Dead Letter Queue (DLQ)
const mainQueue = new Queue("MainTaskQueue", { connection });
const deadLetterQueue = new Queue("DeadLetterQueue", { connection });

// 2. Job Add Karte Waqt Retry Limits Laganaasync function addNewTask() {
await mainQueue.add(
  "sendInvoice",
  { invoiceId: 102, email: "wrong-email-format" }, // Kharab data jo fail hoga
  {
    attempts: 3, // 🔄 3 baar try karega worker
    backoff: {
      type: "fixed",
      delay: 2000, // Har fail ke baad 2 second rukega
    },
  },
);
console.log("🚀 Job main queue mein add ho gayi!");

// 3. Main Queue Ka Worker (Jo jaan boojh kar fail hoga test karne ke liye)
const mainWorker = new Worker(
  "MainTaskQueue",
  async (job) => {
    console.log(
      `👷 Worker: Attempt #${job.attemptsMade + 1} for Job ${job.id}`,
    );

    // Maan lo koi server crash ya validation error aaya
    throw new Error("Invalid Email Address Configuration!");
  },
  { connection },
);

// 4. 🔥 THE MAGIC CODE: Job ko DLQ mein bhejna// Hum QueueEvents use karenge check karne ke liye ki job 3 baar fail ho chuki haiconst queueEvents = new QueueEvents('MainTaskQueue', { connection });

queueEvents.on("failed", async ({ jobId, failedReason }) => {
  // Pehle job ka poora data nikaalenge
  const job = await mainQueue.getJob(jobId);

  // Agar job sach mein apne saare attempts kharch kar chuki hai (attemptsMade === attempts)
  if (job && job.attemptsMade >= job.opts.attempts) {
    console.log(
      `🚨 Job ${jobId} poori tarah fail ho gayi. Moving to Dead Letter Queue!`,
    );

    // Kharaab job ko DLQ mein daal do taaki developers baad mein check kar sakein
    await deadLetterQueue.add("deadJob", {
      originalJobId: jobId,
      originalData: job.data,
      reason: failedReason,
      failedAt: new Date().toISOString(),
    });

    // Purani queue se is kharab job ko delete kar do taaki Redis memory saaf rahe
    await job.remove();
  }
});
