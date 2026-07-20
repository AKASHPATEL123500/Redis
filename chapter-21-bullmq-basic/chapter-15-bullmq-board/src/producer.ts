import { emailQueue } from "./queue.ts";

async function sendMail() {
  const job = await emailQueue.add(
    "email-send",
    {
      id: 999,
      name: "Akash",
      message: "Wellcome",
      createdAt: new Date(),
    },
    {
      delay: 10000,
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: {
        count: 100,
      },
    },
  );
  console.log(`[Producer] Job Added Successfully. JobId:${job.id}`);
  return job;
}

sendMail();
