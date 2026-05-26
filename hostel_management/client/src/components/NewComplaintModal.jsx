// import { useState } from "react";
// import axios from "../api/axios";

// export default function NewComplaintModal({ onClose, onSubmitted }) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!title.trim() || !description.trim() || !category.trim()) {
//       alert("Please fill all fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post("/student/complaint", {
//         category,
//         title,
//         description,
//       });
//       alert("Complaint submitted");
//       onSubmitted && onSubmitted();
//     } catch (err) {
//       console.error("Submit complaint failed", err);
//       alert("Failed to submit complaint");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal">

//         <div className="modal-header">
//           <h2>Submit New Complaint</h2>
//           <button onClick={onClose}>✕</button>
//         </div>

//         <div className="modal-body">
//           <div className="form-group">
//             <label>Complaint Title</label>
//             <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief summary of the issue" />
//           </div>

//           <div className="form-group">
//             <label>Description</label>
//             <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please provide details..." />
//           </div>

//           <div className="form-group">
//             <label>Category</label>
//             <select value={category} onChange={(e) => setCategory(e.target.value)}>
//               <option value="">Select Category</option>
//               <option value="Plumbing">Plumbing</option>
//               <option value="Electrical">Electrical</option>
//               <option value="Internet">Internet</option>
//               <option value="Cleanliness">Cleanliness</option>
//               <option value="Civil">Civil</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//         </div>

//         <div className="modal-footer">
//           <button className="cancel-btn" onClick={onClose} disabled={loading}>
//             Cancel
//           </button>
//           <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
//             {loading ? "Submitting..." : "Submit Complaint"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick, user, profileOpen, setProfileOpen }) {
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = typeof profileOpen === "boolean" ? profileOpen : internalOpen;
  const setOpen = typeof setProfileOpen === "function" ? setProfileOpen : setInternalOpen;

  let displayUser = user || {};
  try {
    if ((!displayUser || Object.keys(displayUser).length === 0) && localStorage.getItem("user")) {
      displayUser = JSON.parse(localStorage.getItem("user"));
    }
  } catch (e) {
    console.error("Failed to parse stored user", e);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setOpen]);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors text-lg"
      >
        ☰
      </button>

      {/* Title */}
      <h2 className="text-base font-bold text-gray-800 tracking-tight">
        Hostel Management System
      </h2>

      {/* Profile */}
      <div className="relative" ref={dropdownRef}>
        <img
          src={(displayUser && displayUser.profile_image) || "https://i.pravatar.cc/100"}
          alt="profile"
          onClick={() => setOpen(!isOpen)}
          className="w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-teal-400 hover:ring-emerald-400 transition-all"
        />

        {isOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in">
            <p
              onClick={() => { navigate("/student/profile"); setOpen(false); }}
              className="px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors font-medium"
            >
              👤 Profile
            </p>
            <hr className="border-gray-100" />
            <p
              onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
              className="px-4 py-3 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors font-medium"
            >
              🚪 Logout
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
