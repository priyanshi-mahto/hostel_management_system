import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const stats = [
  { label: "Total Students", value: "248", change: "+12 this month", icon: "🎓", color: "from-teal-500 to-teal-600" },
  { label: "Occupied Rooms", value: "186", change: "of 220 rooms", icon: "🏠", color: "from-emerald-500 to-emerald-600" },
  { label: "Pending Complaints", value: "14", change: "3 urgent", icon: "📋", color: "from-amber-500 to-orange-500" },
  { label: "Pending Leaves", value: "9", change: "needs review", icon: "📅", color: "from-purple-500 to-purple-600" },
];

const recentComplaints = [
  { id: 1, student: "Rahul Sharma", type: "Electrical", room: "A-201", status: "Pending", date: "2025-03-20" },
  { id: 2, student: "Priya Nair", type: "Plumbing", room: "B-104", status: "Resolved", date: "2025-03-19" },
  { id: 3, student: "Amit Verma", type: "Internet", room: "C-310", status: "Pending", date: "2025-03-18" },
  { id: 4, student: "Sneha Kulkarni", type: "Cleanliness", room: "A-405", status: "Resolved", date: "2025-03-17" },
];

const recentLeaves = [
  { id: 1, student: "Karan Singh", from: "2025-03-22", to: "2025-03-25", status: "Pending" },
  { id: 2, student: "Meera Pillai", from: "2025-03-21", to: "2025-03-22", status: "Approved" },
  { id: 3, student: "Dev Patel", from: "2025-03-23", to: "2025-03-26", status: "Pending" },
];

const hostelOccupancy = [
  { hostel: "Block A (Boys)", total: 80, occupied: 72 },
  { hostel: "Block B (Boys)", total: 80, occupied: 60 },
  { hostel: "Block C (Girls)", total: 60, occupied: 54 },
];

const statusBadge = (status) => {
  const map = {
    Pending: "bg-amber-100 text-amber-700",
    Resolved: "bg-emerald-100 text-emerald-700",
    Approved: "bg-teal-100 text-teal-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Welcome back, Admin 👋</h2>
        <p className="text-teal-100 mt-1 text-sm">Here's what's happening in the hostel today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-md`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{s.icon}</span>
              <span className="text-4xl font-black opacity-20 select-none">◆</span>
            </div>
            <p className="text-3xl font-black">{s.value}</p>
            <p className="text-sm font-semibold mt-1 opacity-90">{s.label}</p>
            <p className="text-xs opacity-70 mt-0.5">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Occupancy */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">🏨 Hostel Occupancy</h3>
          <div className="space-y-4">
            {hostelOccupancy.map((h, i) => {
              const pct = Math.round((h.occupied / h.total) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{h.hostel}</span>
                    <span className="text-teal-700 font-bold">{h.occupied}/{h.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-emerald-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{pct}% occupied</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Add Student", icon: "➕" },
                { label: "Allot Room", icon: "🔑" },
                { label: "Send Notice", icon: "📣" },
                { label: "View Reports", icon: "📊" },
              ].map((a, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-1 p-3 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors text-teal-800 text-xs font-medium"
                >
                  <span className="text-xl">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">📋 Recent Complaints</h3>
            <a href="/admin/complaints" className="text-xs text-teal-600 hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                  <th className="pb-2 font-semibold">Student</th>
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 font-semibold">Room</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-800">{c.student}</td>
                    <td className="py-2.5 text-gray-500">{c.type}</td>
                    <td className="py-2.5 text-gray-500">{c.room}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">📅 Pending Leave Requests</h3>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
            {recentLeaves.filter((l) => l.status === "Pending").length} Pending
          </span>
        </div>
        <div className="space-y-3">
          {recentLeaves.map((l) => (
            <div key={l.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{l.student}</p>
                <p className="text-xs text-gray-400">{l.from} → {l.to}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(l.status)}`}>
                  {l.status}
                </span>
                {l.status === "Pending" && (
                  <>
                    <button className="px-3 py-1 bg-teal-500 text-white rounded-lg text-xs hover:bg-teal-600 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200 transition-colors">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
