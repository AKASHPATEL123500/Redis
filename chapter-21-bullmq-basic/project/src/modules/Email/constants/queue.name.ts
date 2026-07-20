export const QUEUE_NAME = {
  EMAIL: "email-queue",
  PAYMENT: "payment-queue",
  DAILY_UPDATE: "daily-update",
} as const;

export type queueNameType = (typeof QUEUE_NAME)[keyof typeof QUEUE_NAME];
