import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getAdminComplaints, updateAdminComplaintStatus } from "../../api/complaint.api";

const categoryIcons = {
  Electrical: "⚡",
  Plumbing: "🔧",
  Internet: "📶",
  Cleanliness: "🧹",
  Civil: "🏗️",
  Other: "📌",
};

const categoryColors = {
  Electrical: "bg-yellow-100 text-yellow-700",
  Plumbing: "bg-blue-100 text-blue-700",
  Internet: "bg-purple-100 text-purple-700",
  Cleanliness: "bg-green-100 text-green-700",
  Civil: "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-600",
};

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await getAdminComplaints();
      setComplaints(
        (data || []).map((complaint) => ({
          id: complaint.id,
          student: complaint.student_name || "Unknown Student",
          room: complaint.room || "N/A",
          category: complaint.category,
          title: complaint.title,
          description: complaint.description || "No description provided",
          status: complaint.status,
          date: complaint.date ? new Date(complaint.date).toLocaleString("en-IN") : "-",
          rating: complaint.rating ?? null,
          daysAgo: complaint.days_ago ?? null,
        }))
      );
    } catch (error) {
      console.error("Failed to load admin complaints", error);
      setComplaints([]);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.student.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || c.category === filterCat;
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const toggleStatus = async (id) => {
    const complaint = complaints.find((item) => item.id === id);
    if (!complaint) {
      return;
    }

    const nextStatus = complaint.status === "Pending" ? "Resolved" : "Pending";

    try {
      await updateAdminComplaintStatus(id, nextStatus);
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
      );
      setSelected((prev) => (prev?.id === id ? { ...prev, status: nextStatus } : prev));
    } catch (error) {
      console.error("Failed to update complaint status", error);
    }
  };

  const resolvedRatings = complaints.filter((complaint) => typeof complaint.rating === "number");
  const avgRating = resolvedRatings.length
    ? `${(resolvedRatings.reduce((sum, complaint) => sum + complaint.rating, 0) / resolvedRatings.length).toFixed(1)} ★`
    : "N/A";

  const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-amber-400" : "text-gray-200"}>★</span>
      ))}
    </div>
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Complaints Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">Track and resolve student complaints</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total", value: complaints.length, cls: "bg-teal-50 text-teal-700" },
          { label: "Pending", value: complaints.filter(c => c.status === "Pending").length, cls: "bg-amber-50 text-amber-700" },
          { label: "Resolved", value: complaints.filter(c => c.status === "Resolved").length, cls: "bg-emerald-50 text-emerald-700" },
          { label: "Avg Rating", value: avgRating, cls: "bg-yellow-50 text-yellow-700" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 ${s.cls}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <input
            type="text"
            placeholder="Search student or complaint title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <span className="absolute left-3 top-3 text-gray-400">🔎</span>
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        >
          <option value="All">All Categories</option>
          {Object.keys(categoryIcons).map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-2xl p-5 shadow-sm border transition-all cursor-pointer hover:shadow-md ${selected?.id === c.id ? "border-teal-400 ring-1 ring-teal-200" : "border-gray-100"}`}
            onClick={() => setSelected(selected?.id === c.id ? null : c)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${categoryColors[c.category]}`}>
                  {categoryIcons[c.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-800">{c.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[c.category]}`}>
                      {c.category}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-0.5">{c.student} · Room {c.room}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{c.date}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {c.status}
                </span>
                {c.rating && <StarRating rating={c.rating} />}
              </div>
            </div>

            {/* Expanded */}
            {selected?.id === c.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{c.description}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleStatus(c.id); }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${c.status === "Pending"
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-amber-100 hover:bg-amber-200 text-amber-700"}`}
                  >
                    {c.status === "Pending" ? "✓ Mark Resolved" : "↩ Reopen"}
                  </button>
                  <button
                    type="button"
                    disabled
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    Notes Soon
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <p className="text-4xl mb-2">📋</p>
            <p className="font-medium">No complaints found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
