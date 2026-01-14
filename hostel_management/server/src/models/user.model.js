import pool from "../config/db.js";

export const createUser = async (email,role)=>{
    const [result] = await pool.query(
        "INSERT INTO user (email,role) VALUES(?,?)",
        [email,role]
    );
    return result.insertId;
};

export const findUserByEmail = async(email) => {
    const[rows] = await pool.query(
        "SELECT * FROM user WHERE email = ?",
        [email]
    );
    return rows[0];
};

export const findUserById = async(userId)=>{
    const[rows] = await pool.query(
    "SELECT * FROM user WHERE  user_id = ?",
    [userId]
    );
};

export const getAllUsers = async () => {
    const[rows] = await pool.query("SELECT * FROM user");
    return rows;
};