import {
  createProfileModel,
  getProfilesModel,
  createRequestModel,
  mapVisitorsModel,
  getRequestsModel
} from "../models/visitor.model.js";

/* ------------------ ADD PROFILE ------------------ */
export const createVisitorProfile = async (req, res) => {
  try {
    const visitor_id = await createProfileModel(req.body);

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
    const { student_id } = req.params;

    const profiles = await getProfilesModel(student_id);

    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------ CREATE REQUEST ------------------ */
export const createVisitingRequest = async (req, res) => {
  try {
    const { visitor_ids, ...requestData } = req.body;

    const request_id = await createRequestModel(requestData);

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
    const { student_id } = req.params;

    const requests = await getRequestsModel(student_id);

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};