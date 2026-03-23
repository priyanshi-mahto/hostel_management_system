import express from "express";
import {
  createVisitorProfile,
  getVisitorProfiles,
  createVisitingRequest,
  getRequests
} from "../controllers/visitor.controller.js";

const router = express.Router();

router.post("/profile", createVisitorProfile);
router.get("/profile/:student_id", getVisitorProfiles);

router.post("/request", createVisitingRequest);
router.get("/request/:student_id", getRequests);

export default router;