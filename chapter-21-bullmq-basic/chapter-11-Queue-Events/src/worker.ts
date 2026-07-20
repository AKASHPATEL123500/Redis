import { Worker } from "bullmq";

const w = new Worker(
  "email-queue",
  async (job) => {
    // console.log("Job is started !", job.id);

    // stalled
    console.log("Worker is spleeping");

    await new Promise((resolve) => setTimeout(resolve, 30000));

    console.log(job.data);

    // Error faild event
    // throw new Error("SMTP Server is Down!");

    // progress event ka hai
    // job.updateProgress(5);
    // job.updateProgress(10);
    // job.updateProgress(15);
    // job.updateProgress(20);
    // job.updateProgress(25);
    // job.updateProgress(30);
    // job.updateProgress(50);
    // job.updateProgress(60);
    // job.updateProgress(70);
    // job.updateProgress(80);
    // job.updateProgress(90);
    // job.updateProgress(100);
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
