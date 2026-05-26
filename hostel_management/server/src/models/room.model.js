import pool from "../config/db.js";

export const createRoom = async (data) => {
  const { unit, floor, room_no, capacity, hostel_id } = data;

  await pool.query(
    "INSERT INTO room (unit, floor, room_no, capacity, hostel_id) VALUES (?, ?, ?, ?, ?)",
    [unit, floor, room_no, capacity || 1, hostel_id]
  );
};

export const getRoomsByHostel = async (hostelId) => {
  const [rows] = await pool.query(
    "SELECT * FROM room WHERE hostel_id = ?",
    [hostelId]
  );
  return rows;
};

export const getRoomsWithOccupancyByHostel = async (hostelId) => {
  const [rows] = await pool.query(
    `SELECT
      r.room_id,
      r.room_no,
      r.floor,
      r.unit,
      r.capacity,
      h.hostel_name,
      h.type,
      COUNT(ra.allocation_id) AS occupied,
      GROUP_CONCAT(s.name SEPARATOR '||') AS students
     FROM room r
     INNER JOIN hostel h ON h.hostel_id = r.hostel_id
     LEFT JOIN room_allocation ra ON ra.room_id = r.room_id AND ra.to_date IS NULL
     LEFT JOIN student s ON s.student_id = ra.student_id
     WHERE r.hostel_id = ?
     GROUP BY r.room_id, r.room_no, r.floor, r.unit, r.capacity, h.hostel_name, h.type
     ORDER BY r.floor ASC, r.unit ASC, r.room_no ASC`,
    [hostelId]
  );
  return rows;
};

export const getRoomAllocationsByHostel = async (hostelId) => {
  const [rows] = await pool.query(
    `SELECT
      ra.allocation_id,
      s.student_id,
      s.name AS student_name,
      s.roll_no,
      r.room_id,
      r.room_no,
      h.hostel_name,
      h.type,
      ra.from_date,
      ra.to_date
     FROM room_allocation ra
     INNER JOIN student s ON s.student_id = ra.student_id
     INNER JOIN room r ON r.room_id = ra.room_id
     INNER JOIN hostel h ON h.hostel_id = r.hostel_id
     WHERE r.hostel_id = ?
     ORDER BY (ra.to_date IS NULL) DESC, ra.from_date DESC`,
    [hostelId]
  );
  return rows;
};

export const getAvailableStudentsByHostel = async (hostelId) => {
  const [rows] = await pool.query(
    `SELECT s.student_id, s.name, s.roll_no
     FROM student s
     WHERE (
       s.hostel_id = ?
       OR EXISTS (
         SELECT 1
         FROM room_allocation hra
         INNER JOIN room hr ON hr.room_id = hra.room_id
         WHERE hra.student_id = s.student_id
           AND hra.to_date IS NULL
           AND hr.hostel_id = ?
       )
     )
       AND NOT EXISTS (
       SELECT 1
       FROM room_allocation ra2
       WHERE ra2.student_id = s.student_id
         AND ra2.to_date IS NULL
     )
     ORDER BY s.name ASC`,
    [hostelId, hostelId]
  );
  return rows;
};

export const getActiveAllocationByStudentAndHostel = async (studentId, hostelId) => {
  const [rows] = await pool.query(
    `SELECT ra.allocation_id
     FROM room_allocation ra
     INNER JOIN room r ON r.room_id = ra.room_id
     WHERE ra.student_id = ? AND ra.to_date IS NULL AND r.hostel_id = ?
     LIMIT 1`,
    [studentId, hostelId]
  );
  return rows[0] || null;
};

export const getRoomOccupancy = async (roomId, hostelId) => {
  const [rows] = await pool.query(
    `SELECT r.room_id, r.capacity, COUNT(ra.allocation_id) AS occupied
     FROM room r
     LEFT JOIN room_allocation ra ON ra.room_id = r.room_id AND ra.to_date IS NULL
     WHERE r.room_id = ? AND r.hostel_id = ?
     GROUP BY r.room_id, r.capacity`,
    [roomId, hostelId]
  );
  return rows[0] || null;
};

export const allocateRoom = async (studentId, roomId, fromDate) => {
  const [result] = await pool.query(
    `INSERT INTO room_allocation (student_id, room_id, from_date)
     VALUES (?, ?, ?)`,
    [studentId, roomId, fromDate]
  );
  return result;
};

export const deallocateRoom = async (allocationId, hostelId, toDate) => {
  const [result] = await pool.query(
    `UPDATE room_allocation ra
     INNER JOIN room r ON r.room_id = ra.room_id
     SET ra.to_date = ?
     WHERE ra.allocation_id = ? AND r.hostel_id = ? AND ra.to_date IS NULL`,
    [toDate, allocationId, hostelId]
  );
  return result;
};
