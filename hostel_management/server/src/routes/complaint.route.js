import express from "express";
import {fetchAllComplaints, changeComplaintStatus, submitFeedback,fetchStudentComplaints} from "../controllers/complaint.controller.js";

import {protect} from "../middleware/auth.middleware.js";
import {allowRoles} from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/my", allowRoles("STUDENT"), fetchStudentComplaints);
router.get("/", allowRoles("WARDEN","STAFF","HOSTEL_ADMIN"), fetchAllComplaints);
router.put("/:id/status", allowRoles("WARDEN","STAFF","HOSTEL_ADMIN"), changeComplaintStatus);
router.post("/:id/feedback", allowRoles("STUDENT"), submitFeedback);

export default router;