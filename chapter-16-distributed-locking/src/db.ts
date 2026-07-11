import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri =
    process.env.MONGO_URL || "mongodb://127.0.0.1:27017/distributed-locking";
  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });
  console.log("MongoDB connected");
}
