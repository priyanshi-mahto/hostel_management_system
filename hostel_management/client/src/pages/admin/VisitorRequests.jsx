// import { useState } from "react";
// import AdminLayout from "../../components/AdminLayout";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getAdminVisitorRequests, updateAdminVisitorRequestStatus } from "../../api/admin.api";

const relationColors = {
  Parent: "bg-blue-100 text-blue-700",
  Sibling: "bg-purple-100 text-purple-700",
  Guardian: "bg-teal-100 text-teal-700",
  Relative: "bg-orange-100 text-orange-700",
  Friend: "bg-pink-100 text-pink-700",
  Other: "bg-gray-100 text-gray-600",
};

export default function VisitorRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getAdminVisitorRequests();
      const mapped = (data || []).map((item) => ({
        id: item.request_id,
        student: item.student_name || `Student #${item.student_id}`,
        room: item.room_no || "N/A",
        from: item.from_date ? new Date(item.from_date).toISOString().slice(0, 10) : "-",
        to: item.to_date ? new Date(item.to_date).toISOString().slice(0, 10) : "-",
        reason: item.reason || "-",
        status: item.status || "Pending",
        created: item.created_at ? new Date(item.created_at).toISOString().slice(0, 10) : "-",
        visitors: Array.isArray(item.visitors) ? item.visitors : [],
      }));
      setRequests(mapped);
    } catch (error) {
      console.error("Failed to load admin visitor requests", error);
      setRequests([]);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateAdminVisitorRequestStatus(id, newStatus);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      console.error("Failed to update visitor request status", error);
    }
  };

  const filtered = filter === "All" ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    All: requests.length,
    Pending: requests.filter((r) => r.status === "Pending").length,
    Approved: requests.filter((r) => r.status === "Approved").length,
    Rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Visitor Requests</h2>
        <p className="text-gray-400 text-sm mt-0.5">Review and manage student visitor requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === key
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"
            }`}
          >
            {key}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Requests */}
      <div className="space-y-4">
        {filtered.map((req) => (
          <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Main Row */}
            <div
              className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === req.id ? null : req.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="font-bold text-gray-800">{req.student}</h3>
                    <span className="text-gray-400 text-sm">·</span>
                    <span className="text-gray-500 text-sm">Room {req.room}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        req.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : req.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">"{req.reason}"</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>📅 {req.from} → {req.to}</span>
                    <span>👥 {req.visitors.length} visitor{req.visitors.length > 1 ? "s" : ""}</span>
                    <span>🕐 Applied: {req.created}</span>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{expanded === req.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded === req.id && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Visitor Details</h4>
                <div className="space-y-3 mb-4">
                  {req.visitors.map((v, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {v.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{v.name}</p>
                        <p className="text-gray-400 text-xs">{v.phone}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${relationColors[v.relation] || "bg-gray-100 text-gray-600"}`}>
                        {v.relation}
                      </span>
                    </div>
                  ))}
                </div>

                {req.status === "Pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(req.id, "Approved")}
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "Rejected")}
                      className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}

                {req.status !== "Pending" && (
                  <button
                    onClick={() => updateStatus(req.id, "Pending")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors"
                  >
                    ↩ Reset to Pending
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <p className="text-4xl mb-2">👥</p>
            <p className="font-medium">No visitor requests found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
