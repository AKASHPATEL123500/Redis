import { Worker } from "bullmq";

const w = new Worker(
  "email-queue",
  async (job) => {
    console.log("Data", job.data);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

w.on("completed", async (job) => {
  const data = {
    id: job?.id,
    name: job.name,
    finishedOn: job.finishedOn,
    returnValue: job.returnvalue,
    attemptsMade: job.attemptsMade,
    attemptStarted: job.attemptsStarted,
    stacktrace: job.stacktrace,
    stalledCounter: job.stalledCounter,
    token: job.token,
    dedpulicationId: job.deduplicationId,
    timestamp: job.timestamp,
    isActive: job.isActive(),
    isCompleted: job.isCompleted(),
  };
  console.log("Job is completed!");
  console.log("Info: ", data);
});
