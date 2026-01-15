import pool from "../config/db.js";

export const findStudentByUserId = async(userId)=>{
    const[rows]=await pool.query(
        "SELECT * student FROM WHERE user_id= ?", [userId]
    );
    return rows[0];
}


export const updateStudentProfile = async (userId, data) => {
  const { phone, city, state } = data;

  await pool.query(
    "UPDATE student SET phone=?, city=?, state=? WHERE user_id=?",
    [phone, city, state, userId]
  );
};

export const getStudentComplaints = async (studentId) => {
  const [rows] = await pool.query(
    "SELECT * FROM complaint WHERE student_id = ?",
    [studentId]
  );
  return rows;
};