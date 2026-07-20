import emailQueue from "./queue.ts";

async function sendEmailQueue() {
  for (let i = 1; i <= 20; i++) {
    await emailQueue.add("email", {
      number: i,
    });
  }
  console.log("Added successfully");
}

sendEmailQueue();
