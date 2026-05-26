import db from "../config/db.js";

export const getNotificationsByHostel = async (hostelId) => {
  const [rows] = await db.query(
    `SELECT 
       n.notification_id,
       n.message,
       n.target_audience,
       n.priority,
       n.hostel_id,
       n.created_at
     FROM notification n
    WHERE n.hostel_id = ? OR n.hostel_id IS NULL
    ORDER BY n.created_at DESC`,
    [hostelId]
  );
  return rows;
};

export const createNotification = async (hostelId, message, targetAudience, priority = 'Normal') => {
  const [result] = await db.query(
    `INSERT INTO notification (message, target_audience, priority, hostel_id, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [message, targetAudience, priority, hostelId]
  );
  return result.insertId;
};

export const deleteNotification = async (notificationId, hostelId) => {
  const [result] = await db.query(
    `DELETE FROM notification 
     WHERE notification_id = ? AND (hostel_id = ? OR hostel_id IS NULL)`,
    [notificationId, hostelId]
  );
  return result.affectedRows;
};

export const getNotificationCount = async (hostelId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) as total FROM notification WHERE hostel_id = ? OR hostel_id IS NULL`,
    [hostelId]
  );
  return rows[0].total;
};
