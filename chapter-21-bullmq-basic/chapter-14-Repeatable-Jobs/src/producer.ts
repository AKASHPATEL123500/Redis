import { emailQueue } from "./Queue.ts";
async function sendEmailQueue() {
  // yaha repet hai

  // await emailQueue.add(
  //   "daily-mail",
  //   {
  //     message: "Good Moring",
  //   },
  //   {
  //     repeat: {
  //       every: 5000, every 5 second
  //       pattern: "*/1 * * * *",  har 1 minute mein send
  //       pattern: "0 8 * * *", // Daily 8:00 AM
  //       tz: "Asia/Kolkata", // india time zone
  //     },
  //   },
  // );

  // And yaha Job Scheduler hai
  // Syntax
  // await emailQueue.upsertJobScheduler(jobSchedulerId, repeatOpts)
  await emailQueue.upsertJobScheduler(
    "daily-email",
    {
      every: 5000, // every 5 second
    },
    {
      name: "email",
      data: {
        id: 1,
        message: "Good Morning",
      },
    },
  );
}

sendEmailQueue();
