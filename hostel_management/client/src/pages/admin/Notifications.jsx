import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const mockNotifications = [
  { id: 1, message: "Mess timings will change from Monday. Breakfast: 7–9 AM, Lunch: 12–2 PM, Dinner: 7–9 PM.", created_at: "2025-03-21 10:00", target: "All Students" },
  { id: 2, message: "Water supply will be disrupted on 22nd March from 10 AM to 4 PM due to maintenance work.", created_at: "2025-03-20 15:30", target: "All Students" },
  { id: 3, message: "Students are reminded to submit their semester fee by 31st March to avoid late charges.", created_at: "2025-03-19 09:00", target: "All Students" },
  { id: 4, message: "Anti-ragging committee meeting scheduled on 25th March at 4 PM in the hostel conference room.", created_at: "2025-03-18 11:00", target: "Wardens & Staff" },
  { id: 5, message: "Lost: Black wallet near Block A common room. Contact hostel office if found.", created_at: "2025-03-17 16:45", target: "Block A" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ message: "", target: "All Students" });
  const [search, setSearch] = useState("");

  const targets = ["All Students", "Block A", "Block B", "Block C", "Wardens & Staff", "Boys Hostels", "Girls Hostels"];

  const filtered = notifications.filter(n =>
    n.message.toLowerCase().includes(search.toLowerCase()) ||
    n.target.toLowerCase().includes(search.toLowerCase())
  );

  const sendNotification = () => {
    if (!form.message.trim()) return;
    const newN = {
      id: notifications.length + 1,
      message: form.message,
      target: form.target,
      created_at: new Date().toLocaleString("en-IN"),
    };
    setNotifications([newN, ...notifications]);
    setForm({ message: "", target: "All Students" });
    setShowModal(false);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const targetColor = (t) => {
    const map = {
      "All Students": "bg-teal-100 text-teal-700",
      "Block A": "bg-blue-100 text-blue-700",
      "Block B": "bg-purple-100 text-purple-700",
      "Block C": "bg-pink-100 text-pink-700",
      "Wardens & Staff": "bg-amber-100 text-amber-700",
      "Boys Hostels": "bg-indigo-100 text-indigo-700",
      "Girls Hostels": "bg-rose-100 text-rose-700",
    };
    return map[t] || "bg-gray-100 text-gray-600";
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-gray-400 text-sm mt-0.5">Broadcast messages to students and staff</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md"
        >
          📣 Send Notification
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
          { label: "Targeted Groups", value: [...new Set(notifications.map(n => n.target))].length, cls: "bg-purple-50 text-purple-700" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 ${s.cls} text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Send Templates */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <h3 className="font-bold text-gray-700 mb-3 text-sm">⚡ Quick Templates</h3>
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
        <span className="absolute left-3 top-3 text-gray-400">🔎</span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div key={n.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-lg shrink-0">
                🔔
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-gray-800 text-sm leading-relaxed font-medium">{n.message}</p>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                    title="Delete"
                  >🗑️</button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${targetColor(n.target)}`}>
                    📢 {n.target}
                  </span>
                  <span className="text-gray-400 text-xs">🕐 {n.created_at}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <p className="text-4xl mb-2">🔔</p>
            <p className="font-medium">No notifications found</p>
          </div>
        )}
      </div>

      {/* Send Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">📣 Send Notification</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Target Audience</label>
                <div className="flex flex-wrap gap-2">
                  {targets.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, target: t })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        form.target === t ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-teal-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
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
                  <p className="text-xs text-teal-400 mt-2">→ Sending to: {form.target}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
              <button
                onClick={sendNotification}
                disabled={!form.message.trim()}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                📣 Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
