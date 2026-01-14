import express from "express";
import cors from "cors";
import "./config/env.js";

import authRoutes from "./routes/auth.route.js";
import studentRoutes from "./routes/student.route.js";
import wardenRoutes from "./routes/warden.route.js";
import adminRoutes from "./routes/admin.route.js";
import complaintRoutes from "./routes/complaint.route.js";
import leaveRoutes from "./routes/leave.route.js"

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/student",studentRoutes);
app.use("/api/warden",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/complaint",complaintRoutes);
app.use("/api/leave",leaveRoutes);

export default app;