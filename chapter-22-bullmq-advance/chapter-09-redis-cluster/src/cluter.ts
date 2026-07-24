import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";
// 1. Apne saare Redis Cluster nodes ki list taiyar karoconst
const clusterNodes = [
  { host: "127.0.0.1", port: 7000 },
  { host: "127.0.0.1", port: 7001 },
  { host: "127.0.0.1", port: 7002 },
  { host: "127.0.0.1", port: 7003 },
  { host: "127.0.0.1", port: 7004 },
  { host: "127.0.0.1", port: 7005 },
];
// 2. Cluster connection instance banaoconst
const clusterConnection = new Redis.Cluster(clusterNodes, {
  redisOptions: {
    maxRetriesPerRequest: null, // 🔥 BullMQ ke liye ye line compulsory hai!
  },
});
// 3. Queue banao (🔑 DHYAN SE: Curly braces lagana mat bhoolna!)
const clusterQueue = new Queue("{orderProcessing}-queue", {
  connection: clusterConnection,
});
async function addJobToCluster() {
  await clusterQueue.add("processOrder", { orderId: 8878, item: "iPhone 15" });
  console.log("🚀 Job safely cluster ke sahi node par insert ho gayi!");
}
// 4. Worker setup (Ye bhi cluster connection use karega)
const clusterWorker = new Worker(
  "{orderProcessing}-queue",
  async (job: Job) => {
    console.log(`📦 Cluster Worker processing order: ${job.data.orderId}`);
  },
  { connection: clusterConnection },
);

addJobToCluster();
