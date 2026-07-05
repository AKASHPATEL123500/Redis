import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI || "mongodb://localhost:27017/akash_redis_db";
    const cnn = await mongoose.connect(MONGO_URI);
    console.log("Database name: ", cnn.connection.name);
    console.log("MongoDB connect successfully");
  } catch (error) {
    console.log("Error: ", error);
    console.error(`Mongodb connected error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export { connectDB };
