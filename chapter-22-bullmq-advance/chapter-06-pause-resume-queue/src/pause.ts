import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });
const messageQueue = new Queue("MessageQueue", { connection });

// 🚨 Queue ko PAUSE karne ka function
async function emergencyPause() {
  console.log("🛑 SMS Provider down hai! Queue ko pause kar rahe hain...");

  // Isse naye jobs process hona ruk jayenge
  await messageQueue.pause();

  console.log("✅ Queue successfully PAUSED.");
}

// ▶️ Queue ko RESUME karne ka function
async function systemResume() {
  console.log(
    "🔄 SMS Provider wapas up ho gaya! Queue ko resume kar rahe hain...",
  );

  // Isse workers firse kaam par lag jayenge
  await messageQueue.resume();

  console.log("✅ Queue successfully RESUMED.");
}

// Check karne ke liye ki abhi queue ka status kya hai
async function checkStatus() {
  const isPaused = await messageQueue.isPaused();
  console.log(
    `📊 Kya queue pause hai? : ${isPaused ? "Haan Bhai" : "Nahi Bhai"}`,
  );
}
