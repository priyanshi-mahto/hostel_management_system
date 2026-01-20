import axios from "./axios";

// Dashboard
export const getWardenDashboard = async () => {
  const res = await axios.get("/warden/dashboard");
  return res.data;
};

// Complaints
export const getAllComplaints = async () => {
  const res = await axios.get("/warden/complaints");
  return res.data;
};

// Leave approval
export const approveLeave = async (leaveId) => {
  const res = await axios.post(`/warden/leave/${leaveId}/approve`);
  return res.data;
};

export const rejectLeave = async (leaveId) => {
  const res = await axios.post(`/warden/leave/${leaveId}/reject`);
  return res.data;
};

// Verify student ID
export const verifyStudentId = async (studentId) => {
  const res = await axios.post(`/warden/verify-id/${studentId}`);
  return res.data;
};
