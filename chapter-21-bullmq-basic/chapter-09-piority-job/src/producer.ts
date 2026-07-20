import emailQueue from "./queue.ts";

async function addJobsInEmailQueue() {
  await emailQueue.add(
    "newsletter",
    {
      name: "Akash",
      username: "akash@akash",
      email: "akash@ak.in",
      createdAt: new Date(),
    },
    {
      priority: 10,
    },
  );
  await emailQueue.add(
    "password-reset",
    {
      name: "Akash",
      username: "akash@123",
      OTP: 1234,
      createdAt: new Date(),
    },
    {
      priority: 1,
    },
  );

  await emailQueue.add(
    "OTP",
    {
      OTP: 1234,
      createdAt: new Date(),
    },
    {
      priority: 2,
    },
  );

  await emailQueue.add(
    "wellcome-user",
    {
      name: "Akash",
      createdAt: new Date(),
    },
    {
      priority: 5,
    },
  );

  await emailQueue.add(
    "payment",
    {
      status: "success",
      createdAt: new Date(),
    },
    {
      priority: 8,
    },
  );

  await emailQueue.add(
    "marketing",
    {
      influencer: "Akash",
      piority: 20,
      createdAt: new Date(),
    },
    {
      priority: 20,
    },
  );

  await emailQueue.add(
    "profile-user",
    {
      name: "Rahul",
      piority: 3,
      createdAt: new Date(),
    },
    {
      priority: 2,
    },
  );
}

addJobsInEmailQueue();
