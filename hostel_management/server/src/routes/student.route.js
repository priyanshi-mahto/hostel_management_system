import express from "express";
import {getProfile,updateProfile,raiseComplaint,getComplaints,applyLeaveController,getLeaves,createVisitingRequest, getDashboard,uploadIDCard, getIDCard, uploadProfileImage, removeProfileImage} from "../controllers/student.controller.js";

import {protect} from "../middleware/auth.middleware.js";
import {allowRoles} from "../middleware/role.middleware.js";
import { upload, uploadProfile } from "../middleware/upload.middleware.js";

const router=express.Router();

router.use(protect);
router.use(allowRoles("STUDENT"));

router.get("/dashboard", getDashboard);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.post("/profile-image", uploadProfile.single("profile_image"), uploadProfileImage);
router.delete("/profile-image", removeProfileImage);

router.post("/complaint", raiseComplaint);
router.get("/complaint", getComplaints);

router.post("/leave", applyLeaveController);
router.get("/leave", getLeaves);

router.post("/visiting-request", createVisitingRequest);

router.get("/id-card", getIDCard);


router.post(
  "/upload-id-card",
  protect,
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 }
  ]),
  uploadIDCard
);

export default router;