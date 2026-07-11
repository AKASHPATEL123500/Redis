import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = "mongodb://localhost:27017/akash_redis_db";

    const cnn = await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
    console.log("DB name : ", cnn.connection.name);
  } catch (error) {
    console.log(Error);
    process.exit(1);
  }
};
