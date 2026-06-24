import axios from "./axios";

export const getStudentDashboard = async () => {
  const res = await axios.get("/student/dashboard");
  return res.data;
};

export const getStudentProfile = async () => {
  const res = await axios.get("/student/profile");
  return res.data;
};

export const updateStudentProfile = async (data) => {
  const res = await axios.put("/student/profile", data);
  return res.data;
};

export const applyLeave = async (data) => {
  const res = await axios.post("/student/leave", data);
  return res.data;
};

export const createVisitingRequest = async (data) => {
  const res = await axios.post("/student/visiting-request", data);
  return res.data;
};

export const uploadStudentProfileImage = async (formData) => {
  const res = await axios.post("/student/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const deleteStudentProfileImage = async () => {
  const res = await axios.delete("/student/profile-image");
  return res.data;
};
