import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

async function unsubscribeChannel() {
  // unsubscribe channel
  await redis.unsubscribe("notification-event");
  console.log("Ab notification-event sunna band!");

  // unsubscribe pattern channel
  await redis.unsubscribe("*-event");
  console.log("Central system ne saare pattern events sunna band kar diya.");
}

unsubscribeChannel();
