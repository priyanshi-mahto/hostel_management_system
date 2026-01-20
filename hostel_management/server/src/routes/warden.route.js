import express from "express";
import{
    getDashboard,
    approveLeave,
    rejectLeave,
    verifyStudentId,
    getComplaints
} from "../controllers/warden.controller.js";

import {protect} from "../middleware/auth.middleware.js";
import{ allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(allowRoles("WARDEN"));

router.get("/dashboard",getDashboard);

router.post("/leave/:leaveId/approve" , approveLeave);
router.post("/leave/:leaveId/reject",rejectLeave);

router.post("/verify-id/:studentId" , verifyStudentId);

router.get("/complaints",getComplaints);

export default router;