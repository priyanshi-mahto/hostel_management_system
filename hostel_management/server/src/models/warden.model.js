import pool from "../config/db.js";

export const getWardenByUserId = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM warden WHERE user_id = ?",
    [userId]
  );
  return rows[0];
};

export const getWardensByHostelId = async (hostelId) => {
  const [rows] = await pool.query(
    `SELECT w.warden_id, w.name, w.user_id, w.hostel_id, u.email, wcd.phone, h.hostel_name, h.type
     FROM warden w
     JOIN users u ON u.user_id = w.user_id
     JOIN hostel h ON h.hostel_id = w.hostel_id
     LEFT JOIN warden_contact_details wcd ON wcd.warden_id = w.warden_id
     WHERE w.hostel_id = ?
     ORDER BY w.name ASC, w.warden_id ASC`,
    [hostelId]
  );

  return rows;
};

export const createWardenForHostel = async ({ userId, hostelId, name, phone }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO warden (name, hostel_id, user_id)
       VALUES (?, ?, ?)`,
      [name, hostelId, userId]
    );

    if (phone) {
      await connection.query(
        `INSERT INTO warden_contact_details (phone, warden_id)
         VALUES (?, ?)`,
        [phone, result.insertId]
      );
    }

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateWardenById = async ({ wardenId, hostelId, name, phone }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [wardenResult] = await connection.query(
      `UPDATE warden
       SET name = ?
       WHERE warden_id = ? AND hostel_id = ?`,
      [name, wardenId, hostelId]
    );

    if (!wardenResult.affectedRows) {
      await connection.rollback();
      return wardenResult;
    }

    const [contactRows] = await connection.query(
      `SELECT contact_id
       FROM warden_contact_details
       WHERE warden_id = ?`,
      [wardenId]
    );

    if (contactRows.length) {
      await connection.query(
        `UPDATE warden_contact_details
         SET phone = ?
         WHERE warden_id = ?`,
        [phone || null, wardenId]
      );
    } else if (phone) {
      await connection.query(
        `INSERT INTO warden_contact_details (phone, warden_id)
         VALUES (?, ?)`,
        [phone, wardenId]
      );
    }

    await connection.commit();
    return wardenResult;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteWardenById = async (wardenId, hostelId) => {
  const [result] = await pool.query(
    `DELETE FROM warden
     WHERE warden_id = ? AND hostel_id = ?`,
    [wardenId, hostelId]
  );

  return result;
};

export const verifyStudentIdCard = async (studentId, verifiedBy) => {
  await pool.query(
    `UPDATE student_id_card
     SET verification_status='VERIFIED', verified_by=?
     WHERE student_id=?`,
    [verifiedBy, studentId]
  );
};
