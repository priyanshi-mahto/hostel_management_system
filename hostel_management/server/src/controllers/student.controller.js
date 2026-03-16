import pool from "../config/db.js";
import {
  findStudentByUserId,
  updateStudentProfile,
  getStudentComplaints,
  getRoomAllocation,
  getHostelInfo,
  getRoommatesByRoom,
  getOccupiedCount,
  getLostItemsCount,
  getClaimedItemsCount,
  getGlobalLostItemsCount,
  getGlobalClaimedItemsCount,
  getPendingComplaintsCount,
  getStudentProfileByUserId,
} from "../models/student.model.js";
import {createComplaint} from "../models/complaint.model.js";
import {applyLeave, getLeavesByStudent} from "../models/leave.model.js";

export const getProfile = async (req,res)=>{
    try{
        const student =await getStudentProfileByUserId(req.user.user_id);
         
        if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

        res.json(student);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};


export const updateProfile =async (req,res)=>{
    try{
        await updateStudentProfile(req.user.user_id,req.body);
        res.json({message:"Profile updated successfully"});
    }catch(err){
        res.status(err.statusCode || 500).json({error:err.message});
    }
};

export const raiseComplaint = async (req, res) => {
    try {
        const student = await findStudentByUserId(req.user.user_id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        await createComplaint({
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            studentId: student.student_id,
        });
        res.status(201).json({ message: "Complaint submitted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getComplaints = async (req, res) => {
    try {
        const student = await findStudentByUserId(req.user.user_id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const complaints = await getStudentComplaints(student.student_id);
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const applyLeaveController = async (req, res) => {
    try {
        const student = await findStudentByUserId(req.user.user_id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        await applyLeave({
            studentId: student.student_id,
            from_date: req.body.from_date,
            to_date: req.body.to_date,
            reason: req.body.reason,
        });
        res.status(201).json({ message: "Leave applied" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getLeaves = async (req, res) => {
    try {
        const student = await findStudentByUserId(req.user.user_id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const leaves = await getLeavesByStudent(student.student_id);
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createVisitingRequest = async (req, res) => {
    try {
        const student = await findStudentByUserId(req.user.user_id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const { visitor_name, visitor_phone, visit_date, purpose } = req.body;
        
        if (!visitor_name || !visitor_phone || !visit_date || !purpose) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await pool.query(
            `INSERT INTO visiting_request (student_id, visitor_name, visitor_phone, visit_date, purpose, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [student.student_id, visitor_name, visitor_phone, visit_date, purpose]
        );
        res.status(201).json({ message: "Visiting request created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getDashboard = async (req, res) => {
  try {
    const student = await findStudentByUserId(req.user.user_id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const complaints = await getStudentComplaints(student.student_id);
    const allocation = await getRoomAllocation(student.student_id);

    let room = { room_no: "N/A", occupied: 0, capacity: 0, roommates: [] };
    let lost = 0;
    let claimed = 0;

    if (allocation && allocation.room_id) {
      room.room_no = allocation.room_no;

      const hostelInfo = await getHostelInfo(allocation.hostel_id);
      const roommates = await getRoommatesByRoom(allocation.room_id, student.student_id);
      const occupied = await getOccupiedCount(allocation.room_id);

      room.roommates = roommates;
      room.occupied = occupied;
      if (hostelInfo && hostelInfo.capacity && hostelInfo.number_of_rooms) {
        room.capacity = Math.max(1, Math.floor(hostelInfo.capacity / hostelInfo.number_of_rooms));
      }

      lost = await getLostItemsCount(allocation.hostel_id);
      claimed = await getClaimedItemsCount(allocation.hostel_id);
    } else {
      // no allocation: use global counts
      lost = await getGlobalLostItemsCount();
      claimed = await getGlobalClaimedItemsCount();
    }

    const pending = await getPendingComplaintsCount(student.student_id);

    const stats = {
      lost,
      claimed,
      complaints: complaints.length,
      pending,
      resolved: complaints.length - pending,
    };

    res.json({ student, room, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
