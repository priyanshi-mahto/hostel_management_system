import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { approveAdminLeave, getAdminDashboard, rejectAdminLeave } from "../../api/admin.api";

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
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaveActionId, setLeaveActionId] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminDashboard();
      setDashboard(data);
    } catch (loadError) {
      console.error("Failed to load admin dashboard", loadError);
      setError(loadError.response?.data?.message || loadError.response?.data?.error || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAction = async (leaveId, action) => {
    try {
      setLeaveActionId(leaveId);
      if (action === "approve") {
        await approveAdminLeave(leaveId);
      } else {
        await rejectAdminLeave(leaveId);
      }

      setDashboard((prev) => {
        if (!prev) return prev;

        const updatedLeaves = prev.recentLeaves.map((leave) =>
          leave.id === leaveId
            ? { ...leave, status: action === "approve" ? "APPROVED" : "REJECTED" }
            : leave
        );

        const pendingLeaves = updatedLeaves.filter((leave) => leave.status === "PENDING").length;

        return {
          ...prev,
          stats: {
            ...prev.stats,
            pendingLeaves,
          },
          recentLeaves: updatedLeaves,
        };
      });
    } catch (actionError) {
      console.error("Failed to update leave request", actionError);
      setError(actionError.response?.data?.message || actionError.response?.data?.error || "Failed to update leave request");
    } finally {
      setLeaveActionId(null);
    }
  };

  const stats = useMemo(() => {
    const base = dashboard?.stats || {};
    return [
      {
        label: "Total Students",
        value: base.totalStudents ?? 0,
        change: "assigned to this hostel",
        icon: "🎓",
        color: "from-teal-500 to-teal-600",
      },
      {
        label: "Occupied Rooms",
        value: base.occupiedRooms ?? 0,
        change: `of ${base.totalRooms ?? 0} rooms`,
        icon: "🏠",
        color: "from-emerald-500 to-emerald-600",
      },
      {
        label: "Pending Complaints",
        value: base.pendingComplaints ?? 0,
        change: "need attention",
        icon: "📋",
        color: "from-amber-500 to-orange-500",
      },
      {
        label: "Pending Leaves",
        value: base.pendingLeaves ?? 0,
        change: "needs review",
        icon: "📅",
        color: "from-purple-500 to-purple-600",
      },
    ];
  }, [dashboard]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-sm text-gray-500">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Welcome back, Admin 👋</h2>
        <p className="text-teal-100 mt-1 text-sm">Here's what's happening in your hostel today.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
            {dashboard?.occupancy ? (() => {
              const pct = dashboard.occupancy.total
                ? Math.round((dashboard.occupancy.occupied / dashboard.occupancy.total) * 100)
                : 0;

              return (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{dashboard.occupancy.hostel}</span>
                    <span className="text-teal-700 font-bold">{dashboard.occupancy.occupied}/{dashboard.occupancy.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-emerald-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{pct}% rooms occupied</p>
                </div>
              );
            })() : (
              <p className="text-sm text-gray-400">No occupancy data available.</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Students", icon: "🎓", path: "/admin/students" },
                { label: "Allot Room", icon: "🔑", path: "/admin/rooms" },
                { label: "Send Notice", icon: "📣", path: "/admin/notifications" },
                { label: "Complaints", icon: "📊", path: "/admin/complaints" },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => navigate(a.path)}
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
            <button onClick={() => navigate("/admin/complaints")} className="text-xs text-teal-600 hover:underline">View all →</button>
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
                {(dashboard?.recentComplaints || []).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-800">{c.student}</td>
                    <td className="py-2.5 text-gray-500">{c.type}</td>
                    <td className="py-2.5 text-gray-500">{c.room}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs">{c.date ? new Date(c.date).toLocaleDateString("en-IN") : "-"}</td>
                  </tr>
                ))}
                {!(dashboard?.recentComplaints || []).length && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-sm text-gray-400">No recent complaints found.</td>
                  </tr>
                )}
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
            {(dashboard?.recentLeaves || []).filter((l) => l.status === "PENDING").length} Pending
          </span>
        </div>
        <div className="space-y-3">
          {(dashboard?.recentLeaves || []).map((l) => (
            <div key={l.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{l.student}</p>
                <p className="text-xs text-gray-400">{l.from_date} → {l.to_date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(
                  l.status === "PENDING" ? "Pending" : l.status === "APPROVED" ? "Approved" : "Rejected"
                )}`}>
                  {l.status}
                </span>
                {l.status === "PENDING" && (
                  <>
                    <button
                      disabled={leaveActionId === l.id}
                      onClick={() => handleLeaveAction(l.id, "approve")}
                      className="px-3 py-1 bg-teal-500 text-white rounded-lg text-xs hover:bg-teal-600 disabled:bg-teal-300 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      disabled={leaveActionId === l.id}
                      onClick={() => handleLeaveAction(l.id, "reject")}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200 disabled:opacity-60 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {!(dashboard?.recentLeaves || []).length && (
            <div className="p-6 text-center text-sm text-gray-400 bg-gray-50 rounded-xl">
              No leave requests found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
