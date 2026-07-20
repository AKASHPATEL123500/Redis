import emailQueue from "./queue.ts";

const data = {
  id: 1122,
  name: "Vikash",
  username: "vk@vk",
  email: "vk@vk.in",
  createdAt: new Date(),
};

async function sendEmailQueue() {
  await emailQueue.add("wellcome-mail", data, {
    // job complete and delete
    // removeOnComplete: true,

    // mtlb: last ke 100 completed job rakhe bass baki delete kar do sab ko
    removeOnComplete: 100,
    // job agr fail ho jaye to remove nahi karna hai isliye false
    // removeOnFail: false,
    // removeOnFail: true mtlb: agr job fail hota hai to delete kar do

    removeOnFail: 100,
    //mtlb: last ke 100 fail job rakho baki sab ko delete kar do
  });
  console.log("Job Addedd Successfully in Queue");
}

sendEmailQueue();
