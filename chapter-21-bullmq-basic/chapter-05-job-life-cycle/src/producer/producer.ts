import { emailQueue } from "../queue/queue.ts";

async function jobAddInQueue() {
  await emailQueue.add("send-wellcome-mail", {
    name: "Shivam Patel",
    email: "Shivam@patel.in",
  });

  console.log("Job added successfully in queue");
}

jobAddInQueue();
