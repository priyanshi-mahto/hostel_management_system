import {findStudentByUserId, updateStudentProfile, getStudentComplaints} from "../models/student.model.js";
import {createComplaint} from "../models/complaint.model.js";
import {applyLeave} from "..model/leave.model.js";

export const getProfile = async (req,res)=>{
    try{
        const student =await findStudentByUserId(req.user.user_id);
        res.json(student);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const updateProfile =async (req,res)=>{
    try{
        await updateStudentProfile(req.user.user_id,req.body);
        req.json({message:"Profile updated successfully"});
    }catch(err){
        res.status(500).jon({error:err.message});
    }
};
