import express from "express";
import dotenv from "dotenv";
dotenv.config();

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

import cors from "cors";
import "./config/env.js";

import authRoutes from "./routes/auth.route.js";
import studentRoutes from "./routes/student.route.js";
import wardenRoutes from "./routes/warden.route.js";
import adminRoutes from "./routes/admin.route.js";
import complaintRoutes from "./routes/complaint.route.js";
import leaveRoutes from "./routes/leave.route.js"
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Simple request logger to help debug CORS/preflight handling
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl, "Origin:", req.headers.origin || "<none>");
  next();
});

// Allow all origins temporarily for debugging preflight
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/student",studentRoutes);
app.use("/api/warden",wardenRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/complaint",complaintRoutes);
app.use(errorHandler);

export default app;