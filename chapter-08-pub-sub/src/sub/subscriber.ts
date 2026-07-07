import { json } from "express";
import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const channelName = "user-event";

await subscriber.subscribe(channelName);
console.log(
  `📡 Subscriber chalu hai! Channel [${channelName}] par nazar hai...`,
);
subscriber.on("message", (channel, message) => {
  console.log(`\n📬 Naya Message Aaya!`);
  console.log("Channel:", channel);
  const parsedData = JSON.parse(message);
  console.dir(parsedData, { depth: null, colors: true });
});

// // Ek alag connection sirf subscribe karne ke liye
// const subscriber = new Redis("redis://localhost:6379");

// const channelName = "live-notifications";

// async function startSubscriber() {
//   // 1. Channel ko subscribe karo
//   await subscriber.subscribe(channelName);
//   console.log(
//     `📡 Subscriber chalu hai! Channel [${channelName}] par nazar hai...`,
//   );

//   // 2. Jaise hi koi message aaye, ye event trigger hoga
//   subscriber.on("message", (channel, message) => {
//     console.log(`\n📬 Naya Message Aaya!`);
//     console.log(`Channel: ${channel}`);

//     // Kyunki data string mein aata hai, use parse kar lo
//     const data = JSON.parse(message);
//     console.log(`Data:`, data);
//   });
// }

// startSubscriber();
