import pool from "../config/db.js";

export const getAdminDashboardStatsByHostel = async (hostelId) => {
  const [[row]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM student s WHERE s.hostel_id = ?) AS total_students,
       (SELECT COUNT(*) FROM room r WHERE r.hostel_id = ?) AS total_rooms,
       (
         SELECT COUNT(*)
         FROM room r
         WHERE r.hostel_id = ?
           AND EXISTS (
             SELECT 1
             FROM room_allocation ra
             WHERE ra.room_id = r.room_id
               AND ra.to_date IS NULL
           )
       ) AS occupied_rooms,
       (
         SELECT COUNT(*)
         FROM complaint c
         INNER JOIN student s ON s.student_id = c.student_id
         WHERE s.hostel_id = ?
           AND c.status = 'Pending'
       ) AS pending_complaints,
       (
         SELECT COUNT(*)
         FROM leave_request lr
         INNER JOIN student s ON s.student_id = lr.student_id
         WHERE s.hostel_id = ?
           AND lr.status = 'PENDING'
       ) AS pending_leaves`,
    [hostelId, hostelId, hostelId, hostelId, hostelId]
  );

  return row;
};

export const getHostelOccupancyById = async (hostelId) => {
  const [[row]] = await pool.query(
    `SELECT
       h.hostel_id,
       h.hostel_name,
       h.type,
       COUNT(r.room_id) AS total_rooms,
       COUNT(DISTINCT CASE WHEN ra.allocation_id IS NOT NULL THEN r.room_id END) AS occupied_rooms
     FROM hostel h
     LEFT JOIN room r ON r.hostel_id = h.hostel_id
     LEFT JOIN room_allocation ra ON ra.room_id = r.room_id AND ra.to_date IS NULL
     WHERE h.hostel_id = ?
     GROUP BY h.hostel_id, h.hostel_name, h.type`,
    [hostelId]
  );

  return row || null;
};

export const getRecentComplaintsByHostel = async (hostelId, limit = 4) => {
  const [rows] = await pool.query(
    `SELECT
       c.complaint_id AS id,
       s.name AS student,
       c.category AS type,
       COALESCE(r.room_no, 'N/A') AS room,
       c.status,
       c.date
     FROM complaint c
     INNER JOIN student s ON s.student_id = c.student_id
     LEFT JOIN room_allocation ra ON ra.student_id = s.student_id AND ra.to_date IS NULL
     LEFT JOIN room r ON r.room_id = ra.room_id
     WHERE s.hostel_id = ?
     ORDER BY c.date DESC, c.complaint_id DESC
     LIMIT ?`,
    [hostelId, Number(limit)]
  );

  return rows;
};

export const getRecentLeavesByHostel = async (hostelId, limit = 5) => {
  const [rows] = await pool.query(
    `SELECT
       lr.leave_id AS id,
       s.name AS student,
       lr.from_date,
       lr.to_date,
       lr.status
     FROM leave_request lr
     INNER JOIN student s ON s.student_id = lr.student_id
     WHERE s.hostel_id = ?
     ORDER BY (lr.status = 'PENDING') DESC, lr.applied_at DESC, lr.leave_id DESC
     LIMIT ?`,
    [hostelId, Number(limit)]
  );

  return rows;
};