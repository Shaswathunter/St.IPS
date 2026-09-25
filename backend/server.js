import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://stips-blue.vercel.app",
];

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/site-content", siteContentRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully 🚀",
  });
});

// Default Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to St. IPS Backend API",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});