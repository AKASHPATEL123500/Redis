import { Queue } from "bullmq";

const emailQueue = new Queue("news-email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export default emailQueue;
