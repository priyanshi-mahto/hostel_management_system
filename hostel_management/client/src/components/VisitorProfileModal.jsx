// import React, { useState } from "react";
// import { createVisitorProfile } from "../api/visitor.api";

// const VisitorProfileModal = ({ onClose, onSaved }) => {
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     relation: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSave = async () => {
//     if (!form.name || !form.phone || !form.relation) {
//       setError("Name, phone and relation are required.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       await createVisitorProfile(form);
//       onSaved && (await onSaved());
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to save visitor profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <h2>Add Visitor Profile</h2>

//         <label>Visitor Name *</label>
//         <input type="text" name="name" value={form.name} onChange={handleChange} />

//         <label>Phone Number *</label>
//         <input type="text" name="phone" value={form.phone} onChange={handleChange} />

//         <label>Email Address</label>
//         <input type="email" name="email" value={form.email} onChange={handleChange} />

//         <label>Relation with Student *</label>
//         <select name="relation" value={form.relation} onChange={handleChange}>
//           <option value="">Select relation</option>
//           <option>Parent</option>
//           <option>Sibling</option>
//           <option>Guardian</option>
//           <option>Relative</option>
//           <option>Friend</option>
//           <option>Other</option>
//         </select>

//         {error && <p className="form-error">{error}</p>}

//         <div className="modal-actions">
//           <button onClick={onClose}>Cancel</button>
//           <button className="primary" onClick={handleSave} disabled={loading}>
//             {loading ? "Saving..." : "Save Profile"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VisitorProfileModal;



import React, { useEffect, useMemo, useState } from "react";
import { createVisitorProfile, getVisitorProfiles } from "../api/visitor.api";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all";

export const VisitorProfileModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", relation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.relation) {
      setError("Name, phone and relation are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createVisitorProfile(form);
      onSaved && (await onSaved());
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save visitor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-emerald-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Add Visitor Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5">Save a contact for future visit requests</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Visitor Name *
            </label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full name" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Phone Number *
            </label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Email Address
            </label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Optional" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Relation with Student *
            </label>
            <select name="relation" value={form.relation} onChange={handleChange} className={inputClass}>
              <option value="">Select relation</option>
              {["Parent", "Sibling", "Guardian", "Relative", "Friend", "Other"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-md shadow-teal-100"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ManageProfilesModal.jsx ──────────────────────────────────────────────────
export const ManageProfilesModal = ({ onClose }) => {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getVisitorProfiles().then(setProfiles).catch(console.error);
  }, []);

  const filteredProfiles = useMemo(() => {
    const query = search.toLowerCase();
    return profiles.filter((p) =>
      [p.name, p.relation, p.email, p.phone]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(query))
    );
  }, [profiles, search]);

  const relationColors = {
    Parent: "bg-blue-100 text-blue-700",
    Sibling: "bg-purple-100 text-purple-700",
    Guardian: "bg-orange-100 text-orange-700",
    Relative: "bg-teal-100 text-teal-700",
    Friend: "bg-pink-100 text-pink-700",
    Other: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-emerald-50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Visitor Profiles</h2>
            <p className="text-xs text-gray-400 mt-0.5">{profiles.length} saved contacts</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔎</span>
            <input
              type="text"
              placeholder="Search by name, relation, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">👤</p>
              <p className="text-sm font-semibold text-gray-600">No profiles found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
            </div>
          ) : (
            filteredProfiles.map((profile) => (
              <div
                key={profile.visitor_id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all"
              >
                <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                  {profile.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{profile.name}</p>
                  <p className="text-xs text-gray-400">{profile.phone}</p>
                  {profile.email && <p className="text-xs text-gray-400 truncate">{profile.email}</p>}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${relationColors[profile.relation] || "bg-gray-100 text-gray-600"}`}>
                  {profile.relation}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
