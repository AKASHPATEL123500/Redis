import { Worker } from "bullmq";

const worker = new Worker(
  "email-queue",
  async (job) => {
    // console.log(new Date().toLocaleTimeString());
    console.log("Jobs Name : ", job.name);
    console.log("Data : ", job.data);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

worker.on("completed", (job) => {
  console.log("Job completed");
});
