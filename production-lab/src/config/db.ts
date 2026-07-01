import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }
    const cnn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${cnn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
