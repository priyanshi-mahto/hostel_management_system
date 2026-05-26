import db from "../config/db.js";

/* ------------------ CREATE PROFILE ------------------ */
export const createProfileModel = async ({ name, relation, student_id, phone, email }) => {
  const [result] = await db.execute(
    `INSERT INTO visitor_profile (name, relation, student_id, phone, email)
     VALUES (?, ?, ?, ?, ?)`,
    [name, relation, student_id, phone, email]
  );

  return result.insertId;
};

/* ------------------ GET PROFILES ------------------ */
export const getProfilesModel = async (student_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM visitor_profile WHERE student_id = ?`,
    [student_id]
  );

  return rows;
};

/* ------------------ CREATE REQUEST ------------------ */
export const createRequestModel = async ({ student_id, from_date, to_date, reason }) => {
  const [result] = await db.execute(
    `INSERT INTO visiting_request (student_id, from_date, to_date, reason)
     VALUES (?, ?, ?, ?)`,
    [student_id, from_date, to_date, reason]
  );

  return result.insertId;
};

/* ------------------ MAP VISITORS ------------------ */
export const mapVisitorsModel = async (request_id, visitor_ids) => {
  for (let vid of visitor_ids) {
    await db.execute(
      `INSERT INTO visitor_request (request_id, visitor_id)
       VALUES (?, ?)`,
      [request_id, vid]
    );
  }
};

/* ------------------ GET REQUESTS ------------------ */
export const getRequestsModel = async (student_id) => {
  const [rows] = await db.execute(
    `SELECT vr.request_id, vr.from_date, vr.to_date, vr.status,
            GROUP_CONCAT(vp.name) AS visitors
     FROM visiting_request vr
     JOIN visitor_request vreq ON vr.request_id = vreq.request_id
     JOIN visitor_profile vp ON vp.visitor_id = vreq.visitor_id
     WHERE vr.student_id = ?
     GROUP BY vr.request_id`,
    [student_id]
  );

  return rows;
};

/* ------------------ ADMIN: GET REQUESTS BY HOSTEL ------------------ */
export const getRequestsByHostel = async (hostel_id) => {
  const [rows] = await db.execute(
    `SELECT vr.request_id, vr.from_date, vr.to_date, vr.status, vr.reason, vr.created_at,
            s.student_id, s.name AS student_name, r.room_no,
            GROUP_CONCAT(CONCAT(vp.name, '::', vp.relation, '::', vp.phone) SEPARATOR '||') AS visitors
     FROM visiting_request vr
     JOIN student s ON s.student_id = vr.student_id
     LEFT JOIN room_allocation ra ON ra.student_id = s.student_id AND ra.to_date IS NULL
     LEFT JOIN room r ON r.room_id = ra.room_id
     JOIN visitor_request vreq ON vr.request_id = vreq.request_id
     JOIN visitor_profile vp ON vp.visitor_id = vreq.visitor_id
     WHERE s.hostel_id = ? OR r.hostel_id = ?
     GROUP BY vr.request_id, vr.from_date, vr.to_date, vr.status, vr.reason, vr.created_at, s.student_id, s.name, r.room_no
     ORDER BY vr.created_at DESC`,
    [hostel_id, hostel_id]
  );

  return rows;
};

/* ------------------ ADMIN: UPDATE REQUEST STATUS (ensure belongs to hostel) ------------------ */
export const updateRequestStatusByHostel = async (request_id, status, hostel_id) => {
  const [result] = await db.execute(
    `UPDATE visiting_request vr
     JOIN student s ON s.student_id = vr.student_id
     SET vr.status = ?
     WHERE vr.request_id = ? AND s.hostel_id = ?`,
    [status, request_id, hostel_id]
  );

  return result.affectedRows;
};