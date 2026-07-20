import { emailQueue } from "./queue.ts";

async function sendEmailQueue() {
  await emailQueue.add(
    "send-wellcome-mail",
    {
      name: "Aakash",
      email: "akash@ak.in",
    },
    // this is the retry
    // retry a job maxmium 3 time excute karna
    {
      attempts: 10,
      // backoff mtlb retry karbe ka rule
      backoff: {
        type: "exponential", // type : "fixed" ka mtlb hai ki har retry meins same time lage
        delay: 1000, // this is tha time that retry ko wiat karna hai itne time
      },
    },
  );
}

sendEmailQueue();
