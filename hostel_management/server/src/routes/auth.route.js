import express from "express";
import {login,regoster,getMe} from "../controllers/auth.cpntroller.js";
import {protect}  from "../middleware/auth.middleware.js";

const router=express.Router();

router.post("/login", login);
router.post("/register",register);
router.get("/me",protect,getMe);

export default router;