import express from "express";
import cors from "cors";
import "./confige/env.js";

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/student",studentRoutes);

export default app;