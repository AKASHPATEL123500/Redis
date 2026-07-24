import { FlowProducer } from "bullmq";

export const redisConnectionConfig = {
  host: "localhost",
  port: 6379,
};
export const flowProducer = new FlowProducer({
  connection: redisConnectionConfig,
});
