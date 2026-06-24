import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  allocateAdminRoom,
  createRoom,
  deallocateAdminRoom,
  getAdminRoomAllocations,
  getAdminRooms,
  getAllHostels,
  getAllocatableStudents,
} from "../../api/admin.api";
import { FiHome, FiGrid, FiBookOpen, FiSearch, FiX } from "react-icons/fi";

export default function RoomAllocation() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [roomForm, setRoomForm] = useState({ unit: "", floor: "", room_no: "", capacity: 1 });
  const [allocationForm, setAllocationForm] = useState({ studentId: "", roomId: "", fromDate: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [roomsRes, allocationsRes, , studentsRes] = await Promise.all([
        getAdminRooms(),
        getAdminRoomAllocations(),
        getAllHostels(),
        getAllocatableStudents(),
      ]);

      const normalizedRooms = roomsRes.map((room) => ({
        id: room.room_id,
        room_no: room.room_no,
        floor: room.floor,
        unit: room.unit,
        capacity: Number(room.capacity || 0),
        occupied: Number(room.occupied || 0),
        hostel: `${room.hostel_name} (${room.type})`,
        students: room.students ? room.students.split("||").filter(Boolean) : [],
      }));

      const normalizedAllocations = allocationsRes.map((allocation) => ({
        id: allocation.allocation_id,
        studentId: allocation.student_id,
        student: allocation.student_name,
        roll: allocation.roll_no,
        room: allocation.room_no,
        unit: allocation.unit,
        hostel: `${allocation.hostel_name} (${allocation.type})`,
        from: allocation.from_date,
        to: allocation.to_date,
      }));

      setRooms(normalizedRooms);
      setAllocations(normalizedAllocations);
      setStudents(studentsRes || []);

      if (studentsRes?.length) {
        setAllocationForm((prev) => ({
          ...prev,
          studentId: prev.studentId || String(studentsRes[0].student_id),
        }));
      }
    } catch (err) {
      console.error("Failed to load room allocation data", err);
      setError(err?.response?.data?.message || "Failed to load room allocation data");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    return rooms.filter((r) => {
      const roomDisplay = `unit${r.unit}${r.room_no}`.toLowerCase();
      const floorStr = String(r.floor).toLowerCase();
      const unitStr = String(r.unit).toLowerCase();
      
      const matchSearch = !query || (
        roomDisplay.includes(query) ||
        floorStr.includes(query) ||
        unitStr.includes(query) ||
        r.room_no.toLowerCase().includes(query)
      );
      
      const matchStatus =
        filterStatus === "All" ||
        (filterStatus === "Full" && r.occupied === r.capacity) ||
        (filterStatus === "Available" && r.occupied > 0 && r.occupied < r.capacity) ||
        (filterStatus === "Empty" && r.occupied === 0);
      
      return matchSearch && matchStatus;
    });
  }, [rooms, searchQuery, filterStatus]);

  const availableRooms = useMemo(() => rooms.filter((r) => r.occupied < r.capacity), [rooms]);

  const getRoomStatus = (r) => {
    if (r.occupied === 0) return { label: "Empty", cls: "bg-gray-100 text-gray-500" };
    if (r.occupied === r.capacity) return { label: "Full", cls: "bg-red-100 text-red-600" };
    return { label: "Available", cls: "bg-emerald-100 text-emerald-700" };
  };

  const openAllocationModal = (room = null) => {
    setSelectedRoom(room);
    setAllocationForm({
      studentId: students[0] ? String(students[0].student_id) : "",
      roomId: room ? String(room.id) : availableRooms[0] ? String(availableRooms[0].id) : "",
      fromDate: new Date().toISOString().slice(0, 10),
    });
    setShowAllocModal(true);
  };

  const handleAddRoom = async () => {
    if (!roomForm.unit || !roomForm.floor || !roomForm.room_no || !roomForm.capacity) {
      alert("All room fields are required");
      return;
    }

    try {
      setActionLoading(true);
      await createRoom({
        unit: Number(roomForm.unit),
        floor: Number(roomForm.floor),
        room_no: roomForm.room_no.trim(),
        capacity: Number(roomForm.capacity),
      });
      setShowRoomModal(false);
      setRoomForm({ unit: "", floor: "", room_no: "", capacity: 1 });
      await loadData();
    } catch (err) {
      console.error("Failed to add room", err);
      alert(err?.response?.data?.message || "Failed to add room");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAllocateRoom = async () => {
    if (!allocationForm.studentId || !allocationForm.roomId || !allocationForm.fromDate) {
      alert("Student, room and from date are required");
      return;
    }

    try {
      setActionLoading(true);
      await allocateAdminRoom({
        studentId: Number(allocationForm.studentId),
        roomId: Number(allocationForm.roomId),
        fromDate: allocationForm.fromDate,
      });
      setShowAllocModal(false);
      setSelectedRoom(null);
      await loadData();
    } catch (err) {
      console.error("Failed to allocate room", err);
      alert(err?.response?.data?.message || "Failed to allocate room");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeallocate = async (allocationId) => {
    try {
      setActionLoading(true);
      await deallocateAdminRoom(allocationId, { toDate: new Date().toISOString().slice(0, 10) });
      await loadData();
    } catch (err) {
      console.error("Failed to deallocate room", err);
      alert(err?.response?.data?.message || "Failed to deallocate room");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Room & Allocation</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage rooms and student allocations</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRoomModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiHome className="w-4 h-4" /> Add Room
          </button>
          <button
            onClick={() => openAllocationModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
          >
            <FiGrid className="w-4 h-4" /> Allocate Room
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Rooms", value: rooms.length, cls: "bg-teal-50 text-teal-700" },
          { label: "Fully Occupied", value: rooms.filter((r) => r.occupied === r.capacity).length, cls: "bg-red-50 text-red-700" },
          { label: "Partially Filled", value: rooms.filter((r) => r.occupied > 0 && r.occupied < r.capacity).length, cls: "bg-amber-50 text-amber-700" },
          { label: "Empty Rooms", value: rooms.filter((r) => r.occupied === 0).length, cls: "bg-gray-50 text-gray-600" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 ${s.cls}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 w-fit">
        {[
          { id: "rooms", label: "Rooms", icon: <FiHome className="w-4 h-4" /> },
          { id: "allocations", label: "Allocations", icon: <FiBookOpen className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "rooms" && (
        <>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex flex-wrap gap-3 items-center w-full">
            <div className="relative flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search rooms by floor, room no, or unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              {["All", "Available", "Full", "Empty"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading && <div className="col-span-3 bg-white rounded-2xl p-6 border border-gray-100 text-gray-500">Loading rooms...</div>}
            {!loading && filteredRooms.map((room) => {
              const status = getRoomStatus(room);
              const fillPct = room.capacity ? Math.round((room.occupied / room.capacity) * 100) : 0;
              return (
                <div key={room.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Unit {room.unit} - {room.room_no}</h3>
                      <p className="text-gray-400 text-xs">Floor {room.floor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${status.cls}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{room.occupied} / {room.capacity} students</span>
                      <span>{fillPct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${fillPct === 100 ? "bg-red-400" : "bg-gradient-to-r from-teal-400 to-emerald-400"}`} style={{ width: `${fillPct}%` }} />
                    </div>
                  </div>

                  {room.students.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.students.map((s, i) => (
                        <span key={i} className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <button onClick={() => openAllocationModal(room)} className="flex-1 py-1.5 text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition-colors">
                      Allocate
                    </button>
                    <button className="flex-1 py-1.5 text-xs font-semibold bg-gray-50 text-gray-600 rounded-lg cursor-not-allowed">
                      View Only
                    </button>
                  </div>
                </div>
              );
            })}
            {!loading && filteredRooms.length === 0 && (
              <div className="col-span-3 bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
                <FiHome className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="font-medium">No rooms found</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "allocations" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading && <div className="px-5 py-4 text-sm text-gray-500">Loading allocations...</div>}
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs font-semibold">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Roll No</th>
                  <th className="px-5 py-3">Room</th>
                  <th className="px-5 py-3">From</th>
                  <th className="px-5 py-3">To</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allocations.map((a) => (
                  <tr key={a.id} className="hover:bg-teal-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-800">{a.student}</td>
                    <td className="px-5 py-3 font-mono text-gray-500">{a.roll}</td>
                    <td className="px-5 py-3 font-bold text-teal-700">Unit {a.unit} - {a.room}</td>
                    <td className="px-5 py-3 text-gray-500">{a.from ? new Date(a.from).toLocaleDateString("en-CA") : "-"}</td>
                    <td className="px-5 py-3 text-gray-400">{a.to ? new Date(a.to).toLocaleDateString("en-CA") : <span className="italic text-xs">Current</span>}</td>
                    <td className="px-5 py-3">
                      {!a.to && (
                        <button onClick={() => handleDeallocate(a.id)} disabled={actionLoading} className="px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-60 rounded-lg transition-colors">
                          Deallocate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && allocations.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <FiBookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="font-medium">No allocations found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showAllocModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Allocate Room</h3>
              <button onClick={() => setShowAllocModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Select Student</label>
                <select value={allocationForm.studentId} onChange={(e) => setAllocationForm((prev) => ({ ...prev, studentId: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.student_id} value={String(s.student_id)}>
                      {s.name} ({s.roll_no})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Select Room</label>
                <select value={allocationForm.roomId} onChange={(e) => setAllocationForm((prev) => ({ ...prev, roomId: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                  <option value="">Select room</option>
                  {availableRooms.map((r) => (
                    <option key={r.id} value={String(r.id)}>
                      Unit {r.unit} - {r.room_no} Floor {r.floor} ({r.capacity - r.occupied} spots left)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">From Date</label>
                <input type="date" value={allocationForm.fromDate} onChange={(e) => setAllocationForm((prev) => ({ ...prev, fromDate: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowAllocModal(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
              <button disabled={actionLoading} onClick={handleAllocateRoom} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">Allocate</button>
            </div>
          </div>
        </div>
      )}

      {showRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Add Room</h3>
              <button onClick={() => setShowRoomModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Room Number</label>
                <input value={roomForm.room_no} onChange={(e) => setRoomForm((prev) => ({ ...prev, room_no: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Unit</label>
                  <input type="number" value={roomForm.unit} onChange={(e) => setRoomForm((prev) => ({ ...prev, unit: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Floor</label>
                  <input type="number" value={roomForm.floor} onChange={(e) => setRoomForm((prev) => ({ ...prev, floor: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Capacity</label>
                  <input type="number" min="1" value={roomForm.capacity} onChange={(e) => setRoomForm((prev) => ({ ...prev, capacity: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowRoomModal(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
              <button disabled={actionLoading} onClick={handleAddRoom} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">Add Room</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
