import axios from "./axios";

export const raiseComplaint = async (data) => {
  const res = await axios.post("/student/complaint", data);
  return res.data;
};

export const getStudentComplaints = async () => {
  const res = await axios.get("/student/complaint");
  return res.data;
};

export const submitComplaintFeedback = async (complaintId, data) => {
  const res = await axios.post(
    `/complaints/${complaintId}/feedback`,
    data
  );
  return res.data;
};

export const getAdminComplaints = async () => {
  const res = await axios.get("/complaints");
  return res.data;
};

export const updateAdminComplaintStatus = async (complaintId, status) => {
  const res = await axios.put(`/complaints/${complaintId}/status`, { status });
  return res.data;
};
