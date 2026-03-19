import pool from "../config/db.js";

export const createComplaint = async (data) => {
    const {category ,title , description , studentId } = data;

    await pool.query(
    `INSERT INTO complaint (category, title, description, student_id, date)
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

export const getStudentComplaints = async (studentId) => {
  const [rows] = await pool.query(`
    SELECT 
      c.complaint_id AS id,
      c.title,
      c.description,
      c.status,
      c.category,
      s.block,
      s.room_number AS room,
      u.name AS user_name,
      DATEDIFF(NOW(), c.date) AS days_ago
    FROM complaint c
    JOIN student s ON c.student_id = s.student_id
    JOIN users u ON s.user_id = u.user_id
    WHERE c.student_id = ?
    ORDER BY c.date DESC
  `, [studentId]);

  return rows;
};