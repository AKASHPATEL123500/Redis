import mongoose from "mongoose";

// user interface

interface IUser {
  originalUrl: string;
  shortCode: string;
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
  },
  { timestamps: true },
);

const Url = mongoose.model<IUser>("Url", urlSchema);
export default Url;
