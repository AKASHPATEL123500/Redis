import { FlowProducer } from "bullmq";
import { redisConnectionConfig } from "../flow-producers-queue.ts";

export const emailQueue = new FlowProducer({
  connection: redisConnectionConfig,
});
