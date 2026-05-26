// import React, { useEffect, useState } from "react";
// import { createVisitorRequest, getVisitorProfiles } from "../api/visitor.api";

// const CreateRequestModal = ({ onClose, onSaved }) => {
//   const [profiles, setProfiles] = useState([]);
//   const [selectedVisitors, setSelectedVisitors] = useState([]);
//   const [form, setForm] = useState({
//     from_date: "",
//     to_date: "",
//     reason: "",
//   });
//   const [error, setError] = useState("");

//   /* ------------------ FETCH PROFILES ------------------ */
//   useEffect(() => {
//     const fetchProfiles = async () => {
//       try {
//         const res = await getVisitorProfiles();
//         setProfiles(res);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchProfiles();
//   }, []);

//   /* ------------------ HANDLE INPUT ------------------ */
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* ------------------ TOGGLE VISITOR ------------------ */
//   const toggleVisitor = (id) => {
//     setSelectedVisitors((prev) =>
//       prev.includes(id)
//         ? prev.filter((v) => v !== id)
//         : [...prev, id]
//     );
//   };

//   /* ------------------ SUBMIT ------------------ */
//   const handleSubmit = async () => {
//     try {
//       if (!form.from_date || !form.to_date || !form.reason || selectedVisitors.length === 0) {
//         setError("Please select visitors and fill all request fields.");
//         return;
//       }

//       setError("");

//       await createVisitorRequest({
//         ...form,
//         visitor_ids: selectedVisitors,
//       });

//       onSaved && (await onSaved());
//       onClose();
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Error submitting request");
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal large">
//         <div className="modal-header">
//           <h2>Create Visitor Request</h2>
//           <button onClick={onClose}>✕</button>
//         </div>

//         {/* Select Visitors */}
//         <div className="section">
//           <div className="section-header">
//             <h4>Select Visitors</h4>
//           </div>

//           {profiles.length === 0 ? (
//             <div className="empty-box">
//               No visitor profiles found. Add some profiles first.
//             </div>
//           ) : (
//             profiles.map((p) => (
//               <label key={p.visitor_id} className="checkbox">
//                 <input
//                   type="checkbox"
//                   checked={selectedVisitors.includes(p.visitor_id)}
//                   onChange={() => toggleVisitor(p.visitor_id)}
//                 />
//                 {p.name} ({p.relation})
//               </label>
//             ))
//           )}
//         </div>

//         {/* Dates */}
//         <div className="section">
//           <label>From Date *</label>
//           <input
//             type="date"
//             name="from_date"
//             value={form.from_date}
//             onChange={handleChange}
//           />
//           <small>Must be at least 2 days from today</small>
//         </div>

//         <div className="section">
//           <label>To Date *</label>
//           <input
//             type="date"
//             name="to_date"
//             value={form.to_date}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Reason */}
//         <div className="section">
//           <label>Reason for Visit *</label>
//           <textarea
//             name="reason"
//             placeholder="Please provide details about the purpose of the visit"
//             value={form.reason}
//             onChange={handleChange}
//           />
//         </div>

//         {error && <p className="form-error">{error}</p>}

//         {/* Actions */}
//         <div className="modal-actions">
//           <button onClick={onClose}>Cancel</button>
//           <button className="primary" onClick={handleSubmit}>
//             Submit Request
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRequestModal;


import React, { useEffect, useState } from "react";
import { createVisitorRequest, getVisitorProfiles } from "../api/visitor.api";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all";

const CreateRequestModal = ({ onClose, onSaved }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [form, setForm] = useState({ from_date: "", to_date: "", reason: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    getVisitorProfiles()
      .then(setProfiles)
      .catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleVisitor = (id) => {
    setSelectedVisitors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!form.from_date || !form.to_date || !form.reason || selectedVisitors.length === 0) {
      setError("Please select visitors and fill all request fields.");
      return;
    }
    setError("");
    try {
      await createVisitorRequest({ ...form, visitor_ids: selectedVisitors });
      onSaved && (await onSaved());
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Error submitting request");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-emerald-50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Create Visitor Request</h2>
            <p className="text-xs text-gray-400 mt-0.5">Schedule a visit from your contacts</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Select Visitors */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Select Visitors
            </p>
            {profiles.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-2xl mb-1">👤</p>
                <p className="text-sm text-gray-500">No visitor profiles found.</p>
                <p className="text-xs text-gray-400">Add some profiles first.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {profiles.map((p) => (
                  <label
                    key={p.visitor_id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      selectedVisitors.includes(p.visitor_id)
                        ? "border-teal-400 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVisitors.includes(p.visitor_id)}
                      onChange={() => toggleVisitor(p.visitor_id)}
                      className="accent-teal-600 w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.relation}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                From Date *
              </label>
              <input type="date" name="from_date" value={form.from_date} onChange={handleChange} className={inputClass} />
              <p className="text-xs text-gray-400">Min. 2 days from today</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                To Date *
              </label>
              <input type="date" name="to_date" value={form.to_date} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Reason for Visit *
            </label>
            <textarea
              name="reason"
              placeholder="Please provide details about the purpose of the visit"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-md shadow-teal-100"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestModal;
