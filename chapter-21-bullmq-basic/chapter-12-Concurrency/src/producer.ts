import emailQueue from "./queue.ts";

async function sendEmailQueue() {
  await emailQueue.add("send-mail", {
    id: 1,
    name: "Akash",
  });

  await emailQueue.add("send-mail", {
    id: 2,
    name: "Aman",
  });

  await emailQueue.add("send-mail", {
    id: 3,
    name: "Rahul",
  });

  await emailQueue.add("send-mail", {
    id: 4,
    name: "Shiva",
  });

  await emailQueue.add("send-mail", {
    id: 5,
    name: "Ravi",
  });

  await emailQueue.add("send-mail", {
    id: 1,
    name: "Akash",
  });

  await emailQueue.add("send-mail", {
    id: 2,
    name: "Aman",
  });

  await emailQueue.add("send-mail", {
    id: 3,
    name: "Rahul",
  });

  await emailQueue.add("send-mail", {
    id: 4,
    name: "Shiva",
  });

  await emailQueue.add("send-mail", {
    id: 5,
    name: "Ravi",
  });

  await emailQueue.add("send-mail", {
    id: 1,
    name: "Akash",
  });

  await emailQueue.add("send-mail", {
    id: 1,
    name: "Akash",
  });

  await emailQueue.add("send-mail", {
    id: 1,
    name: "Akash",
  });

  console.log("Added successfully");
}

sendEmailQueue();
