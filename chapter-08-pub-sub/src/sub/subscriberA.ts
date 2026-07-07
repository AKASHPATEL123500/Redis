import Redis from "ioredis";

const subcriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const channelName = "user-event";

console.log(
  "Subscriber chalu hai jise hi koi channel ayega subscriber kar lunga..",
);

await subcriber.subscribe(channelName, (err) => {
  if (err) {
    console.log("ERROR: ", err);
  }
  console.log("Channel subscribe successfully : ", channelName);
});

subcriber.on("message", (channel, message) => {
  console.log("\nKhuch Data aya hai jo ki yaha hai\n");
  console.log("Channel : ", channel);
  const parsedData = JSON.parse(message);
  console.dir(parsedData, { depth: null, colors: true });
});
