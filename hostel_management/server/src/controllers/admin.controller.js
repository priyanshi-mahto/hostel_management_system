import { createRoom as createRoomModel } from "../models/room.model.js";
import { getAllUsers } from "../models/user.model.js";
import pool from "../config/db.js";

export const createHostel = async (req,res)=>{
    try{
        const{ hostel_name , type , number_of_rooms , capacity } = req.body;

        await pool.query(
            `INSERT INTO hostel (hostel_name,type,number_of_rooms,capacity) VALUES (?,?,?,?) `,
            [hostel_name,type,number_of_rooms,capacity]
        );
        res.status(201).json({message:"Hostel created"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

export const createRoom = async(req,res) => {
    try{
        await createRoomModel(req.body);
        res.status(201).json({message:"Room created"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const getUsers = async(req,res)=>{
    try{
        const users = await getAllUsers();
        res.json(users);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const assignWarden = async (req, res) => {
    try {
        const { userId, hostelId } = req.body;
        
        if (!userId || !hostelId) {
            return res.status(400).json({ message: "User ID and Hostel ID are required" });
        }

        await pool.query(
            "INSERT INTO warden (user_id, hostel_id) VALUES (?, ?)",
            [userId, hostelId]
        );
        res.status(201).json({ message: "Warden assigned successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllHostels = async (req, res) => {
    try {
        const [hostels] = await pool.query(
            "SELECT hostel_id, hostel_name, type, number_of_rooms, capacity FROM hostel"
        );
        res.json(hostels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};