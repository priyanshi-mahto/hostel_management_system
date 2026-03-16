import express from "express";
import {login,register,getMe} from "../controllers/auth.controller.js";
import {protect}  from "../middleware/auth.middleware.js";
import { changePassword } from "../controllers/auth.controller.js";


const router=express.Router();
router.post("/change-password", protect, changePassword);

router.post("/login", login);
router.post("/register",register);
router.get("/me",protect,getMe);

export default router;