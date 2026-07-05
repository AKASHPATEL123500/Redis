import express from "express";
import { Login } from "../controllers/user.controller.ts";
import redis from "../config/redis.ts";
import User from "../models/user.model.ts";

const authRouter = express.Router();

authRouter.post("/create-user", Login);

authRouter.get("/get-user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cachedUser = await redis.hgetall(`user:${id}`);
    console.log("Redis cache status check ke waqt output:", cachedUser);

    if (cachedUser && Object.keys(cachedUser).length > 0) {
      const currentTTL = await redis.ttl(`user:${id}`);
      console.log(
        `[CACHE HIT]: Is user ka bacha hua TTL hai: ${currentTTL} seconds`,
      );

      return res.status(200).json({
        success: true,
        message: "User found in cache (Cache Hit)!",
        data: cachedUser,
        ttl_left: currentTTL,
      });
    }

    console.log("--- CACHE MISS! MongoDB se data nikal raha hai ---");

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found in MongoDB" });
    }

    await redis.hset(`user:${id}`, {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      age: user.age ? user.age.toString() : "",
      role: user.role || "",
    });

    await redis.expire(`user:${id}`, 30);

    const timeLeft = await redis.ttl(`user:${id}`);
    console.log(
      `====> SUCCESS: Key delete hone mein ${timeLeft} seconds baki hain.`,
    );

    return res.json({
      success: true,
      message: "User found in DB (Cache Miss)!",
      user: user,
    });
  } catch (error) {
    console.error("Oops! Code mein error aaya hai:", (error as Error).message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
});

authRouter.patch("/update-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email: email },
      { new: true },
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cachedKey = `user:${id}`;
    await redis.del(cachedKey);
    console.log("Cached clear in redis");

    return res.status(200).json({
      success: true,
      message: "Email update successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Oops! Code mein error aaya hai:", (error as Error).message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
});

export default authRouter;
