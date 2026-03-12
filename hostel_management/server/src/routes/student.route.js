import express from "express";
import {getProfile,updateProfile,raiseComplaint,getComplaints,applyLeaveController,getLeaves,createVisitingRequest, getDashboard} from "../controllers/student.controller.js";

import {protect} from "../middleware/auth.middleware.js";
import {allowRoles} from "../middleware/role.middleware.js";

const router=express.Router();

router.use(protect);
router.use(allowRoles("STUDENT"));

router.get("/dashboard", getDashboard);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.post("/complaint", raiseComplaint);
router.get("/complaint", getComplaints);

router.post("/leave", applyLeaveController);
router.get("/leave", getLeaves);

router.post("/visiting-request", createVisitingRequest);

export default router;