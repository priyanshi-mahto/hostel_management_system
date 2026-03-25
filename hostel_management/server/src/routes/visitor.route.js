import express from "express";
import {
  createVisitorProfile,
  getVisitorProfiles,
  createVisitingRequest,
  getRequests
} from "../controllers/visitor.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(allowRoles("STUDENT"));

router.post("/profile", createVisitorProfile);
router.get("/profiles", getVisitorProfiles);

router.post("/request", createVisitingRequest);
router.get("/requests", getRequests);

export default router;