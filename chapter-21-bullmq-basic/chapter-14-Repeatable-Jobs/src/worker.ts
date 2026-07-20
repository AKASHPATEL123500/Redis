import { Worker } from "bullmq";
const worker = new Worker(
  "email-servic",

  async (job) => {
    console.log("Job ID : ", job.id);

    console.log("Job name: ", job.name);
    console.log("Job Data : ", job.data);

    console.log("Running...");
  },

  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);
