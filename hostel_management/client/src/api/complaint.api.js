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
