import express from "express";
import {
	getDashboard,
	createHostel,
	createRoom,
	getRooms,
	getRoomAllocations,
	getAllocatableStudents,
	allocateStudentRoom,
	deallocateStudentRoom,
	assignWarden,
	getWardens,
	updateWarden,
	removeWarden,
	getOfficeStaff,
	createOfficeStaffMember,
	updateOfficeStaffMember,
	removeOfficeStaffMember,
	getAssignableUsers,
	getUsers as getAllUsers,
	getStudents as getAllStudents,
	getAllHostels,
	getIdCards,
	verifyIdCard,
	rejectIdCard,
	getLostFoundItems,
	getLostFoundStats,
	createLostFoundItem,
	claimLostFoundItem,
	getNotifications,
	sendNotification,
	deleteNotificationById,
	getVisitorRequests,
	updateVisitorRequestStatus,
} from "../controllers/admin.controller.js";

import {protect} from "../middleware/auth.middleware.js";
import {allowRoles} from "../middleware/role.middleware.js";
import { requireAdminHostelContext } from "../middleware/adminHostel.middleware.js";

const router=express.Router();

router.use(protect);
router.use(allowRoles("HOSTEL_ADMIN"));
router.use(requireAdminHostelContext);

router.get("/dashboard", getDashboard);
router.post("/hostel", createHostel);
router.post("/room", createRoom);
router.get("/rooms", getRooms);
router.get("/room-allocations", getRoomAllocations);
router.get("/allocatable-students", getAllocatableStudents);
router.post("/room-allocations", allocateStudentRoom);
router.put("/room-allocations/:allocationId/deallocate", deallocateStudentRoom);
router.post("/assign-warden", assignWarden);
router.get("/wardens", getWardens);
router.post("/wardens", assignWarden);
router.put("/wardens/:wardenId", updateWarden);
router.delete("/wardens/:wardenId", removeWarden);
router.get("/staff", getOfficeStaff);
router.post("/staff", createOfficeStaffMember);
router.put("/staff/:staffId", updateOfficeStaffMember);
router.delete("/staff/:staffId", removeOfficeStaffMember);
router.get("/available-users", getAssignableUsers);

router.get("/users", getAllUsers);
router.get("/students", getAllStudents);
router.get("/hostels", getAllHostels);
router.get("/id-cards", getIdCards);
router.put("/id-cards/:studentId/verify", verifyIdCard);
router.put("/id-cards/:studentId/reject", rejectIdCard);

router.get("/lost-found", getLostFoundItems);
router.get("/lost-found/stats", getLostFoundStats);
router.post("/lost-found", createLostFoundItem);
router.put("/lost-found/:itemId/claim", claimLostFoundItem);

router.get("/notifications", getNotifications);
router.post("/notifications", sendNotification);
router.delete("/notifications/:notificationId", deleteNotificationById);

router.get("/visitors", getVisitorRequests);
router.put("/visitors/:requestId/status", updateVisitorRequestStatus);

export default router;