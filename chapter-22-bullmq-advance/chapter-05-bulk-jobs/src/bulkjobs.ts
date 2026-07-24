import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });
const notificationQueue = new Queue("NotificationQueue", { connection });

async function sendBulkNotifications() {
  // 1. Jobs ka ek array (list) banaya
  const jobsList = [
    {
      name: "sendEmail",
      data: { to: "rahul@example.com", msg: "Hello Rahul!" },
    },
    { name: "sendEmail", data: { to: "amit@example.com", msg: "Hello Amit!" } },
    {
      name: "sendEmail",
      data: { to: "priya@example.com", msg: "Hello Priya!" },
    },
    {
      name: "sendEmail",
      data: { to: "sneha@example.com", msg: "Hello Sneha!" },
    },
  ];

  // 2. addBulk use karke ek baar mein saari jobs Redis mein daal di
  const createdJobs = await notificationQueue.addBulk(jobsList);

  console.log(
    `🚀 Total ${createdJobs.length} jobs ek sath queue mein daal di gayi hain!`,
  );
  process.exit(0);
}

sendBulkNotifications();
