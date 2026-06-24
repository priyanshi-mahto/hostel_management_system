// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import "../styles/header.css";

// export default function Header({
//   onMenuClick,
//   user,
//   profileOpen,
//   setProfileOpen,
// }) {
//   const navigate = useNavigate();
//   const dropdownRef = useRef();
//   const [internalOpen, setInternalOpen] = useState(false);

//   const isOpen = typeof profileOpen === "boolean" ? profileOpen : internalOpen;
//   const setOpen = typeof setProfileOpen === "function" ? setProfileOpen : setInternalOpen;

//   // Prefer passed `user`, otherwise fallback to stored user in localStorage
//   let displayUser = user || {};
//   try {
//     if ((!displayUser || Object.keys(displayUser).length === 0) && localStorage.getItem("user")) {
//       displayUser = JSON.parse(localStorage.getItem("user"));
//     }
//   } catch (e) {
//     console.error("Failed to parse stored user", e);
//   }

//   // CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, setOpen]);

//   return (
//     <header className="dash-header">

//       {/* MENU */}
//       <button className="menu-btn" onClick={onMenuClick}>
//         ☰
//       </button>

//       <h2>Hostel Management System</h2>

//       {/* PROFILE */}
//       <div className="profile-box" ref={dropdownRef}>
//         <img
//           src={(displayUser && displayUser.profile_image) || "https://i.pravatar.cc/100"}
//           alt="profile"
//           onClick={() => setOpen(!isOpen)}
//         />

//         {isOpen && (
//           <div className="profile-dropdown">
//             <p
//               onClick={() => {
//                 navigate("/student/profile");
//                 setProfileOpen && setProfileOpen(false);
//               }}
//             >
//               Profile
//             </p>
//             <p
//               className="logout"
//               onClick={() => {
//                 localStorage.clear();
//                 window.location.href = "/login";
//               }}
//             >
//               Logout
//             </p>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiUser, FiLogOut } from "react-icons/fi";

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
        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Title */}
      <h2 className="text-base font-bold text-gray-800 tracking-tight">
        Hostel Management System
      </h2>

      {/* Profile */}
      <div className="relative" ref={dropdownRef}>
        {displayUser && displayUser.profile_image ? (
          <img
            src={displayUser.profile_image.startsWith("http") ? displayUser.profile_image : `http://localhost:5001/uploads/profile/${displayUser.profile_image}`}
            alt="profile"
            onClick={() => setOpen(!isOpen)}
            className="w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-teal-400 hover:ring-emerald-400 transition-all"
          />
        ) : (
          <div
            onClick={() => setOpen(!isOpen)}
            className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center shrink-0 uppercase cursor-pointer ring-2 ring-teal-400 hover:ring-emerald-400 transition-all"
          >
            {displayUser.name ? displayUser.name.trim().charAt(0).toUpperCase() : "?"}
          </div>
        )}

        {isOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in">
            <p
              onClick={() => { navigate("/student/profile"); setOpen(false); }}
              className="px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors font-medium flex items-center gap-2"
            >
              <FiUser className="w-4 h-4 text-gray-500" /> Profile
            </p>
            <hr className="border-gray-100" />
            <p
              onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
              className="px-4 py-3 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors font-medium flex items-center gap-2"
            >
              <FiLogOut className="w-4 h-4 text-red-500" /> Logout
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
