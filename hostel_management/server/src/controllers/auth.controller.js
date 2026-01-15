import jwt from "jsonwebtoken";
import {reateUser,findUserByEmail} from "../models/user.model.js";

const generateToken =(user)=>{
    return jwt.sign(
        {user_id:user.user_id ,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN}
    );
}