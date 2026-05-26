import pool from "../config/db.js";

export const getAllStudentIdCards = async () => {
  const [rows] = await pool.query(
    `SELECT
      sic.id_card_id,
      sic.student_id,
      s.name AS student_name,
      s.roll_no,
      r.room_no,
      sic.id_front_image,
      sic.id_back_image,
      sic.verification_status,
      sic.rejection_reason,
      verifier.email AS verified_by_email
    FROM student_id_card sic
    INNER JOIN student s ON s.student_id = sic.student_id
    LEFT JOIN room_allocation ra
      ON ra.student_id = s.student_id
      AND ra.to_date IS NULL
    LEFT JOIN room r ON r.room_id = ra.room_id
    LEFT JOIN users verifier ON verifier.user_id = sic.verified_by
    ORDER BY
      CASE sic.verification_status
        WHEN 'PENDING' THEN 1
        WHEN 'REJECTED' THEN 2
        WHEN 'VERIFIED' THEN 3
        ELSE 4
      END,
      sic.id_card_id DESC`
  );

  return rows;
};

export const getStudentIdCardsByHostel = async (hostelId) => {
  const [rows] = await pool.query(
    `SELECT
      sic.id_card_id,
      sic.student_id,
      s.name AS student_name,
      s.roll_no,
      r.room_no,
      sic.id_front_image,
      sic.id_back_image,
      sic.verification_status,
      sic.rejection_reason,
      verifier.email AS verified_by_email
    FROM student_id_card sic
    INNER JOIN student s ON s.student_id = sic.student_id
    LEFT JOIN room_allocation ra
      ON ra.student_id = s.student_id
      AND ra.to_date IS NULL
    LEFT JOIN room r ON r.room_id = ra.room_id
    LEFT JOIN users verifier ON verifier.user_id = sic.verified_by
    WHERE COALESCE(s.hostel_id, r.hostel_id) = ?
    ORDER BY
      CASE sic.verification_status
        WHEN 'PENDING' THEN 1
        WHEN 'REJECTED' THEN 2
        WHEN 'VERIFIED' THEN 3
        ELSE 4
      END,
      sic.id_card_id DESC`,
    [hostelId]
  );

  return rows;
};

export const updateStudentIdCardStatus = async (studentId, status, verifiedBy, rejectionReason = null) => {
  const [result] = await pool.query(
    `UPDATE student_id_card
     SET verification_status = ?, verified_by = ?, rejection_reason = ?
     WHERE student_id = ?`,
    [status, verifiedBy, rejectionReason, studentId]
  );

  return result;
};

export const updateStudentIdCardStatusByHostel = async (
  studentId,
  status,
  verifiedBy,
  hostelId,
  rejectionReason = null
) => {
  const [result] = await pool.query(
    `UPDATE student_id_card sic
     INNER JOIN student s ON s.student_id = sic.student_id
     LEFT JOIN room_allocation ra ON ra.student_id = s.student_id AND ra.to_date IS NULL
     LEFT JOIN room r ON r.room_id = ra.room_id
     SET sic.verification_status = ?, sic.verified_by = ?, sic.rejection_reason = ?
     WHERE sic.student_id = ? AND COALESCE(s.hostel_id, r.hostel_id) = ?`,
    [status, verifiedBy, rejectionReason, studentId, hostelId]
  );

  return result;
};
