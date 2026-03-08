import express from "express";
import {
  fetchAllLeaves as getAllLeaves,
  approveLeave,
  rejectLeave
} from "../controllers/leave.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", allowRoles("WARDEN", "HOSTEL_ADMIN"), getAllLeaves);
router.post("/:id/approve", allowRoles("WARDEN","HOSTEL_ADMIN"), approveLeave);
router.post("/:id/reject", allowRoles("WARDEN","HOSTEL_ADMIN"), rejectLeave);

export default router;
