// step 1
import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { emailQueue } from "./queue.ts";

const app = express();

// Step 2
// Express Adapter
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

// Step 3
// Create Bull Board
createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

// Step 4
// Express
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
