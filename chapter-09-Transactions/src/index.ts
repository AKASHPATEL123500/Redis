import express from "express";
import Redis from "ioredis";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function userKey(userId: string): string {
  return `user:${userId}`;
}

function walletKey(walletId: string): string {
  return `wallet:${walletId}`;
}

function walletKeys(name: string) {
  return `wallet:${name.toLowerCase()}`;
}
app.post("/upgrade-premium", async (req: Request, res: Response) => {
  const { userId, name, username, planType, price } = req.body;

  // 1. Transaction Shuru (MULTI) -> Commands line mein lagna shuru
  const tx = redis.multi();

  // 2. Pehli Command queue karo: Profile ko premium status do
  tx.hset(userKey(userId), {
    id: userId,
    name: name,
    username: username,
    planType: planType || "monthly gold pro",
    price: price || "$10",
    isPremium: "true",
  });

  // 3. Dusri Command queue karo: 30 din ki expiry lagao (30 * 24 * 60 * 60 seconds)
  const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
  tx.expire(userKey(userId), thirtyDaysInSeconds);

  // 4. Fire (EXEC): Ab Redis dono commands ko ek jhatke mein chala dega
  const result = await tx.exec();

  return res.status(200).json({
    success: true,
    message: `User ${userId} successfully upgraded to Premium!`,
    redisResponse: result, // Ye dikhayega ki dono commands chal gayi
  });
});

app.get("/ttl", async (req: Request, res: Response) => {
  const { userId } = req.body;
  const result = await redis.ttl(userKey(userId));

  return res.status(200).json({
    success: true,
    message: `ttl chech successfully`,
    redisResponse: result, // Ye dikhayega ki dono commands chal gayi
  });
});

app.get("/get-user", async (req: Request, res: Response) => {
  const { userId } = req.body;

  const exists = await redis.exists(userKey(userId));
  if (!exists) {
    return res.status(404).json({
      success: false,
      message: "User nahi mila ya fir uska pack Expire ho gaya hai! (-2)",
    });
  }
  const result = await redis.hgetall(userKey(userId));

  console.dir(result, { depth: null, colors: true });
  return res.status(200).json({
    success: true,
    message: `user get successfully`,
    redisResponse: result, // Ye dikhayega ki dono commands chal gayi
  });
});

app.post("/test-discard", async (req: Request, res: Response) => {
  const { userId } = req.body;
  const name = "Akash reddy";

  const tx = redis.multi();

  await tx.hset(userKey(userId), name);
  await redis.expire(userKey(userId), 100);

  const cancleTransaction = true;
  if (cancleTransaction) {
    const resutl = await tx.discard();
    return res.status(200).json({
      message: "Operation stop transaction stop using discard",
      result: resutl,
    });
  }

  await tx.exec();
  return res.json({ success: true });
});

app.post("/wallet/transfer", async (req: Request, res: Response) => {
  const { from, to, amount } = req.body;

  try {
    // 1. Redis ko bolo ki sender wallet ko watch karo
    await redis.watch(walletKey(from));

    // 2. Sender aur Receiver ka current balance read karo
    const senderBalance = Number(await redis.hget(walletKey(from), "balance"));

    const receiverBalance = Number(await redis.hget(walletKey(to), "balance"));

    // Validation
    if (isNaN(senderBalance) || isNaN(receiverBalance)) {
      await redis.unwatch();

      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    if (senderBalance < amount) {
      await redis.unwatch();

      return res.status(400).json({
        success: false,
        message: "Insufficient Balance",
      });
    }

    // 👇 Race Condition ko test karne ke liye
    console.log("⏳ Waiting 10 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // 3. Transaction Start
    const tx = redis.multi();

    tx.hset(walletKey(from), "balance", senderBalance - amount);

    tx.hset(walletKey(to), "balance", receiverBalance + amount);

    // 4. Execute Transaction
    const result = await tx.exec();

    // 5. WATCH fail hua?
    if (result === null) {
      return res.status(409).json({
        success: false,
        message: "Transaction aborted! Wallet data changed by another request.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transfer Successful",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

app.post("/wallet", async (req: Request, res: Response) => {
  const { name, balance } = req.body;

  if (!name || balance === undefined) {
    return res.status(400).json({
      success: false,
      message: "Name and balance are required",
    });
  }

  await redis.hset(walletKeys(name), {
    name,
    balance: balance.toString(),
  });

  return res.status(201).json({
    success: true,
    message: "Wallet created successfully",
  });
});

app.get("/wallet", async (req: Request, res: Response) => {
  const { name } = req.body;

  const wallet = await redis.hgetall(walletKeys(name));

  if (Object.keys(wallet).length === 0) {
    return res.status(404).json({
      success: false,
      message: "Wallet not found",
    });
  }

  return res.json({
    success: true,
    data: wallet,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
