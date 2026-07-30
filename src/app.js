import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

import serviceRoutes from "./routes/serviceRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import directorRoutes from "./routes/directorRoutes.js";
import counterRoutes from "./routes/counterRoutes.js";
import socialLinksRoutes from "./routes/socialLinksRoutes.js";
import heroVideoRoutes from "./routes/heroVideoRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();

// Security headers
app.use(helmet());

// CORS — open to all origins per requirements (no auth)
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL] : "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:3000',
        'https://palegreen-gnat-630379.hostingersite.com',
        "https://honeydew-ibis-212250.hostingersite.com",
        "https://sikka-mu.vercel.app",
        'http://localhost:3001',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        process.env.CLIENT_URL
      ].filter(Boolean);
      
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    optionsSuccessStatus: 200
  })
);
// HTTP request logging
app.use(morgan("dev"));

// Body parsers — JSON and URL-encoded. The "raw" parsing of file bodies
// is handled by Multer on the individual upload routes that need it.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) =>
  res.status(200).json({ success: true, message: "API is healthy", data: { status: "ok" } })
);

// Swagger docs
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

// API routes
app.use("/api/services", serviceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/team",teamRoutes);
app.use("/api/directors",directorRoutes);
app.use("/api/counters", counterRoutes);
app.use("/api/social-links", socialLinksRoutes);
app.use("/api/hero-video", heroVideoRoutes);
app.use("/api/images", imageRoutes);
// 404 + global error handler (must be registered last)
app.use(notFound);
app.use(errorHandler);

export default app;
