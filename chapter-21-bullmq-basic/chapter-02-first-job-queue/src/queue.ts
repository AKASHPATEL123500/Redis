import { Queue } from "bullmq";

const queue = new Queue("email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export { queue };
