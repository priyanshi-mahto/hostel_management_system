import {
  createProfileModel,
  getProfilesModel,
  createRequestModel,
  mapVisitorsModel,
  getRequestsModel
} from "../models/visitor.model.js";
import { findStudentByUserId } from "../models/student.model.js";

/* ------------------ ADD PROFILE ------------------ */
export const createVisitorProfile = async (req, res) => {
  try {
    const student = await findStudentByUserId(req.user.user_id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const { name, relation, phone, email } = req.body;
    if (!name || !relation || !phone) {
      return res.status(400).json({ error: "Name, relation and phone are required" });
    }

    const visitor_id = await createProfileModel({
      name,
      relation,
      student_id: student.student_id,
      phone,
      email,
    });

    res.json({
      message: "Profile created",
      visitor_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------ GET PROFILES ------------------ */
export const getVisitorProfiles = async (req, res) => {
  try {
    const student = await findStudentByUserId(req.user.user_id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const profiles = await getProfilesModel(student.student_id);

    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------ CREATE REQUEST ------------------ */
export const createVisitingRequest = async (req, res) => {
  try {
    const student = await findStudentByUserId(req.user.user_id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const { visitor_ids = [], from_date, to_date, reason } = req.body;
    if (!from_date || !to_date || !reason || visitor_ids.length === 0) {
      return res.status(400).json({ error: "Visitors, from date, to date and reason are required" });
    }

    const request_id = await createRequestModel({
      student_id: student.student_id,
      from_date,
      to_date,
      reason,
    });

    await mapVisitorsModel(request_id, visitor_ids);

    res.json({
      message: "Request created",
      request_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------ GET REQUESTS ------------------ */
export const getRequests = async (req, res) => {
  try {
    const student = await findStudentByUserId(req.user.user_id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const requests = await getRequestsModel(student.student_id);

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};