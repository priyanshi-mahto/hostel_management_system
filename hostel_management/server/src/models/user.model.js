import pool from "../config/db.js";

export const createUser = async (email, password, role)=>{
    const [result] = await pool.query(
        "INSERT INTO users (email, password, role) VALUES(?,?,?)",
        [email, password, role]
    );
    return result.insertId;
};

export const findUserByEmail = async(email) => {
    const[rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
};

export const findUserById = async(userId)=>{
    const[rows] = await pool.query(
    "SELECT * FROM users WHERE user_id = ?",
    [userId]
    );
    return rows[0];
};

export const getAllUsers = async () => {
    const[rows] = await pool.query("SELECT * FROM users");
    return rows;
};

export const getUsersByHostelId = async (hostelId) => {
    const [rows] = await pool.query(
        `SELECT DISTINCT u.*
         FROM users u
         LEFT JOIN student s ON s.user_id = u.user_id
         LEFT JOIN room_allocation ra ON ra.student_id = s.student_id AND ra.to_date IS NULL
         LEFT JOIN room r ON r.room_id = ra.room_id
         LEFT JOIN warden w ON w.user_id = u.user_id
         LEFT JOIN office_staff os ON os.user_id = u.user_id
         LEFT JOIN hostel_admin ha ON ha.user_id = u.user_id
         WHERE s.hostel_id = ?
            OR r.hostel_id = ?
            OR w.hostel_id = ?
            OR os.hostel_id = ?
            OR ha.hostel_id = ?`,
        [hostelId, hostelId, hostelId, hostelId, hostelId]
    );
    return rows;
};

export const getUnassignedUsersByRole = async (role) => {
    if (role === "WARDEN") {
        const [rows] = await pool.query(
            `SELECT u.user_id, u.email, u.role
             FROM users u
             LEFT JOIN warden w ON w.user_id = u.user_id
             WHERE u.role = 'WARDEN' AND w.user_id IS NULL
             ORDER BY u.email ASC`
        );
        return rows;
    }

    if (role === "STAFF") {
        const [rows] = await pool.query(
            `SELECT u.user_id, u.email, u.role
             FROM users u
             LEFT JOIN office_staff os ON os.user_id = u.user_id
             WHERE u.role = 'STAFF' AND os.user_id IS NULL
             ORDER BY u.email ASC`
        );
        return rows;
    }

    return [];
};

export const updateUserPassword = async (user_id, password) => {
  const query = `
    UPDATE users
    SET password = ?
    WHERE user_id = ?
  `;
    const [result] = await pool.query(query, [password, user_id]);
    return result;
};