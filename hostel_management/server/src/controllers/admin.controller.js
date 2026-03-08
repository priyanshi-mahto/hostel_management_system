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
    // TODO: implement actual assignment logic
    res.status(501).json({ message: "assignWarden not implemented" });
};

export const getAllHostels = async (req, res) => {
    // TODO: return hostels from DB
    res.json([]);
};