import mongoose from "mongoose";
import { envVars } from "../config/env";

export const connectMongoose = async () => {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
