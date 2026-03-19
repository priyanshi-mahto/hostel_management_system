import express from "express";
import dotenv from "dotenv";
dotenv.config();

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

// Request logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// Configure CORS properly
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({ 
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/student",studentRoutes);
app.use("/api/warden",wardenRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/complaints",complaintRoutes);
app.use("/api/leave",leaveRoutes);
app.use(errorHandler);
app.use("/uploads", express.static("uploads"));

export default app;