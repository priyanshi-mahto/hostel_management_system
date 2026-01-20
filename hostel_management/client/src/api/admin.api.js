import axios from "./axios";

export const getAllUsers = async () => {
  const res = await axios.get("/admin/users");
  return res.data;
};

export const getAllHostels = async () => {
  const res = await axios.get("/admin/hostels");
  return res.data;
};

export const createHostel = async (data) => {
  const res = await axios.post("/admin/hostel", data);
  return res.data;
};

export const createRoom = async (data) => {
  const res = await axios.post("/admin/room", data);
  return res.data;
};

export const assignWarden = async (data) => {
  const res = await axios.post("/admin/assign-warden", data);
  return res.data;
};
