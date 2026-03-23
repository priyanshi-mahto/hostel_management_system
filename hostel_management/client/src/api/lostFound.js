import axios from "./axios";

export const getAllItems = async () => {
  const res = await axios.get("/items");
  return res.data;
};

export const getStats = async () => {
  const res = await axios.get("/items/stats");
  return res.data;
};

export const addItem = async (data) => {
  const res = await axios.post("/items", data);
  return res.data;
};

export const claimItem = async (itemId) => {
  const res = await axios.put(`/items/claim/${itemId}`);
  return res.data;
};