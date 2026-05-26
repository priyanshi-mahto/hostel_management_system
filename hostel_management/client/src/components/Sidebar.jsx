// import { useNavigate, useLocation } from "react-router-dom";
// import "../styles/sidebar.css";

// export default function Sidebar({ open, onClose, user }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   let displayUser = user || {};
//   try {
//     if ((!displayUser || Object.keys(displayUser).length === 0) && localStorage.getItem("user")) {
//       displayUser = JSON.parse(localStorage.getItem("user"));
//     }
//   } catch (e) {
//     console.error("Failed to parse stored user", e);
//   }

//   return (
//     <>
//      {/* OVERLAY */}
//       {open && <div className="sidebar-overlay" onClick={onClose}></div>}
//     <aside className={`sidebar ${open ? "open" : ""}`}>

//       <button className="close-btn" onClick={onClose}>
//         ✕
//       </button>

//       <ul className="sidebar-menu">
//         <li className={location.pathname === "/student" ? "active" : ""} onClick={() => navigate("/student")}>Dashboard</li>
//         <li className={location.pathname === "/student/complaints" ? "active" : ""} onClick={() => navigate("/student/complaints")}>Complaints</li>
//         <li className={location.pathname === "/student/lost-found" ? "active" : ""} onClick={() => navigate("/student/lost-found")}>Lost & Found</li>
//         <li className={location.pathname === "/student/visitors" ? "active" : ""} onClick={() => navigate("/student/visitors")}>Visitors</li>
//         <li className={location.pathname === "/student/id-card" ? "active" : ""} onClick={() => navigate("/student/id-card")}>ID Card</li>
//       </ul>

//       <div 
//         className="sidebar-user"
//         onClick={() => {
//           navigate("/student/profile");
//         }}
//         style={{ cursor: "pointer" }}
//       >
//         <img
//           src={(displayUser && displayUser.profile_image) || "https://i.pravatar.cc/100"}
//           alt="profile"
//         />
//         <div>
//           <p className="name">{(displayUser && displayUser.name) || "Guest"}</p>
//           <p className="email">{(displayUser && displayUser.email) || ""}</p>
//         </div>
//       </div>

//     </aside>
//     </>
//   );
// }


import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { path: "/student", label: "Dashboard", icon: "⊞" },
  { path: "/student/complaints", label: "Complaints", icon: "📋" },
  { path: "/student/lost-found", label: "Lost & Found", icon: "🔍" },
  { path: "/student/visitors", label: "Visitors", icon: "👥" },
  { path: "/student/id-card", label: "ID Card", icon: "🪪" },
];

export default function Sidebar({ open, onClose, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  let displayUser = user || {};
  try {
    if ((!displayUser || Object.keys(displayUser).length === 0) && localStorage.getItem("user")) {
      displayUser = JSON.parse(localStorage.getItem("user"));
    }
  } catch (e) {
    console.error("Failed to parse stored user", e);
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white flex flex-col z-40 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-teal-700">
          <div className="w-9 h-9 bg-emerald-400 rounded-xl flex items-center justify-center text-teal-900 font-black text-lg shrink-0">
            H
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Hostel Portal</p>
            <p className="text-teal-300 text-xs">Student Dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-teal-300 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); onClose(); }}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl mb-1 w-[calc(100%-16px)] text-left transition-all duration-200
                  ${active
                    ? "bg-emerald-400 text-teal-900 font-semibold shadow-lg"
                    : "text-teal-200 hover:bg-teal-700 hover:text-white"
                  }`}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                <span className="text-sm truncate">{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-900" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div
          className="p-4 border-t border-teal-700 flex items-center gap-3 cursor-pointer hover:bg-teal-700/50 transition-colors rounded-xl mx-2 mb-2"
          onClick={() => { navigate("/student/profile"); onClose(); }}
        >
          <img
            src={(displayUser && displayUser.profile_image) || "https://i.pravatar.cc/100"}
            alt="profile"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400 shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">
              {(displayUser && displayUser.name) || "Guest"}
            </p>
            <p className="text-xs text-teal-300 truncate">
              {(displayUser && displayUser.email) || ""}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
