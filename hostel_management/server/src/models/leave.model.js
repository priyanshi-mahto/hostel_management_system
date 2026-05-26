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

export const getLeavesByHostel = async (hostelId) => {
  const [rows] = await pool.query(
    `SELECT lr.*, s.name AS student_name, s.roll_no
     FROM leave_request lr
     INNER JOIN student s ON s.student_id = lr.student_id
     WHERE s.hostel_id = ?
     ORDER BY (lr.status = 'PENDING') DESC, lr.applied_at DESC, lr.leave_id DESC`,
    [hostelId]
  );
  return rows;
};

export const updateLeaveStatus = async (leaveId, status, approvedBy = null) => {
  const [result] = await pool.query(
    `UPDATE leave_request
     SET status=?, approved_by=?, approved_at=NOW()
     WHERE leave_id=?`,
    [status, approvedBy, leaveId]
  );

  return result;
};

export const updateLeaveStatusByHostel = async (leaveId, status, approvedBy, hostelId) => {
  const [result] = await pool.query(
    `UPDATE leave_request lr
     INNER JOIN student s ON s.student_id = lr.student_id
     SET lr.status = ?, lr.approved_by = ?, lr.approved_at = NOW()
     WHERE lr.leave_id = ? AND s.hostel_id = ?`,
    [status, approvedBy, leaveId, hostelId]
  );

  return result;
};
