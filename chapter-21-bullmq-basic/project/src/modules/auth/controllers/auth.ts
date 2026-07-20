import User from "../models/user.ts";
import emailProducer from "../../Email/producer/email-pro.ts";
import type { Request, Response } from "express";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, phone } = req.body;

    if (!name || !username || !email || !password || !phone) {
      return res.status(400).json({
        status: "false",
        success: false,
        message: "All field are required",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        status: "false",
        faildResion: "Invaild Crendetial",
        success: false,
        message: "Password must be at least more than 8 char",
      });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: "false",
        faildResion: "Invaild Crendetial",
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and special character",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }, { phone: phone }],
    });

    if (existingUser?.username === username) {
      return res.status(409).json({
        status: "false",
        faildResion: "Invaild Crendetial",
        success: false,
        message: "Invaild Credentials",
      });
    }

    if (existingUser?.email === email) {
      return res.status(409).json({
        status: "false",
        faildResion: "Invaild Crendetial",
        success: false,
        message: "Invaild Credentials",
      });
    }

    if (existingUser?.phone === phone) {
      return res.status(409).json({
        status: "false",
        faildResion: "Invaild Crendetial",
        success: false,
        message: "Invaild Credentials",
      });
    }

    const user = await User.create({
      name: name,
      username: username,
      email: email,
      password: password,
      phone: phone,
    });

    // fresh data for queue
    const payload = {
      name: user?.name,
      username: user?.username,
      email: user?.email,
    };

    // call producer in controller
    await emailProducer.sendWellcomeEmail(payload);
    console.log(
      "[ Controller Response ] Paylod send Successfully to the producer",
    );

    return res.status(201).json({
      status: "true",
      success: true,
      message: "Signup Successfully",
      data: user,
    });
  } catch (error: any) {
    // 🚨 TESTING TIP: Terminal me asli error dekhne ke liye ye zaroori hai!
    console.error("[Signup Controller Error]:", error);

    return res.status(500).json({
      status: "false",
      faildResion: "Server Error",
      success: false,
      message: error.message || "Server Error", // Asli error response me bhi dikhega testing ke liye
    });
  }
};

export { signup };
