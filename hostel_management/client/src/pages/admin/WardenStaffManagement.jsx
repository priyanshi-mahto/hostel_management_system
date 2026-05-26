import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  createAdminOfficeStaff,
  createAdminWarden,
  deleteAdminOfficeStaff,
  deleteAdminWarden,
  getAdminAssignableUsers,
  getAdminOfficeStaff,
  getAdminWardens,
  getAllHostels,
  updateAdminOfficeStaff,
  updateAdminWarden,
} from "../../api/admin.api";

export default function WardenStaffManagement() {
  const [activeTab, setActiveTab] = useState("wardens");
  const [wardens, setWardens] = useState([]);
  const [staff, setStaff] = useState([]);
  const [hostel, setHostel] = useState(null);
  const [assignableWardens, setAssignableWardens] = useState([]);
  const [assignableStaff, setAssignableStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ userId: "", name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const availableUsers = activeTab === "wardens" ? assignableWardens : assignableStaff;
  const hostelLabel = useMemo(() => {
    if (!hostel) return "Assigned Hostel";
    return `${hostel.hostel_name} (${hostel.type})`;
  }, [hostel]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [hostels, wardenRows, staffRows, availableWardenRows, availableStaffRows] = await Promise.all([
        getAllHostels(),
        getAdminWardens(),
        getAdminOfficeStaff(),
        getAdminAssignableUsers("WARDEN"),
        getAdminAssignableUsers("STAFF"),
      ]);

      setHostel(hostels?.[0] || null);
      setWardens(wardenRows || []);
      setStaff(staffRows || []);
      setAssignableWardens(availableWardenRows || []);
      setAssignableStaff(availableStaffRows || []);
    } catch (loadError) {
      console.error("Failed to load warden/staff management data", loadError);
      setError(loadError.response?.data?.message || loadError.response?.data?.error || "Failed to load page data");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ userId: "", name: "", phone: "", email: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ userId: String(item.user_id || ""), name: item.name || "", phone: item.phone || "", email: item.email || "" });
    setError("");
    setShowModal(true);
  };

  const handleUserSelect = (userId) => {
    const selected = availableUsers.find((user) => String(user.user_id) === userId);
    setForm((prev) => ({
      ...prev,
      userId,
      email: selected?.email || "",
      name: prev.name || (selected?.email ? selected.email.split("@")[0] : ""),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!editItem && !form.userId && !form.email.trim()) {
      setError("Email is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        userId: form.userId ? Number(form.userId) : undefined,
        email: form.email.trim(),
        name: form.name.trim(),
        phone: form.phone.trim(),
      };

      if (activeTab === "wardens") {
        if (editItem) {
          await updateAdminWarden(editItem.warden_id, payload);
        } else {
          await createAdminWarden(payload);
        }
      } else if (editItem) {
        await updateAdminOfficeStaff(editItem.staff_id, payload);
      } else {
        await createAdminOfficeStaff(payload);
      }

      setShowModal(false);
      await loadData();
    } catch (saveError) {
      console.error("Failed to save warden/staff", saveError);
      setError(saveError.response?.data?.message || saveError.response?.data?.error || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`Remove ${item.name} from ${activeTab === "wardens" ? "wardens" : "staff"}?`);
    if (!confirmed) return;

    try {
      if (activeTab === "wardens") {
        await deleteAdminWarden(item.warden_id);
      } else {
        await deleteAdminOfficeStaff(item.staff_id);
      }

      await loadData();
    } catch (deleteError) {
      console.error("Failed to delete warden/staff", deleteError);
      setError(deleteError.response?.data?.message || deleteError.response?.data?.error || "Failed to remove entry");
    }
  };

  const uncoveredHostels = hostel && wardens.length === 0 ? [hostelLabel] : [];

  if (loading) {
    return (
      <AdminLayout>
        <div className="rounded-2xl bg-white border border-gray-100 p-8 text-sm text-gray-500">Loading wardens and staff...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Warden & Staff Management</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage live warden and office staff assignments for {hostelLabel}</p>
        </div>
        {(activeTab !== "wardens" || wardens.length === 0) && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md"
          >
            ➕ Add {activeTab === "wardens" ? "Warden" : "Staff"}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {[
          { label: "Wardens", value: wardens.length, cls: "bg-teal-50 text-teal-700" },
          { label: "Staff Members", value: staff.length, cls: "bg-emerald-50 text-emerald-700" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 ${s.cls} text-center`}>
            <p className="text-3xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 w-fit">
        {["wardens", "staff"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab === "wardens" ? "🛡️ Wardens" : "👤 Office Staff"}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Wardens Tab */}
      {activeTab === "wardens" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {wardens.map((w) => (
            <div key={w.warden_id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0">
                  {(w.name || "W").trim()[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{w.name}</h3>
                      <span className="inline-block bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                        🏨 {w.hostel_name} ({w.type})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(w)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-xl transition-colors">✏️</button>
                      <button onClick={() => handleDelete(w)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">🗑️</button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm text-gray-500">
                    <p>📞 {w.phone || "Not added"}</p>
                    <p>✉️ {w.email}</p>
                    <p>🆔 User #{w.user_id}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Unassigned Hostel Notice */}
          {uncoveredHostels.map(h => (
            <div key={h} className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <p className="text-3xl mb-2">⚠️</p>
              <p className="font-bold text-amber-700">{h}</p>
              <p className="text-amber-600 text-sm mt-1">No warden assigned</p>
              <button onClick={openAdd} className="mt-3 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
                Assign Warden
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === "staff" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs font-semibold">
                  <th className="px-5 py-3">Staff Member</th>
                  <th className="px-5 py-3">Hostel</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staff.map((s) => (
                  <tr key={s.staff_id} className="hover:bg-teal-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {s.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{s.name}</p>
                          <p className="text-gray-400 text-xs">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-xs font-semibold">{s.hostel_name} ({s.type})</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{s.phone || "Not added"}</td>
                    <td className="px-5 py-3">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{s.role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors">✏️</button>
                        <button onClick={() => handleDelete(s)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-sm text-gray-400">No office staff assigned to this hostel.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                {editItem ? "Edit" : "Add"} {activeTab === "wardens" ? "Warden" : "Staff Member"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {!editItem && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Select User</label>
                  <select
                    value={form.userId}
                    onChange={(e) => handleUserSelect(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                  >
                    <option value="">Choose a {activeTab === "wardens" ? "warden" : "staff"} user</option>
                    {availableUsers.map((user) => (
                      <option key={user.user_id} value={user.user_id}>{user.email}</option>
                    ))}
                  </select>
                </div>
              )}
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Phone Number", key: "phone", type: "tel" },
                { label: "Email", key: "email", type: "email", readOnly: !!editItem },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (f.key === "email") {
                        const matchedUser = availableUsers.find(
                          (user) => user.email.toLowerCase() === val.trim().toLowerCase()
                        );
                        setForm((prev) => ({
                          ...prev,
                          email: val,
                          userId: matchedUser ? String(matchedUser.user_id) : "",
                        }));
                      } else {
                        setForm((prev) => ({ ...prev, [f.key]: val }));
                      }
                    }}
                    readOnly={f.readOnly}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Assigned Hostel</label>
                <input
                  value={hostelLabel}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
              <button disabled={saving} onClick={handleSave} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white rounded-xl text-sm font-semibold transition-colors">
                {saving ? "Saving..." : editItem ? "Save Changes" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
