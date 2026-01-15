import pool from "../config/db.js";

export const getWardenByUserId = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM warden WHERE user_id = ?",
    [userId]
  );
  return rows[0];
};

export const verifyStudentIdCard = async (studentId, verifiedBy) => {
  await pool.query(
    `UPDATE student_id_card
     SET verification_status='VERIFIED', verified_by=?
     WHERE student_id=?`,
    [verifiedBy, studentId]
  );
};
