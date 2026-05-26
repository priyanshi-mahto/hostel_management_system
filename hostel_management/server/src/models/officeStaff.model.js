import pool from "../config/db.js";

export const getOfficeStaffByHostelId = async (hostelId) => {
  const [rows] = await pool.query(
    `SELECT os.staff_id, os.name, os.phone, os.user_id, u.email, h.hostel_name, h.type
     FROM office_staff os
     JOIN users u ON u.user_id = os.user_id
     JOIN hostel h ON h.hostel_id = os.hostel_id
     WHERE os.hostel_id = ?
     ORDER BY os.name ASC, os.staff_id ASC`,
    [hostelId]
  );

  return rows;
};

export const createOfficeStaff = async ({ userId, hostelId, name, phone }) => {
  const [result] = await pool.query(
    `INSERT INTO office_staff (name, phone, user_id, hostel_id)
     VALUES (?, ?, ?, ?)`,
    [name, phone || null, userId, hostelId]
  );

  return result.insertId;
};

export const updateOfficeStaffById = async ({ staffId, hostelId, name, phone }) => {
  const [result] = await pool.query(
    `UPDATE office_staff
     SET name = ?, phone = ?
     WHERE staff_id = ? AND hostel_id = ?`,
    [name, phone || null, staffId, hostelId]
  );

  return result;
};

export const deleteOfficeStaffById = async (staffId, hostelId) => {
  const [result] = await pool.query(
    `DELETE FROM office_staff
     WHERE staff_id = ? AND hostel_id = ?`,
    [staffId, hostelId]
  );

  return result;
};