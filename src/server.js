import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import Career from "./models/Career.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB Atlas before listening
  await connectDB();

  // Always start the HTTP server even if Mongo is unavailable, so the
  // health and docs endpoints are still reachable for debugging.
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📘 Swagger docs at http://localhost:${PORT}/api/docs`);
  });
};

// const test = async()=>{
//   const res = await Career.findById("6a368bf3e75c0871d2b4d720");
//   console.log(res)
// }

// test();

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
