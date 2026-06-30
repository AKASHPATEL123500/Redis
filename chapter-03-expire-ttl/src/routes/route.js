import { Router } from "express";
import Redis from "ioredis";
import { genrateOtp } from "../utils/otp.gen.js";

const route = Router();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

route.post("/user", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const result = await redis.set(`otp:${phone}`, otp, "EX", 300);

  return res.status(200).json({
    success: true,
    message: "Otp set successfully",
    data: result,
  });
});

route.get("/ttl-check/:phone", async (req, res) => {
  const phone = req.params.phone;

  if (!phone) {
    return res.status(400).json({ message: "Ivaild phone no" });
  }

  const result = await redis.ttl(`otp:${phone}`);

  return res.status(200).json({
    success: true,
    message: "ttl check successfully",
    leftTime: result,
  });
});

route.post("/genrate-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: "Phone num is required" });
  }

  const otp = genrateOtp();

  console.log("OTP : ", otp);

  const result = await redis.set(`otp:${phone}`, otp, "EX", 300);

  return res
    .status(200)
    .json({
      success: true,
      message: "otp genrate successfully",
      result: result,
      OTP: otp,
    });
});

route.post("/login", async (req, res) => {
  const { phone, enteredOtp } = req.body;
  if (!phone || !enteredOtp) {
    return res.status(400).json({ message: "Phone num and otp is required" });
  }

  const storedOtp = await redis.get(`otp:${phone}`);

  if (!storedOtp) {
    return res.status(400).json({ success: false, message: "OTP is expired" });
  }
  if (storedOtp === enteredOtp) {
    return res
      .status(200)
      .json({ success: true, message: "login successfully" });
  }
});

export { route };
