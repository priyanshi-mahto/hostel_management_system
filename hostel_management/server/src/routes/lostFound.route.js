import express from "express";
import {
  fetchItems,
  fetchStats,
  addItem,
  claimItem
} from "../controllers/lostFound.controller.js";

const router = express.Router();

router.get("/", fetchItems);
router.get("/stats", fetchStats);
router.post("/", addItem);
router.put("/claim/:itemId", claimItem);

export default router;