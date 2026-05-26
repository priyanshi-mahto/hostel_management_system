import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  claimAdminLostFoundItem,
  createAdminLostFoundItem,
  getAdminLostFoundItems,
  getAdminLostFoundStats,
  getAllHostels,
} from "../../api/admin.api";

export default function LostFound() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, claimed: 0 });
  const [hostels, setHostels] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", type: "Found", hostelId: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [itemsRes, statsRes, hostelsRes] = await Promise.all([
        getAdminLostFoundItems(),
        getAdminLostFoundStats(),
        getAllHostels(),
      ]);

      const hostelMap = new Map(hostelsRes.map((h) => [h.hostel_id, h]));

      const normalized = itemsRes.map((item) => {
        const hostel = hostelMap.get(item.hostel_id);
        const hostelLabel = hostel
          ? `${hostel.hostel_name} (${hostel.type})`
          : "Unknown Hostel";

        return {
          id: item.item_id,
          name: item.item_name,
          type: item.type,
          status: item.status,
          date: item.date,
          hostelId: item.hostel_id,
          hostel: hostelLabel,
          description: item.type === "Found" ? "Please contact hostel office" : "Lost item reported",
        };
      });

      setItems(normalized);
      setStats(statsRes || { total: 0, active: 0, claimed: 0 });
      setHostels(hostelsRes || []);

      if (!newItem.hostelId && hostelsRes?.length) {
        setNewItem((prev) => ({ ...prev, hostelId: String(hostelsRes[0].hostel_id) }));
      }
    } catch (err) {
      console.error("Failed to load lost and found data", err);
      setError(err?.response?.data?.message || "Failed to load lost and found data");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchType = filterType === "All" || item.type === filterType;
      const matchStatus = filterStatus === "All" || item.status === filterStatus;
      return matchType && matchStatus;
    });
  }, [items, filterType, filterStatus]);

  const markClaimed = async (id) => {
    try {
      setActionLoading(true);
      await claimAdminLostFoundItem(id);
      await loadData();
    } catch (err) {
      console.error("Failed to mark item as claimed", err);
      alert(err?.response?.data?.message || "Failed to mark item as claimed");
    } finally {
      setActionLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItem.name.trim() || !newItem.hostelId) {
      alert("Item name and hostel are required");
      return;
    }

    try {
      setActionLoading(true);
      await createAdminLostFoundItem({
        item_name: newItem.name.trim(),
        type: newItem.type,
        hostel_id: Number(newItem.hostelId),
      });

      setShowModal(false);
      setNewItem({
        name: "",
        type: "Found",
        hostelId: hostels[0] ? String(hostels[0].hostel_id) : "",
        description: "",
      });
      await loadData();
    } catch (err) {
      console.error("Failed to add item", err);
      alert(err?.response?.data?.message || "Failed to add item");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lost & Found</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage reported lost and found items</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md"
        >
          ➕ Report Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Items", value: stats.total || 0, cls: "bg-teal-50 text-teal-700" },
          { label: "Lost", value: items.filter(i => i.type === "Lost").length, cls: "bg-red-50 text-red-700" },
          { label: "Found", value: items.filter(i => i.type === "Found").length, cls: "bg-emerald-50 text-emerald-700" },
          { label: "Claimed", value: stats.claimed || 0, cls: "bg-gray-50 text-gray-600" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 ${s.cls}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex flex-wrap gap-3">
        <div className="flex gap-2">
          {["All", "Lost", "Found"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterType === t
                  ? t === "Lost"
                    ? "bg-red-500 text-white"
                    : t === "Found"
                    ? "bg-emerald-500 text-white"
                    : "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {["All", "Active", "Claimed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterStatus === s ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && (
          <div className="col-span-3 bg-white rounded-2xl p-6 text-gray-500 border border-gray-100">
            Loading items...
          </div>
        )}

        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md ${
              item.status === "Claimed" ? "border-gray-200 opacity-70" : "border-gray-100"
            }`}
          >
            {/* Type badge */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.type === "Lost" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {item.type === "Lost" ? "🔴 Lost" : "🟢 Found"}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  item.status === "Active" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {item.status}
              </span>
            </div>

            <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
            <p className="text-gray-500 text-sm mb-3">{item.description}</p>

            <div className="text-xs text-gray-400 space-y-1 mb-4">
              <p>🏨 {item.hostel}</p>
              <p>🕐 {item.date ? new Date(item.date).toLocaleString("en-IN") : "-"}</p>
            </div>

            {item.status === "Active" && (
              <button
                onClick={() => markClaimed(item.id)}
                disabled={actionLoading}
                className="w-full py-2 bg-teal-50 hover:bg-teal-100 disabled:opacity-60 text-teal-700 rounded-xl text-sm font-semibold transition-colors"
              >
                ✓ Mark as Claimed
              </button>
            )}
            {item.status === "Claimed" && (
              <div className="w-full py-2 text-center text-gray-400 text-sm">
                ✓ Claimed
              </div>
            )}
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="col-span-3 bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <p className="text-4xl mb-2">🔍</p>
            <p className="font-medium">No items found</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Report New Item</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Black Wallet"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Type</label>
                <div className="flex gap-3">
                  {["Lost", "Found"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewItem({ ...newItem, type: t })}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                        newItem.type === t
                          ? t === "Lost" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Hostel Block</label>
                <select
                  value={newItem.hostelId}
                  onChange={(e) => setNewItem({ ...newItem, hostelId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                >
                  {hostels.map((h) => (
                    <option key={h.hostel_id} value={String(h.hostel_id)}>
                      {h.hostel_name} ({h.type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                  placeholder="Optional note (display only)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={addItem} disabled={actionLoading} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}