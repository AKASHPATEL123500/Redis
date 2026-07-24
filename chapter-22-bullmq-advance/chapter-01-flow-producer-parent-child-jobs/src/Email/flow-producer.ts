import { emailQueue } from "./queue.ts";

async function sendEmailQueue() {
  await emailQueue.add({
    name: "user-signup",
    queueName: "signup-queue", // this is [ Parent ] queue
    data: {
      userId: 1,
      name: "Akash reddy",
      email: "allahabadkin@gmail.com",
      createdAt: new Date(),
    },
    opts: {
      failParentOnFailure: true,
      removeOnComplete: true,
      removeOnFail: true,
    },
    children: [
      {
        name: "send-wellcome-mail",
        queueName: "email-queue", // child queue 1
        data: {
          userId: 1,
          name: "Akash reddy",
          email: "allahabadkin@gmail.com",
          createdAt: new Date(),
        },
      },
      {
        name: "create-analytics",
        queueName: "analytics-queue", // child 2

        data: {
          userId: 1,
        },
        children: [
          // this is nested child
          // nested workflows
          {
            name: "save-in-db", // [ Child 2 ] ke child 1
            queueName: "db-queue",
            data: { userId: 1 },
          },
          {
            name: "save-in-redis",
            queueName: "redis-queue", // [ Child 2 ] ke child2
            data: { userId: 1 },
          },
          {
            name: "save-in-click-house",
            queueName: "click-house-queue", // [ Child 2 ] ke child 3
            data: { userId: 1 },
          },
        ],
      },
      //   {
      //     name: "folder-create",
      //     queueName: "folder-queue",
      //   },
      //   {
      //     name: "cupon-card",
      //     queueName: "cupon-queue",
      //   },
    ],
  });
}

sendEmailQueue();
