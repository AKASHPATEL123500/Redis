import { Queue } from "bullmq";

const queue = new Queue("email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

// const jobs = await queue.getJobs();
// console.log(jobs);

const waitingJobs = await queue.getWaiting();
console.log("waitingJobs : ", waitingJobs);

for (const job of waitingJobs) {
  console.log(job.id);
  console.log(job.name);
  console.log(job.data);
}

export { queue };
