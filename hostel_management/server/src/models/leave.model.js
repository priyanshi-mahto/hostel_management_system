import pool from "../config/db.js";

export const applyLeave = async (data) => {
  const { studentId, from_date, to_date, reason } = data;

  await pool.query(
    `INSERT INTO leave_request (student_id, from_date, to_date, reason)
     VALUES (?, ?, ?, ?)`,
    [studentId, from_date, to_date, reason]
  );
};

export const getLeavesByStudent = async (studentId) => {
  const [rows] = await pool.query(
    "SELECT * FROM leave_request WHERE student_id = ?",
    [studentId]
  );
  return rows;
};

export const getAllLeaves = async () => {
  const [rows] = await pool.query("SELECT * FROM leave_request");
  return rows;
};

export const updateLeaveStatus = async (leaveId, status, approvedBy = null) => {
  await pool.query(
    `UPDATE leave_request
     SET status=?, approved_by=?, approved_at=NOW()
     WHERE leave_id=?`,
    [status, approvedBy, leaveId]
  );
};
