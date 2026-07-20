import { emailQueue } from "./queue.ts";

async function sendEmailQueue() {
  await emailQueue.add(
    "send-wellcome-mail",
    {
      name: "Aakash",
      email: "akash@ak.in",
    },
    // this is the retry
    // retry a job maxmium 3 time
    {
      attempts: 3,
    },
  );
}

sendEmailQueue();
