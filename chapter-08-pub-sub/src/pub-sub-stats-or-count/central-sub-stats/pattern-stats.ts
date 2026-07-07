import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

async function checkActivePatternStasts() {
  console.log("📊 --- REDIS PUB/SUB STATUS MONITOR --- \n");

  const numPattern = await redis.pubsub("NUMPAT");

  console.log(
    `🧩 Total Active Pattern Subscribers (PSUBSCRIBE): ${numPattern}`,
  );
}

checkActivePatternStasts();
