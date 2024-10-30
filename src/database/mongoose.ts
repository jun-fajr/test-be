import mongoose from "mongoose";

export const connectDB = async (url: string): Promise<void> => {
  try {
    await mongoose.connect(url);
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
