import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  age: number;
  role: "user" | "admin";
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export { User };
