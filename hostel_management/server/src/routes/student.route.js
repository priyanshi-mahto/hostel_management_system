import express from "express";
import {getProfile,updateProfile,raiseComplaint,getComplaints,applyLeave,getLeaves,createVisitingRequest} from "../controllers/student.controller.js";

import {protect} from "../middleware/auth.middleware.js";
import {allowRoles} from "../middleware/role.middleware.js";

const router=express.Router();

router.use(protect);
router.use(allowRoles("STUDENT"));

router.get("/profile",protect,getProfile);
router.put("/profile",updateProfile);

router.post("/complaint",raiseComplaint);
router.get("/complaint",getComplaint);

router.post("/leave",applyLeave);
router.get("/leave",getLeave);

router.post("/visiting-request" , createVisitingRequest);

export default router;