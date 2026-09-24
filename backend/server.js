import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    const isLocalDevelopment = process.env.NODE_ENV !== "production"
      && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
    if (!origin || allowedOrigins.includes(origin) || isLocalDevelopment) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "1mb" }));
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/site-content", siteContentRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const port = Number(process.env.PORT) || 5000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server running on ${port}`)
);
