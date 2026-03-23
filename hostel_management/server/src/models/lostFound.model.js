import db from "../config/db.js";

export const getAllItems = async () => {
  const [rows] = await db.query(
    "SELECT * FROM lost_and_found ORDER BY date DESC"
  );
  return rows;
};

export const getStats = async () => {
  const [rows] = await db.query(
    `
      SELECT 
        COUNT(*) as total,
        SUM(status='Active') as active,
        SUM(status='Claimed') as claimed,
        MAX(date) as latest
      FROM lost_and_found
    `
  );
  return rows[0];
};

export const createItem = async (data) => {
  const [result] = await db.query(
    `
      INSERT INTO lost_and_found (item_name, type, status, hostel_id)
      VALUES (?, ?, ?, ?)
    `,
    [data.item_name, data.type, data.status || "Active", data.hostel_id]
  );
  return result;
};

export const updateItemStatus = async (itemId, status) => {
  const [result] = await db.query(
    "UPDATE lost_and_found SET status=? WHERE item_id=?",
    [status, itemId]
  );
  return result;
};