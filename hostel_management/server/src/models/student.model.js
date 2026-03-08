import pool from "../config/db.js";

export const findStudentByUserId = async(userId)=>{
  const[rows]=await pool.query(
    "SELECT * FROM student WHERE user_id = ?", [userId]
  );
  return rows[0];
}
export const getStudentProfileByUserId = async (userId) => {
  try {
    console.log("[MODEL] getStudentProfileByUserId called with userId:", userId);
    
    const [rows] = await pool.query(
      `
      SELECT
        s.student_id,
        s.name,
        s.DOB,
        s.gender,
        s.phone,
        s.roll_no,
        s.profile_image,
        s.blood_group,

        u.email,

        g.name AS guardian_name,
        g.phone AS guardian_phone,
        g.email AS guardian_email,

        h.hostel_name,
        r.unit,
        r.room_no

      FROM student s
      JOIN users u ON u.user_id = s.user_id
      LEFT JOIN guardian g ON g.student_id = s.student_id
      LEFT JOIN room_allocation ra ON ra.student_id = s.student_id AND ra.to_date IS NULL
      LEFT JOIN room r ON r.room_id = ra.room_id
      LEFT JOIN hostel h ON h.hostel_id = r.hostel_id
      WHERE s.user_id = ?
      `,
      [userId]
    );

    console.log("[MODEL] Query result:", rows);
    return rows[0];
  } catch (err) {
    console.error("[MODEL] Error in getStudentProfileByUserId:", err.message);
    throw err;
  }
};



export const updateStudentProfile = async (userId, data) => {
  const { profile, guardian } = data;

  // Update student profile
  if (profile) {
    const { gender, DOB, blood_group, phone } = profile;
    
    await pool.query(
      "UPDATE student SET gender=?, DOB=?, blood_group=?, phone=? WHERE user_id=?",
      [gender || null, DOB || null, blood_group || null, phone || null, userId]
    );
  }

  // Update guardian information
  if (guardian && guardian.name) {
    const { name, phone: guardianPhone, email } = guardian;
    
    // Get student_id first
    const [studentRows] = await pool.query(
      "SELECT student_id FROM student WHERE user_id=?",
      [userId]
    );
    
    if (studentRows.length > 0) {
      const studentId = studentRows[0].student_id;
      
      // Check if guardian already exists
      const [guardianRows] = await pool.query(
        "SELECT guardian_id FROM guardian WHERE student_id=?",
        [studentId]
      );
      
      if (guardianRows.length > 0) {
        // Update existing guardian
        await pool.query(
          "UPDATE guardian SET name=?, phone=?, email=? WHERE student_id=?",
          [name, guardianPhone || null, email || null, studentId]
        );
      } else {
        // Create new guardian
        await pool.query(
          "INSERT INTO guardian (name, phone, email, student_id) VALUES (?, ?, ?, ?)",
          [name, guardianPhone || null, email || null, studentId]
        );
      }
    }
  }
};

export const getStudentComplaints = async (studentId) => {
  const [rows] = await pool.query(
    "SELECT * FROM complaint WHERE student_id = ?",
    [studentId]
  );
  return rows;
};

export const getRoomAllocation = async (studentId) => {
  const [[result]] = await pool.query(
    `SELECT r.room_id, r.room_no, r.hostel_id
     FROM room r
     JOIN room_allocation ra ON r.room_id = ra.room_id
     WHERE ra.student_id = ? AND (ra.to_date IS NULL OR ra.to_date >= CURDATE())
     ORDER BY ra.from_date DESC LIMIT 1`,
    [studentId]
  );
  return result || null;
};

export const getHostelInfo = async (hostelId) => {
  const [[result]] = await pool.query(
    `SELECT capacity, number_of_rooms FROM hostel WHERE hostel_id = ?`,
    [hostelId]
  );
  return result || null;
};

export const getRoommatesByRoom = async (roomId, studentId) => {
  const [rows] = await pool.query(
    `SELECT s.name FROM room_allocation ra JOIN student s ON ra.student_id = s.student_id
     WHERE ra.room_id = ? AND (ra.to_date IS NULL OR ra.to_date >= CURDATE()) AND s.student_id != ?`,
    [roomId, studentId]
  );
  return rows.map((r) => r.name);
};

export const getOccupiedCount = async (roomId) => {
  const [[result]] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM room_allocation WHERE room_id = ? AND (to_date IS NULL OR to_date >= CURDATE())`,
    [roomId]
  );
  return result?.cnt || 0;
};

export const getLostItemsCount = async (hostelId) => {
  const [[result]] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM lost_and_found WHERE hostel_id = ? AND type = 'Lost' AND status = 'Active'`,
    [hostelId]
  );
  return result?.cnt || 0;
};

export const getClaimedItemsCount = async (hostelId) => {
  const [[result]] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM lost_and_found WHERE hostel_id = ? AND status = 'Claimed'`,
    [hostelId]
  );
  return result?.cnt || 0;
};

export const getGlobalLostItemsCount = async () => {
  const [[result]] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM lost_and_found WHERE type = 'Lost' AND status = 'Active'`
  );
  return result?.cnt || 0;
};

export const getGlobalClaimedItemsCount = async () => {
  const [[result]] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM lost_and_found WHERE status = 'Claimed'`
  );
  return result?.cnt || 0;
};

export const getPendingComplaintsCount = async (studentId) => {
  const [[result]] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM complaint WHERE student_id = ? AND status = 'Pending'`,
    [studentId]
  );
  return result?.cnt || 0;
};