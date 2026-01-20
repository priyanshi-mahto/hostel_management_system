import axios from "./axios";

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
