import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
// Wildcard Pattern: Iska matlab hai "kuch bhi likha ho, par aakhiri mein -event hona chahiye"
const eventPattern = "*-event";

async function startCentralSubscriber() {
  console.log("🚀 Central Subscriber System Initializing...");
  try {
    await subscriber.psubscribe(eventPattern);
    console.log(
      `📡 Success! Pattern [${eventPattern}] par listening chalu hai.\n`,
    );

    // 2. IMPORTANT: Pattern subscription ke liye event ka naam "pmessage" hota hai ("message" nahi!)
    // Isme hume 3 cheezein milti hain: pattern, actual channel ka naam, aur message
    subscriber.on("pmessage", (pattern, channel, message) => {
      console.log(
        `\n🔔 [NEW EVENT] Aaya hai channel: ${channel} (Pattern: ${pattern})`,
      );

      const parseObj = JSON.parse(message);

      if (channel === "user-event") handleUserEvent(parseObj);
      else if (channel === "payment-event") handlePaymentEvent(parseObj);
      else if (channel === "notification-event")
        handleNotificationEvent(parseObj);
      else
        console.log(
          `⚠️ Unknown Channel [${channel}]: Koi handler nahi mila iske liye.`,
        );
    });
  } catch (error) {
    console.error("ERROR: ", (error as Error).message);
  }
}

function handleUserEvent(data: any) {
  console.log("👤 [User Handler Processing]: User login ho gaya hai!");
  console.dir(data, { depth: null, colors: true });
}

function handlePaymentEvent(data: any) {
  console.log("💰 [Payment Handler Processing]: Payment status update!");
  console.dir(data, { depth: null, colors: true });
}

function handleNotificationEvent(data: any) {
  console.log("📩 [Notification Handler Processing]: Sending SMS/Email...");
  console.dir(data, { depth: null, colors: true });
}

// central-subscriber.ts ke sabse neeche ye lagaya jata hai:

process.on("SIGINT", async () => {
  console.log("\n🛑 Server band ho raha hai... Cleaning up connections...");

  // Usi subscriber instance se unsubscribe karo
  await subscriber.punsubscribe("*-event");
  console.log("Kaan band kar liye hain (Unsubscribed).");

  // Redis connection close karo
  subscriber.quit();
  process.exit(0);
});

startCentralSubscriber();
