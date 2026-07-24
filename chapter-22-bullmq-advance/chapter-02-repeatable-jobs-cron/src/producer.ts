import { emailQueue } from "./queue";

async function sendEMail() {
  await emailQueue.add(
    "send-wellcome-mail",
    {
      userId: 1,
      name: "akash",
      plan: "premium",
    },
    {
      repeat: {
        pattern: "* * * * *", // 3. CRON Pattern (Iska matlab hai: Har Minute chalo!)
      },
    },
  );
}

sendEMail();
