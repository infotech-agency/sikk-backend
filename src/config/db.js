import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://<username>:<password>@cluster0.mongodb.net/infrastructure_db?retryWrites=true&w=majority";

/**
 * Establishes a connection to MongoDB Atlas using Mongoose.
 * Retries automatically on transient connection failures.
 */
export const connectDB = async () => {
  if (!MONGODB_URI || MONGODB_URI.includes("<username>")) {
    console.warn(
      "⚠️  MONGODB_URI is not configured. Set it in your .env file before running the app."
    );
    return;
  }

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
  });

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
  } catch (err) {
    console.error("❌ Initial MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
