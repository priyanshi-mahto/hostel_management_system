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
        s.house_no,
        s.street,
        s.area,
        s.city,
        s.state,
        s.pincode,

        u.email,

        g.guardian_id,
        g.name AS guardian_name,
        g.phone AS guardian_phone,
        g.relationship AS guardian_relationship,
        g.house_no AS guardian_house_no,
        g.street AS guardian_street,
        g.area AS guardian_area,
        g.city AS guardian_city,
        g.state AS guardian_state,
        g.pincode AS guardian_pincode,

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
    if (!rows.length) return null;

    const guardiansMap = new Map();
    rows.forEach((row) => {
      if (!row.guardian_id || guardiansMap.has(row.guardian_id)) return;
      guardiansMap.set(row.guardian_id, {
        guardian_id: row.guardian_id,
        name: row.guardian_name || "",
        phone: row.guardian_phone || "",
        relationship: row.guardian_relationship || "",
        house_no: row.guardian_house_no || "",
        street: row.guardian_street || "",
        area: row.guardian_area || "",
        city: row.guardian_city || "",
        state: row.guardian_state || "",
        pincode: row.guardian_pincode || "",
      });
    });
    const guardians = Array.from(guardiansMap.values());

    const firstGuardian = guardians[0] || null;
    return {
      ...rows[0],
      guardian_name: firstGuardian?.name || "",
      guardian_phone: firstGuardian?.phone || "",
      guardian_relationship: firstGuardian?.relationship || "",
      guardian_house_no: firstGuardian?.house_no || "",
      guardian_street: firstGuardian?.street || "",
      guardian_area: firstGuardian?.area || "",
      guardian_city: firstGuardian?.city || "",
      guardian_state: firstGuardian?.state || "",
      guardian_pincode: firstGuardian?.pincode || "",
      guardians,
    };
  } catch (err) {
    console.error("[MODEL] Error in getStudentProfileByUserId:", err.message);
    throw err;
  }
};



export const updateStudentProfile = async (userId, data) => {
  const { profile, guardians, guardian } = data;

  const [studentRows] = await pool.query(
    "SELECT student_id FROM student WHERE user_id=?",
    [userId]
  );

  if (!studentRows.length) return;
  const studentId = studentRows[0].student_id;

  // Update student profile
  if (profile) {
    const { name, gender, DOB, blood_group, phone, address } = profile;
    
    await pool.query(
      "UPDATE student SET name=?, gender=?, DOB=?, blood_group=?, phone=? WHERE user_id=?",
      [name || null, gender || null, DOB || null, blood_group || null, phone || null, userId]
    );

    // Update address if provided
    if (address) {
      const parts = address.split(',').map(p => p.trim());
      const house_no = parts[0] || null;
      const street = parts[1] || null;
      const area = parts[2] || null;
      const city = parts[3] || null;
      const state = parts[4] || null;
      const pincode = parts[5] || null;

      await pool.query(
        "UPDATE student SET house_no=?, street=?, area=?, city=?, state=?, pincode=? WHERE user_id=?",
        [house_no, street, area, city, state, pincode, userId]
      );
    }
  }

  // Update guardian information (supports multiple guardians)
  const hasGuardianPayload = Array.isArray(guardians) || guardian !== undefined;
  if (hasGuardianPayload) {
    const guardianList = Array.isArray(guardians)
      ? guardians
      : guardian
      ? [guardian]
      : [];

    const fatherCount = guardianList.filter(
      (g) => g?.relationship?.trim() === "Father"
    ).length;
    const motherCount = guardianList.filter(
      (g) => g?.relationship?.trim() === "Mother"
    ).length;

    if (fatherCount > 1) {
      const error = new Error("Only one guardian can have the relationship Father.");
      error.statusCode = 400;
      throw error;
    }

    if (motherCount > 1) {
      const error = new Error("Only one guardian can have the relationship Mother.");
      error.statusCode = 400;
      throw error;
    }

    await pool.query("DELETE FROM guardian WHERE student_id=?", [studentId]);

    for (const g of guardianList) {
      const name = g?.name?.trim();
      const phone = g?.phone?.trim() || null;
      const relationship = g?.relationship?.trim() || null;
      const address = g?.address || "";

      if (!name && !phone && !relationship && !address) continue;

      const parts = address.split(",").map((p) => p.trim());
      const house_no = parts[0] || g?.house_no || null;
      const street = parts[1] || g?.street || null;
      const area = parts[2] || g?.area || null;
      const city = parts[3] || g?.city || null;
      const state = parts[4] || g?.state || null;
      const pincode = parts[5] || g?.pincode || null;

      await pool.query(
        "INSERT INTO guardian (name, phone, relationship, house_no, street, area, city, state, pincode, student_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name || null, phone, relationship, house_no, street, area, city, state, pincode, studentId]
      );
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