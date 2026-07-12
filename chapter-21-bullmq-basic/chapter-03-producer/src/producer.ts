import { queue } from "./queue.ts";

async function jobAddInQueue() {
  await queue.add("send-wellcome-mail", {
    name: "Akash Patel",
    email: "Akash@patel.in",
  });

  await queue.add("send-wellcome-mail", {
    name: "Rahul Patel",
    email: "Rahul@patel.in",
  });

  await queue.add("send-wellcome-mail", {
    name: "Aman Patel",
    email: "Aman@patel.in",
  });

  console.log("Job added successfully in queue");
}

jobAddInQueue();
