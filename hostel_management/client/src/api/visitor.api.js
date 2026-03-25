import axios from "./axios";

export const createVisitorProfile = async (data) => {
  const res = await axios.post("/visitor/profile", data);
  return res.data;
};

export const getVisitorProfiles = async () => {
  const res = await axios.get("/visitor/profiles");
  return res.data;
};

export const createVisitorRequest = async (data) => {
  const res = await axios.post("/visitor/request", data);
  return res.data;
};

export const getVisitorRequests = async () => {
  const res = await axios.get("/visitor/requests");
  return res.data;
};