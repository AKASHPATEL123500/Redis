import Redis from "ioredis";

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const channleName = "user-event";

export async function publishLoginEvent(payload: string) {
  await publisher.publish(channleName, payload);
}

export async function paymentEvent(payload: string) {
  await publisher.publish("payment-event", payload);
}

export async function notificationEvent(payload: string) {
  await publisher.publish("notification-event", payload);
}
