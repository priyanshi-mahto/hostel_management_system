import pool from "../config/db.js";

export const createComplaint = async (data) => {
    const {category ,title , description , studentId } = data;

    await pool.query(
    `INSERT INTO complaint (category, title, descriptiom, student_id, date)
     VALUES (?, ?, ?, ?, NOW())`,
    [category, title, description, studentId]
    );
};

export const getAllComplaints = async () => {
  const [rows] = await pool.query("SELECT * FROM complaint");
  return rows;
};

export const updateComplaintStatus = async (complaintId, status) => {
  await pool.query(
    "UPDATE complaint SET status=? WHERE complaint_id=?",
    [status, complaintId]
  );
};

export const addComplaintFeedback = async (data) => {
  const { complaintId, studentId, rating, feedback_text } = data;

  await pool.query(
    `INSERT INTO complaint_feedback
     (complaint_id, student_id, rating, feedback_text)
     VALUES (?, ?, ?, ?)`,
    [complaintId, studentId, rating, feedback_text]
  );
};