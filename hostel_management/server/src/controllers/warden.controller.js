import { verifyStudentIdCard } from "../models/warden.model.js";
import { getAllComplaints, updateComplaintStatus } from "../models/complaint.model.js";
import { updateLeaveStatus } from "../models/leave.model.js";

export const getDashboard = async (req, res) => {
  try {
    const complaints = await getAllComplaints();
    res.json({ pendingComplaints: complaints.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    await updateLeaveStatus(req.params.leaveId, "APPROVED", req.user.user_id);
    res.json({ message: "Leave approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    await updateLeaveStatus(req.params.leaveId, "REJECTED", req.user.user_id);
    res.json({ message: "Leave rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyStudentId = async (req, res) => {
  try {
    await verifyStudentIdCard(req.params.studentId, req.user.user_id);
    res.json({ message: "Student ID verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    await updateComplaintStatus(req.params.complaintId, "Resolved");
    res.json({ message: "Complaint Resolved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const complaints = await getAllComplaints();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};