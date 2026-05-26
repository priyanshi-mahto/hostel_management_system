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

export const getComplaintsByHostel = async (hostelId) => {
  const [rows] = await pool.query(
    `SELECT
      c.complaint_id AS id,
      c.title,
      c.description,
      c.status,
      c.category,
      c.date,
      s.student_id,
      s.name AS student_name,
      COALESCE(r.room_no, 'N/A') AS room,
      u.email,
      cf.rating,
      cf.satisfaction,
      cf.feedback_text,
      TIMESTAMPDIFF(DAY, c.date, NOW()) AS days_ago
    FROM complaint c
    INNER JOIN student s ON s.student_id = c.student_id
    INNER JOIN users u ON u.user_id = s.user_id
    LEFT JOIN room_allocation ra
      ON ra.student_id = s.student_id
      AND ra.to_date IS NULL
    LEFT JOIN room r ON r.room_id = ra.room_id
    LEFT JOIN complaint_feedback cf ON cf.complaint_id = c.complaint_id
    WHERE s.hostel_id = ?
       OR r.hostel_id = ?
    ORDER BY c.date DESC, c.complaint_id DESC`,
    [hostelId, hostelId]
  );

  return rows;
};

export const updateComplaintStatus = async (complaintId, status) => {
  const [result] = await pool.query(
    "UPDATE complaint SET status=? WHERE complaint_id=?",
    [status, complaintId]
  );

  return result;
};

export const updateComplaintStatusByHostel = async (complaintId, status, hostelId) => {
  const [result] = await pool.query(
    `UPDATE complaint c
     INNER JOIN student s ON s.student_id = c.student_id
     LEFT JOIN room_allocation ra
       ON ra.student_id = s.student_id
       AND ra.to_date IS NULL
     LEFT JOIN room r ON r.room_id = ra.room_id
     SET c.status = ?
     WHERE c.complaint_id = ?
       AND (s.hostel_id = ? OR r.hostel_id = ?)`,
    [status, complaintId, hostelId, hostelId]
  );

  return result;
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