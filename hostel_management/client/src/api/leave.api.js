import axios from "./axios";

// Get all leave requests (warden/admin)
export const getAllLeaves = async () => {
  const res = await axios.get("/leave");
  return res.data;
};

// Approve leave
export const approveLeave = async (leaveId) => {
  const res = await axios.post(`/leave/${leaveId}/approve`);
  return res.data;
};

// Reject leave
export const rejectLeave = async (leaveId) => {
  const res = await axios.post(`/leave/${leaveId}/reject`);
  return res.data;
};
