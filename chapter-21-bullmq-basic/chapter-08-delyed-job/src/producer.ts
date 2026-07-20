import emailQueue from "./queue.ts";

async function addJobsInEmailQueue() {
  await emailQueue.add(
    "send-wellcome-mail",
    {
      name: "Akash",
      username: "akash@akash",
      email: "akash@ak.in",
      createdAt: new Date(),
    },
    {
      delay: 5000,
      attempts: 3,
      backoff: {
        type: "fixed",
        delay: 3000,
      },
    },
  );
}

addJobsInEmailQueue();
