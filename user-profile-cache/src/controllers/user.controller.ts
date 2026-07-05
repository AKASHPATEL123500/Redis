import type { Request, Response } from "express";
import User from "../models/user.model.ts";

const Login = async (req: Request, res: Response) => {
  try {
    const { name, email, age, role } = req.body;

    if (!name || !email || !age || !role) {
      return res.status(400).json({
        success: false,
        message: "all field are required",
      });
    }

    const user = await User.create({ name, email, age, role });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      Data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err : new Error("Unknown error"),
    });
  }
};

export { Login };
