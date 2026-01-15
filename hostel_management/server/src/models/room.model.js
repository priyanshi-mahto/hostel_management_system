import pool from "../config/db.js";

export const createRoom = async (data) => {
  const { unit, room_no, hostel_id } = data;

  await pool.query(
    "INSERT INTO room (unit, room_no, hostel_id) VALUES (?, ?, ?)",
    [unit, room_no, hostel_id]
  );
};

export const getRoomsByHostel = async (hostelId) => {
  const [rows] = await pool.query(
    "SELECT * FROM room WHERE hostel_id = ?",
    [hostelId]
  );
  return rows;
};

export const allocateRoom = async (studentId, roomId, fromDate) => {
  await pool.query(
    `INSERT INTO room_allocation (student_id, room_id, from_date)
     VALUES (?, ?, ?)`,
    [studentId, roomId, fromDate]
  );
};
