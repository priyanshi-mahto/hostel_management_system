import express from "express";
import {createHostel,createRoom,assignWarden,getAllUsers,getAllHostels} from "..//controllers/admin.controller.js";

import {protect} from "../middleware/auth.middleware.js";
import {allowRoles} from "../middleware/role.middleware.js";

const router=express.Router();

router.use(protect);
router.use(allowRoles("HOSTEL_ADMIN"));

router.post("/hostel", createHostel);
router.post("/room", createRoom);
router.post("/assign-warden", assignWarden);

router.get("/users", getAllUsers);
router.get("/hostels", getAllHostels);

export default router;