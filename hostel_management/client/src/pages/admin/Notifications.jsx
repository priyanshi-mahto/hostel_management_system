import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getAdminNotifications, sendAdminNotification, deleteAdminNotification } from "../../api/admin.api";
import {
  FiBell,
  FiSend,
  FiZap,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiClock,
  FiX
} from "react-icons/fi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ message: "", target_audience: "All Students", priority: "Normal" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const targets = ["All Students", "Wardens & Staff"];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setError(err?.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const filtered = notifications.filter(n =>
    n.message.toLowerCase().includes(search.toLowerCase()) ||
    (n.target_audience || "").toLowerCase().includes(search.toLowerCase()) ||
    (n.priority || "").toLowerCase().includes(search.toLowerCase())
  );

  const sendNotification = async () => {
    if (!form.message.trim()) {
      alert("Message cannot be empty");
      return;
    }

    try {
      setActionLoading(true);
      await sendAdminNotification({
        message: form.message,
        target_audience: form.target_audience,
        priority: form.priority,
      });
      setForm({ message: "", target_audience: "All Students", priority: "Normal" });
      setShowModal(false);
      await loadNotifications();
    } catch (err) {
      console.error("Failed to send notification", err);
      alert(err?.response?.data?.message || "Failed to send notification");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      setActionLoading(true);
      await deleteAdminNotification(id);
      await loadNotifications();
    } catch (err) {
      console.error("Failed to delete notification", err);
      alert(err?.response?.data?.message || "Failed to delete notification");
    } finally {
      setActionLoading(false);
    }
  };

  const targetColor = (t) => {
    const map = {
      "All Students": "bg-teal-100 text-teal-700",
      "Wardens & Staff": "bg-amber-100 text-amber-700",
    };
    return map[t] || "bg-gray-100 text-gray-600";
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-gray-400 text-sm mt-0.5">Broadcast messages to students and staff</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md"
        >
          <FiSend className="w-4 h-4" /> Send Notification
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total Sent", value: notifications.length, cls: "bg-teal-50 text-teal-700" },
          { label: "This Week", value: notifications.filter(n => {
            const d = new Date(n.created_at);
            const now = new Date();
            return (now - d) < 7 * 24 * 60 * 60 * 1000;
          }).length, cls: "bg-emerald-50 text-emerald-700" },
          { label: "Targeted Groups", value: [...new Set(notifications.map(n => n.target_audience))].length, cls: "bg-purple-50 text-purple-700" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 ${s.cls} text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Send Templates */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-1.5">
          <FiZap className="w-4 h-4 text-amber-500 fill-amber-500" /> Quick Templates
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Water supply disruption scheduled",
            "Mess menu updated for this week",
            "Anti-ragging awareness session",
            "Fee payment deadline reminder",
            "Hostel inspection scheduled",
          ].map((tmpl) => (
            <button
              key={tmpl}
              onClick={() => { setForm({ ...form, message: tmpl }); setShowModal(true); }}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-medium transition-colors"
            >
              {tmpl}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <FiSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading && <div className="bg-white rounded-2xl p-6 text-center text-gray-500">Loading notifications...</div>}
        {!loading && filtered.map((n) => (
          <div key={n.notification_id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <FiBell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-gray-800 text-sm leading-relaxed font-medium">{n.message}</p>
                  <button
                    onClick={() => handleDeleteNotification(n.notification_id)}
                    disabled={actionLoading}
                    className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5 disabled:opacity-50"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${targetColor(n.target_audience)}`}>
                    <FiUsers className="w-3 h-3" /> {n.target_audience}
                  </span>
                  <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                    <FiClock className="w-3.5 h-3.5" /> {formatDateTime(n.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <FiBell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-medium">No notifications found</p>
          </div>
        )}
      </div>

      {/* Send Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
                <FiSend className="w-5 h-5 text-teal-600" /> Send Notification
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Target Audience</label>
                <div className="flex flex-wrap gap-2">
                  {targets.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, target_audience: t })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        form.target_audience === t ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-teal-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Priority</label>
                <div className="flex gap-2">
                  {[
                    { key: 'Normal', label: 'Normal' },
                    { key: 'Important', label: 'Important' }
                  ].map(p => (
                    <button
                      key={p.key}
                      onClick={() => setForm({ ...form, priority: p.key })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        form.priority === p.key ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  placeholder="Type your notification message here..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.message.length} characters</p>
              </div>

              {/* Preview */}
              {form.message && (
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                  <p className="text-xs font-bold text-teal-600 mb-1">PREVIEW</p>
                  <p className="text-sm text-teal-900">{form.message}</p>
                  <p className="text-xs text-teal-400 mt-2">→ Sending to: {form.target_audience} • Priority: {form.priority}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-100 flex-shrink-0 bg-white">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
              <button
                onClick={sendNotification}
                disabled={actionLoading || !form.message.trim()}
                className="flex items-center gap-1.5 px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <FiSend className="w-4 h-4" /> Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
