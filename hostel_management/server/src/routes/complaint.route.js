import express from "express";
import {getAllComplaints, updateComplaintStatus, submitFeedback} from "../controllers/complaint.controller.js";

import {protect} from "../middleware/auth.middleware.js";
import {allowRoles} from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/",allowRoles("WARDEN","STAFF","HOSTEL_ADMIN"),getAllComplaints);
router.put("/:id/status",allowRoles("WARDEN","STAFF","HOSTEL_ADMIN"),updateComplaintStatus);
router.post("/:id/feedback",allowRoles("STUDENT"),getAllComplaints);

export default router;