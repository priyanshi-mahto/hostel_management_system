import axios from "./axios";

export const getAdminDashboard = async () => {
  const res = await axios.get("/admin/dashboard");
  return res.data;
};

export const approveAdminLeave = async (leaveId) => {
  const res = await axios.post(`/leave/${leaveId}/approve`);
  return res.data;
};

export const rejectAdminLeave = async (leaveId) => {
  const res = await axios.post(`/leave/${leaveId}/reject`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get("/admin/users");
  return res.data;
};

export const getAdminStudents = async () => {
  const res = await axios.get("/admin/students");
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

export const getAdminRooms = async () => {
  const res = await axios.get("/admin/rooms");
  return res.data;
};

export const getAdminRoomAllocations = async () => {
  const res = await axios.get("/admin/room-allocations");
  return res.data;
};

export const getAllocatableStudents = async () => {
  const res = await axios.get("/admin/allocatable-students");
  return res.data;
};

export const allocateAdminRoom = async (data) => {
  const res = await axios.post("/admin/room-allocations", data);
  return res.data;
};

export const deallocateAdminRoom = async (allocationId, data) => {
  const res = await axios.put(`/admin/room-allocations/${allocationId}/deallocate`, data);
  return res.data;
};

export const assignWarden = async (data) => {
  const res = await axios.post("/admin/assign-warden", data);
  return res.data;
};

export const getAdminWardens = async () => {
  const res = await axios.get("/admin/wardens");
  return res.data;
};

export const createAdminWarden = async (data) => {
  const res = await axios.post("/admin/wardens", data);
  return res.data;
};

export const updateAdminWarden = async (wardenId, data) => {
  const res = await axios.put(`/admin/wardens/${wardenId}`, data);
  return res.data;
};

export const deleteAdminWarden = async (wardenId) => {
  const res = await axios.delete(`/admin/wardens/${wardenId}`);
  return res.data;
};

export const getAdminOfficeStaff = async () => {
  const res = await axios.get("/admin/staff");
  return res.data;
};

export const createAdminOfficeStaff = async (data) => {
  const res = await axios.post("/admin/staff", data);
  return res.data;
};

export const updateAdminOfficeStaff = async (staffId, data) => {
  const res = await axios.put(`/admin/staff/${staffId}`, data);
  return res.data;
};

export const deleteAdminOfficeStaff = async (staffId) => {
  const res = await axios.delete(`/admin/staff/${staffId}`);
  return res.data;
};

export const getAdminAssignableUsers = async (role) => {
  const res = await axios.get("/admin/available-users", { params: { role } });
  return res.data;
};

export const getAdminIdCards = async () => {
  const res = await axios.get("/admin/id-cards");
  return res.data;
};

export const verifyAdminIdCard = async (studentId) => {
  const res = await axios.put(`/admin/id-cards/${studentId}/verify`);
  return res.data;
};

export const rejectAdminIdCard = async (studentId, data) => {
  const res = await axios.put(`/admin/id-cards/${studentId}/reject`, data);
  return res.data;
};

export const getAdminLostFoundItems = async () => {
  const res = await axios.get("/admin/lost-found");
  return res.data;
};

export const getAdminLostFoundStats = async () => {
  const res = await axios.get("/admin/lost-found/stats");
  return res.data;
};

export const createAdminLostFoundItem = async (data) => {
  const res = await axios.post("/admin/lost-found", data);
  return res.data;
};

export const claimAdminLostFoundItem = async (itemId) => {
  const res = await axios.put(`/admin/lost-found/${itemId}/claim`);
  return res.data;
};

export const getAdminNotifications = async () => {
  const res = await axios.get("/admin/notifications");
  return res.data;
};

export const sendAdminNotification = async (data) => {
  const res = await axios.post("/admin/notifications", data);
  return res.data;
};

export const deleteAdminNotification = async (notificationId) => {
  const res = await axios.delete(`/admin/notifications/${notificationId}`);
  return res.data;
};

export const getAdminVisitorRequests = async () => {
  const res = await axios.get('/admin/visitors');
  return res.data;
};

export const updateAdminVisitorRequestStatus = async (requestId, status) => {
  const res = await axios.put(`/admin/visitors/${requestId}/status`, { status });
  return res.data;
};
