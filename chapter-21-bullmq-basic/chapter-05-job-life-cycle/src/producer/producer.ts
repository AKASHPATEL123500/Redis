import { emailQueue } from "../queue/queue.ts";
import { v4 as uuidv4 } from "uuid";

// Practical producer showing idempotency keys, attempts, backoff and removal rules
async function jobAddInQueue() {
  const users = [
    { name: "Shivam Patel", email: "Shivam@patel.in" },
    { name: "Akash Reddy", email: "akash@patel.in" },
    { name: "Rahul Reddy", email: "rahul@patel.in" },
  ];

  for (const u of users) {
    const idempotencyKey = `send-email:${u.email}:${Date.now()}`;
    await emailQueue.add(
      "send-wellcome-mail",
      {
        name: u.name,
        email: u.email,
        correlationId: uuidv4(),
        idempotencyKey,
        payloadRef: null,
      },
      {
        attempts: 4,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
        timeout: 30_000,
      },
    );
    console.log(`Enqueued job for ${u.email} (idempotency=${idempotencyKey})`);
  }

  console.log("All jobs added successfully in queue");
}

jobAddInQueue();
