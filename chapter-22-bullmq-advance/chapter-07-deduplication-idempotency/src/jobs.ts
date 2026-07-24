import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });
const paymentQueue = new Queue("PaymentQueue", { connection });

async function processUserPayment(
  userId: string | number,
  orderId: string | number,
  amount: string | number,
) {
  // 🔑 Humne khud ek unique jobId banayi: orderId ke base par
  const uniqueJobId = `pay-${orderId}`;

  const job = await paymentQueue.add(
    "chargeCard",
    { userId, orderId, amount },
    {
      jobId: uniqueJobId, // ✨ YE HAI MAGIC LINE!
    },
  );

  console.log(`🚀 Job process ho rahi hai. ID: ${job.id}`);
}

// --- TESTING THE DEDUPLICATION ---
async function runTest() {
  // Pehli baar call kiya - Ye chalega ✅
  await processUserPayment(555, 9999, 1500);

  // User ne turant galti se dubara click kar diya! ❌
  // BullMQ isko reject kar dega aur naya job add NAI karega, purana hi return karega!
  await processUserPayment(555, 9999, 1500);
}

runTest();
