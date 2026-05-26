import jwt from "jsonwebtoken";
import {createUser, findUserByEmail, findUserById, updateUserPassword} from "../models/user.model.js";
import { getStudentProfileByUserId } from "../models/student.model.js";
import { getHostelAdminByUserId } from "../models/hostelAdmin.model.js";

const generateToken =(user)=>{
    return jwt.sign(
        {user_id:user.user_id ,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN}
    );
}

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password with bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    await createUser(email, password, role);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with bcrypt
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const tokenUser = req.user;
    if (!tokenUser) return res.status(401).json({ message: "Not authorized" });

    if (tokenUser.role === "STUDENT") {
      const profile = await getStudentProfileByUserId(tokenUser.user_id);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
      return res.json(profile);
    }

    if (tokenUser.role === "HOSTEL_ADMIN") {
      const mapping = await getHostelAdminByUserId(tokenUser.user_id);
      return res.json({ ...tokenUser, hostel_id: mapping?.hostel_id || null });
    }

    // For other roles, return minimal token info
    return res.json(tokenUser);
  } catch (err) {
    console.error("GETME ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // verify current password (plaintext)
    if (user.password !== currentPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // update password in database
    await updateUserPassword(user.user_id, newPassword);

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};