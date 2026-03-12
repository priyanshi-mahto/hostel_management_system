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