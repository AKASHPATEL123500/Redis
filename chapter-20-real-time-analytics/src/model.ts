import mongoose from "mongoose";

// user interface

interface IUser {
  originalUrl: string;
  shortCode: string;
  clickCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const urlSchema = new mongoose.Schema<IUser>(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Url = mongoose.model<IUser>("Url", urlSchema);
export default Url;
