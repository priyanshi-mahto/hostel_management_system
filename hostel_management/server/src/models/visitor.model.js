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