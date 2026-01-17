import {
  getAllLeaves,
  updateLeaveStatus
} from "../models/leave.model.js";

export const fetchAllLeaves = async (req, res) => {
  try {
    const leaves = await getAllLeaves();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    await updateLeaveStatus(req.params.id, "APPROVED", req.user.user_id);
    res.json({ message: "Leave approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    await updateLeaveStatus(req.params.id, "REJECTED", req.user.user_id);
    res.json({ message: "Leave rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
