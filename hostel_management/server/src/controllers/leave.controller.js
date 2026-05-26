import {
  getAllLeaves,
  getLeavesByHostel,
  updateLeaveStatus,
  updateLeaveStatusByHostel,
} from "../models/leave.model.js";
import { getHostelAdminByUserId } from "../models/hostelAdmin.model.js";

export const fetchAllLeaves = async (req, res) => {
  try {
    let leaves;

    if (req.user.role === "HOSTEL_ADMIN") {
      const admin = await getHostelAdminByUserId(req.user.user_id);
      if (!admin) {
        return res.status(403).json({ message: "Hostel admin is not mapped to any hostel" });
      }

      leaves = await getLeavesByHostel(admin.hostel_id);
    } else {
      leaves = await getAllLeaves();
    }

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    let result;

    if (req.user.role === "HOSTEL_ADMIN") {
      const admin = await getHostelAdminByUserId(req.user.user_id);
      if (!admin) {
        return res.status(403).json({ message: "Hostel admin is not mapped to any hostel" });
      }

      result = await updateLeaveStatusByHostel(req.params.id, "APPROVED", req.user.user_id, admin.hostel_id);
    } else {
      result = await updateLeaveStatus(req.params.id, "APPROVED", req.user.user_id);
    }

    if (!result?.affectedRows) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json({ message: "Leave approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    let result;

    if (req.user.role === "HOSTEL_ADMIN") {
      const admin = await getHostelAdminByUserId(req.user.user_id);
      if (!admin) {
        return res.status(403).json({ message: "Hostel admin is not mapped to any hostel" });
      }

      result = await updateLeaveStatusByHostel(req.params.id, "REJECTED", req.user.user_id, admin.hostel_id);
    } else {
      result = await updateLeaveStatus(req.params.id, "REJECTED", req.user.user_id);
    }

    if (!result?.affectedRows) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json({ message: "Leave rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
