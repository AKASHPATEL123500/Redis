import mongoose from "mongoose";
import "dotenv/config";
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment");
    }
    const cnn = await mongoose.connect(uri);
    console.log("MongoDB Connected Successfully");
    console.log("MongoDB Database Name : ", cnn.connection.name);
  } catch (error) {
    console.error("MongoDB Error : ", error);
    process.exit(1);
  }
};

export default connectDB;
