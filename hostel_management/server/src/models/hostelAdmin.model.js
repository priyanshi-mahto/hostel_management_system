import pool from "../config/db.js";

export const getHostelAdminByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT hostel_admin_id, user_id, hostel_id
     FROM hostel_admin
     WHERE user_id = ?`,
    [userId]
  );

  return rows[0] || null;
};
