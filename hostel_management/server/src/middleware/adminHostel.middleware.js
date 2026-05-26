import { getHostelAdminByUserId } from "../models/hostelAdmin.model.js";

export const requireAdminHostelContext = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const admin = await getHostelAdminByUserId(userId);
    if (!admin) {
      return res.status(403).json({
        message: "Hostel admin is not mapped to any hostel. Please assign hostel first.",
      });
    }

    req.adminHostelId = admin.hostel_id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
