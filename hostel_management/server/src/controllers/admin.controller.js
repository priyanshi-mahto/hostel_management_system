import {
    createRoom as createRoomModel,
    getRoomsWithOccupancyByHostel,
    getRoomAllocationsByHostel,
    getAvailableStudentsByHostel,
    getRoomOccupancy,
    getActiveAllocationByStudentAndHostel,
    allocateRoom,
    deallocateRoom,
} from "../models/room.model.js";
import { findUserById, getUnassignedUsersByRole, getUsersByHostelId, createUser, findUserByEmail } from "../models/user.model.js";
import { getStudentsByHostelId, isStudentAssignedToHostel } from "../models/student.model.js";
import {
    createOfficeStaff,
    deleteOfficeStaffById,
    getOfficeStaffByHostelId,
    updateOfficeStaffById,
} from "../models/officeStaff.model.js";
import {
    getStudentIdCardsByHostel,
    updateStudentIdCardStatusByHostel,
} from "../models/idCard.model.js";
import {
    getItemsByHostel,
    getStatsByHostel,
    createItem,
    updateItemStatusByHostel,
} from "../models/lostFound.model.js";
import {
    getRequestsByHostel,
    updateRequestStatusByHostel,
} from "../models/visitor.model.js";
import {
    getNotificationsByHostel,
    createNotification,
    deleteNotification,
} from "../models/notification.model.js";
import {
    getAdminDashboardStatsByHostel,
    getHostelOccupancyById,
    getRecentComplaintsByHostel,
    getRecentLeavesByHostel,
} from "../models/dashboard.model.js";
import {
    createWardenForHostel,
    deleteWardenById,
    getWardensByHostelId,
    updateWardenById,
    getWardenByUserId,
} from "../models/warden.model.js";
import pool from "../config/db.js";

export const createHostel = async (req,res)=>{
    return res.status(403).json({
        message: "Hostel admin cannot create hostel. One admin is mapped to one existing hostel.",
    });
};

export const getDashboard = async (req, res) => {
    try {
        const [stats, occupancy, recentComplaints, recentLeaves] = await Promise.all([
            getAdminDashboardStatsByHostel(req.adminHostelId),
            getHostelOccupancyById(req.adminHostelId),
            getRecentComplaintsByHostel(req.adminHostelId),
            getRecentLeavesByHostel(req.adminHostelId),
        ]);

        res.json({
            stats: {
                totalStudents: Number(stats?.total_students || 0),
                occupiedRooms: Number(stats?.occupied_rooms || 0),
                totalRooms: Number(stats?.total_rooms || 0),
                pendingComplaints: Number(stats?.pending_complaints || 0),
                pendingLeaves: Number(stats?.pending_leaves || 0),
            },
            occupancy: occupancy
                ? {
                    hostel: `${occupancy.hostel_name} (${occupancy.type})`,
                    occupied: Number(occupancy.occupied_rooms || 0),
                    total: Number(occupancy.total_rooms || 0),
                  }
                : null,
            recentComplaints,
            recentLeaves,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createRoom = async(req,res) => {
    try{
        const payload = {
            ...req.body,
            hostel_id: req.adminHostelId,
        };

        if (!payload.unit || !payload.floor || !payload.room_no) {
            return res.status(400).json({ message: "unit, floor and room_no are required" });
        }

        await createRoomModel(payload);
        res.status(201).json({message:"Room created"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const getRooms = async (req, res) => {
    try {
        const rooms = await getRoomsWithOccupancyByHostel(req.adminHostelId);
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getRoomAllocations = async (req, res) => {
    try {
        const allocations = await getRoomAllocationsByHostel(req.adminHostelId);
        res.json(allocations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllocatableStudents = async (req, res) => {
    try {
        const students = await getAvailableStudentsByHostel(req.adminHostelId);
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const allocateStudentRoom = async (req, res) => {
    try {
        const { studentId, roomId, fromDate } = req.body;

        if (!studentId || !roomId || !fromDate) {
            return res.status(400).json({ message: "studentId, roomId and fromDate are required" });
        }

        const belongsToHostel = await isStudentAssignedToHostel(studentId, req.adminHostelId);
        if (!belongsToHostel) {
            return res.status(400).json({ message: "Student is not assigned to this hostel" });
        }

        const existing = await getActiveAllocationByStudentAndHostel(studentId, req.adminHostelId);
        if (existing) {
            return res.status(400).json({ message: "Student already has an active room allocation" });
        }

        const room = await getRoomOccupancy(roomId, req.adminHostelId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (Number(room.occupied) >= Number(room.capacity)) {
            return res.status(400).json({ message: "Room is already full" });
        }

        await allocateRoom(studentId, roomId, fromDate);
        res.status(201).json({ message: "Room allocated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deallocateStudentRoom = async (req, res) => {
    try {
        const { allocationId } = req.params;
        const toDate = req.body?.toDate || new Date().toISOString().slice(0, 10);

        const result = await deallocateRoom(allocationId, req.adminHostelId, toDate);
        if (!result.affectedRows) {
            return res.status(404).json({ message: "Active allocation not found" });
        }

        res.json({ message: "Room deallocated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUsers = async(req,res)=>{
    try{
        const users = await getUsersByHostelId(req.adminHostelId);
        res.json(users);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const getStudents = async (req, res) => {
    try {
        const students = await getStudentsByHostelId(req.adminHostelId);
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const assignWarden = async (req, res) => {
    try {
        const { userId, email, name, phone } = req.body;
        
        if (!name?.trim()) {
            return res.status(400).json({ message: "name is required" });
        }

        let finalUserId = userId ? Number(userId) : null;

        if (!finalUserId) {
            if (!email?.trim()) {
                return res.status(400).json({ message: "userId or email is required" });
            }
            // Check if user already exists by email
            const existingUser = await findUserByEmail(email.trim());
            if (existingUser) {
                if (existingUser.role !== "WARDEN") {
                    return res.status(400).json({ message: `User with email ${email} already exists with role ${existingUser.role}` });
                }
                finalUserId = existingUser.user_id;
            } else {
                // Create a new warden user
                finalUserId = await createUser(email.trim(), "password123", "WARDEN");
            }
        } else {
            const user = await findUserById(finalUserId);
            if (!user || user.role !== "WARDEN") {
                return res.status(400).json({ message: "Selected user is not a warden" });
            }
        }

        // Verify if this hostel already has a warden
        const hostelWardens = await getWardensByHostelId(req.adminHostelId);
        if (hostelWardens && hostelWardens.length > 0) {
            return res.status(400).json({ message: "This hostel already has a warden assigned. Only one warden is allowed per hostel." });
        }

        // Verify warden is not already assigned
        const existingWarden = await getWardenByUserId(finalUserId);
        if (existingWarden) {
            return res.status(400).json({ message: "Selected user is already assigned as a warden to a hostel" });
        }

        await createWardenForHostel({
            userId: finalUserId,
            hostelId: req.adminHostelId,
            name: name.trim(),
            phone: (phone || "").trim(),
        });

        res.status(201).json({ message: "Warden assigned successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getWardens = async (req, res) => {
    try {
        const wardens = await getWardensByHostelId(req.adminHostelId);
        res.json(wardens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateWarden = async (req, res) => {
    try {
        const { wardenId } = req.params;
        const { name, phone } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: "name is required" });
        }

        const result = await updateWardenById({
            wardenId,
            hostelId: req.adminHostelId,
            name: name.trim(),
            phone: (phone || "").trim(),
        });

        if (!result.affectedRows) {
            return res.status(404).json({ message: "Warden not found" });
        }

        res.json({ message: "Warden updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const removeWarden = async (req, res) => {
    try {
        const { wardenId } = req.params;
        const result = await deleteWardenById(wardenId, req.adminHostelId);

        if (!result.affectedRows) {
            return res.status(404).json({ message: "Warden not found" });
        }

        res.json({ message: "Warden removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getOfficeStaff = async (req, res) => {
    try {
        const staff = await getOfficeStaffByHostelId(req.adminHostelId);
        res.json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createOfficeStaffMember = async (req, res) => {
    try {
        const { userId, email, name, phone } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: "name is required" });
        }

        let finalUserId = userId ? Number(userId) : null;

        if (!finalUserId) {
            if (!email?.trim()) {
                return res.status(400).json({ message: "userId or email is required" });
            }
            // Check if user already exists by email
            const existingUser = await findUserByEmail(email.trim());
            if (existingUser) {
                if (existingUser.role !== "STAFF") {
                    return res.status(400).json({ message: `User with email ${email} already exists with role ${existingUser.role}` });
                }
                finalUserId = existingUser.user_id;
            } else {
                // Create a new staff user
                finalUserId = await createUser(email.trim(), "password123", "STAFF");
            }
        } else {
            const user = await findUserById(finalUserId);
            if (!user || user.role !== "STAFF") {
                return res.status(400).json({ message: "Selected user is not staff" });
            }
        }

        // Verify they are not already assigned
        const [existingStaff] = await pool.query(
            "SELECT * FROM office_staff WHERE user_id = ?",
            [finalUserId]
        );
        if (existingStaff.length > 0) {
            return res.status(400).json({ message: "Selected user is already assigned as staff to a hostel" });
        }

        await createOfficeStaff({
            userId: finalUserId,
            hostelId: req.adminHostelId,
            name: name.trim(),
            phone: (phone || "").trim(),
        });

        res.status(201).json({ message: "Staff member added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateOfficeStaffMember = async (req, res) => {
    try {
        const { staffId } = req.params;
        const { name, phone } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: "name is required" });
        }

        const result = await updateOfficeStaffById({
            staffId,
            hostelId: req.adminHostelId,
            name: name.trim(),
            phone: (phone || "").trim(),
        });

        if (!result.affectedRows) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        res.json({ message: "Staff member updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const removeOfficeStaffMember = async (req, res) => {
    try {
        const { staffId } = req.params;
        const result = await deleteOfficeStaffById(staffId, req.adminHostelId);

        if (!result.affectedRows) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        res.json({ message: "Staff member removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAssignableUsers = async (req, res) => {
    try {
        const role = String(req.query.role || "").toUpperCase();

        if (!["WARDEN", "STAFF"].includes(role)) {
            return res.status(400).json({ message: "role must be WARDEN or STAFF" });
        }

        const users = await getUnassignedUsersByRole(role);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllHostels = async (req, res) => {
    try {
        const [hostels] = await pool.query(
            "SELECT hostel_id, hostel_name, type, number_of_rooms, capacity FROM hostel WHERE hostel_id = ?",
            [req.adminHostelId]
        );
        res.json(hostels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getIdCards = async (req, res) => {
    try {
        const cards = await getStudentIdCardsByHostel(req.adminHostelId);
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyIdCard = async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);

        if (!Number.isInteger(studentId) || studentId <= 0) {
            return res.status(400).json({ message: "Invalid studentId" });
        }

        const belongsToHostel = await isStudentAssignedToHostel(studentId, req.adminHostelId);
        if (!belongsToHostel) {
            return res.status(403).json({ message: "Student does not belong to this hostel" });
        }

        const result = await updateStudentIdCardStatusByHostel(
            studentId,
            "VERIFIED",
            req.user.user_id,
            req.adminHostelId,
            null
        );
        if (!result.affectedRows) {
            return res.status(404).json({ message: "ID card not found" });
        }

        res.json({ message: "ID card verified successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const rejectIdCard = async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);
        const rejectionReason = (req.body?.description || req.body?.reason || "").trim();

        if (!Number.isInteger(studentId) || studentId <= 0) {
            return res.status(400).json({ message: "Invalid studentId" });
        }

        if (!rejectionReason) {
            return res.status(400).json({ message: "Rejection description is required" });
        }

        const belongsToHostel = await isStudentAssignedToHostel(studentId, req.adminHostelId);
        if (!belongsToHostel) {
            return res.status(403).json({ message: "Student does not belong to this hostel" });
        }

        const result = await updateStudentIdCardStatusByHostel(
            studentId,
            "REJECTED",
            req.user.user_id,
            req.adminHostelId,
            rejectionReason
        );
        if (!result.affectedRows) {
            return res.status(404).json({ message: "ID card not found" });
        }

        res.json({ message: "ID card rejected successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getLostFoundItems = async (req, res) => {
    try {
        const items = await getItemsByHostel(req.adminHostelId);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getLostFoundStats = async (req, res) => {
    try {
        const data = await getStatsByHostel(req.adminHostelId);
        res.json({
            total: Number(data?.total || 0),
            active: Number(data?.active || 0),
            claimed: Number(data?.claimed || 0),
            latestDate: data?.latest ? new Date(data.latest).toDateString() : "No data",
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createLostFoundItem = async (req, res) => {
    try {
        const { item_name, type } = req.body;

        if (!item_name || !type) {
            return res.status(400).json({ message: "item_name and type are required" });
        }

        await createItem({ item_name, type, hostel_id: req.adminHostelId });
        res.status(201).json({ message: "Item added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const claimLostFoundItem = async (req, res) => {
    try {
        const result = await updateItemStatusByHostel(req.params.itemId, "Claimed", req.adminHostelId);
        if (!result.affectedRows) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json({ message: "Item claimed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getVisitorRequests = async (req, res) => {
    try {
        const requests = await getRequestsByHostel(req.adminHostelId);
        // normalize visitors into arrays
        const normalized = requests.map(r => ({
            request_id: r.request_id,
            student_id: r.student_id,
            student_name: r.student_name,
            room_no: r.room_no,
            from_date: r.from_date,
            to_date: r.to_date,
            reason: r.reason,
            status: r.status,
            created_at: r.created_at,
            visitors: r.visitors ? r.visitors.split('||').map(s => {
                const [name, relation, phone] = s.split('::');
                return { name, relation, phone };
            }) : []
        }));

        res.json(normalized);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateVisitorRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        if (!['Pending','Approved','Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const affected = await updateRequestStatusByHostel(requestId, status, req.adminHostelId);
        if (!affected) return res.status(404).json({ message: 'Request not found' });
        res.json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const notifications = await getNotificationsByHostel(req.adminHostelId);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const sendNotification = async (req, res) => {
    try {
        const { message, target_audience, priority } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Message is required" });
        }

        if (!target_audience || !target_audience.trim()) {
            return res.status(400).json({ message: "Target audience is required" });
        }

        // Validate priority
        const allowedPriorities = ["Normal", "Important"];
        const notifPriority = allowedPriorities.includes(priority) ? priority : "Normal";

        // Hostel admins are not allowed to send global notifications across all hostels.
        if (target_audience === "All Hostels") {
            return res.status(403).json({ message: "Hostel admins cannot send notifications to All Hostels." });
        }

        const notificationId = await createNotification(req.adminHostelId, message.trim(), target_audience, notifPriority);
        
        res.status(201).json({ 
            message: "Notification sent successfully",
            notification_id: notificationId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteNotificationById = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const result = await deleteNotification(notificationId, req.adminHostelId);
        
        if (!result) {
            return res.status(404).json({ message: "Notification not found" });
        }
        
        res.json({ message: "Notification deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};