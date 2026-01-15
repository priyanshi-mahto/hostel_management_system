import{
    getAllComplaints,
    updateComplaintStatus,
    addComplaintFeedback
} from "../models/complaint.model.js";

export const fetchAllComplaints = async(req,res)=>{
    try{
        const complaints = await getAllComplaints();
        res.json(complaints);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const changeComplaintStatus = async (req,res)=>{
    try{
        await updateComplaintStatus(req.params.id,req.body.status);
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
        res.status(500).jsoon({error:err.message});
    }
};