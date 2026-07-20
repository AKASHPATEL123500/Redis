import emailQueue from "./queue.ts";

const data = {
  id: 1122,
  name: "Vikash",
  username: "vk@vk",
  email: "vk@vk.in",
  createdAt: new Date(),
};

async function sendEmailQueue() {
  // await emailQueue.add("wellcome-mail", data, {

  //   // job complete and delete
  //   // removeOnComplete: true,

  //   // mtlb: last ke 100 completed job rakhe bass baki delete kar do sab ko
  //   removeOnComplete: 100,
  //   // job agr fail ho jaye to remove nahi karna hai isliye false
  //   // removeOnFail: false,
  //   // removeOnFail: true mtlb: agr job fail hota hai to delete kar do

  //   removeOnFail: 100,
  //   //mtlb: last ke 100 fail job rakho baki sab ko delete kar do
  //   delay: 10000,
  // });

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

  console.log("Job Addedd Successfully in Queue");
}

sendEmailQueue();
