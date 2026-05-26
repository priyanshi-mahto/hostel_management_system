import{
    getAllComplaints,
    updateComplaintStatus,
    addComplaintFeedback,
    getComplaintsByHostel,
    updateComplaintStatusByHostel,
} from "../models/complaint.model.js";
import { findStudentByUserId, getStudentComplaints } from "../models/student.model.js";
import { getHostelAdminByUserId } from "../models/hostelAdmin.model.js";

export const fetchAllComplaints = async(req,res)=>{
    try{
        let complaints;

        if (req.user.role === "HOSTEL_ADMIN") {
            const admin = await getHostelAdminByUserId(req.user.user_id);
            if (!admin) {
                return res.status(403).json({ message: "Hostel admin is not mapped to any hostel" });
            }

            complaints = await getComplaintsByHostel(admin.hostel_id);
        } else {
            complaints = await getAllComplaints();
        }

        res.json(complaints);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const changeComplaintStatus = async (req,res)=>{
    try{
        const { status } = req.body;

        if (!["Pending", "Resolved"].includes(status)) {
            return res.status(400).json({ message: "Invalid complaint status" });
        }

        let result;

        if (req.user.role === "HOSTEL_ADMIN") {
            const admin = await getHostelAdminByUserId(req.user.user_id);
            if (!admin) {
                return res.status(403).json({ message: "Hostel admin is not mapped to any hostel" });
            }

            result = await updateComplaintStatusByHostel(req.params.id, status, admin.hostel_id);
        } else {
            result = await updateComplaintStatus(req.params.id, status);
        }

        if (!result?.affectedRows) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.json({message:"Complaint status updated"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const submitFeedback = async(req,res)=>{
    try{
        const student = await findStudentByUserId(req.user.user_id);

        if (!student) {
           return res.status(404).json({ message: "Student not found" });
        }

        await addComplaintFeedback({
            complaintId:req.params.id,
            studentId:student.student_id,
            rating: req.body.rating,
            feedback_text:req.body.feedback_text,
        });
        res.status(201).json({message:"Feedback submitted"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const fetchStudentComplaints = async (req, res) => {
    try {
        const student = await findStudentByUserId(req.user.user_id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const complaints = await getStudentComplaints(student.student_id);
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};