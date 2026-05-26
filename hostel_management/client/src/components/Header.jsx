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
