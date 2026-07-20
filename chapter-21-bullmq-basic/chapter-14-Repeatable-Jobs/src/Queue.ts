import { Queue } from "bullmq";

const connections = {
  host: "localhost",
  port: 6379,
};

const emailQueue = new Queue("email-servic", { connections });

export { emailQueue, connections };
