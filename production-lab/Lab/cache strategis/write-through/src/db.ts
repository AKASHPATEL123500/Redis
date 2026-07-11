import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = "mongodb://localhost:27017/akash_redis_db";
    const cnn = await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
    console.log("MongoDB Database name: ", cnn.connection.name);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);

    process.exit(1);
  }
};

export { connectDB };
