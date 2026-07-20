import express from "express";
import authRouter from "./modules/auth/routes/routes.ts";
import connectDB from "./modules/conf/db.ts";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { emailQueue } from "./modules/Email/queue/emailQueue.ts";
import { emailWorker } from "./modules/Email/worker/emailWorker.ts";
import "dotenv/config";
import "./modules/Email/index.ts";

const app = express();
app.use(express.json());

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n[${signal}] Received. Closing email worker gracefully...`);

  // Worker naye jobs lena band kar dega, aur jo chal rahe hain unhe poora hone dega
  await emailWorker.close();

  console.log("Worker closed safely. Exiting process.");
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

app.use("/api/auth/v1", authRouter);
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3000, () => {
  connectDB();
  console.log("http://localhost:3000");
});
