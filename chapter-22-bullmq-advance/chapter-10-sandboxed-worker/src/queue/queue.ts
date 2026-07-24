import { Queue } from "bullmq";

export const redisConnectionConfig = {
  host: "localhost",
  port: 6379,
};

export const emailQueue = new Queue("email-queue", {
  connection: redisConnectionConfig,
});

async function addJob() {
  await emailQueue.add("send-wellcome-mail", {
    userId: 1,
    name: "Jone",
    userName: "Done",
    email: "jone@done.in",
    password: "12334",
  });

  console.log("Job Addedd Successfully");
}

addJob();
