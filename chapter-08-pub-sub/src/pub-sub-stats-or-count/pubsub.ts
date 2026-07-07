import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

async function checkActiveChannelsList() {
  console.log("📊 --- REDIS PUB/SUB STATUS MONITOR --- \n");

  // chnnels ko dekhta hai

  // kitne channel live haui unki list deta hai ye
  //  server per is waqt kon kon se chnnel active ai
  const activeChannels = await redis.pubsub("CHANNELS");
  console.log("📢 Is waqt active channels ki list:");
  console.log(
    activeChannels.length > 0
      ? activeChannels
      : "❌ Koi bhi exact active channel nahi mila (Kyunki central-subscriber psubscribe use kar raha hai).\n",
  );

  console.log(
    "📊 --- REDIS PUB/SUB STATUS MONITOR ACTIVE SUBSCRIBER  COUNT --- \n",
  );

  // Subscriber ko dekhta hai count kart hai

  // Kisi specific channel par live subscribers ka count (Ginti) pata karo
  // Hum check karte hain ki 'user-event' ko kitne log sun rahe hain
  const numsubResult = await redis.pubsub("NUMSUB", "user-event");

  // NUMSUB => count subscriber
  // numsub ka output ek array hota hai: ['channel_name', subscriber_count]
  // e.g., ['user-event', 0]

  console.log("👥 Subscribers Count:");
  console.log(
    `Channel [${numsubResult[0]}] ko is waqt [${numsubResult[1]}] subscribers live sun rahe hain.\n`,
  );
}

checkActiveChannelsList();
