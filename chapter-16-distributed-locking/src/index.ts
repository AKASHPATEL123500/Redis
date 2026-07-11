import express from "express";
import Redis from "ioredis";
import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { connectDB } from "./db.ts";
import Product from "./model.ts";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const token = randomUUID();
console.log(token);

function productKey(id: string): string {
  return `lock:product:${id}`;
}

async function releaseLock(key: string, value: string) {
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  return redis.eval(script, 1, key, value);
}

app.post("/product", async (req: Request, res: Response) => {
  const { name, price, stock } = req.body;

  if (!name || typeof price !== "number" || typeof stock !== "number") {
    return res.status(400).json({
      success: false,
      message:
        "name, price, and stock are required. Price and stock must be numbers.",
    });
  }

  const product = await Product.create({ name, price, stock });
  return res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    },
  });
});

app.post("/buy/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const lockKey = productKey(id);
  const lockToken = randomUUID();
  const lockResult = await redis.set(lockKey, lockToken, "NX", "EX", 30);

  if (lockResult === null) {
    return res.status(409).json({
      success: false,
      message: "Product is already locked. Try again later.",
    });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock.",
      });
    }

    product.stock -= 1;
    await product.save();

    return res.json({
      success: true,
      message: "Purchase successful.",
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      },
    });
  } finally {
    await releaseLock(lockKey, lockToken);
  }
});

app.listen(3000, async () => {
  await connectDB();
  console.log(`Server is running on http://localhost:3000`);
});
