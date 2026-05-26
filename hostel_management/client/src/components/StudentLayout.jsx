import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/student", label: "Dashboard", icon: "⊞" },
  { path: "/student/complaints", label: "Complaints", icon: "📋" },
  { path: "/student/lost-found", label: "Lost & Found", icon: "🔍" },
  { path: "/student/visitors", label: "Visitor Requests", icon: "👥" },
  { path: "/student/id-card", label: "ID Card", icon: "🪪" },
];

const pageTitles = {
  "/student": "Dashboard",
  "/student/complaints": "Complaints",
  "/student/lost-found": "Lost & Found",
  "/student/visitors": "Visitor Requests",
  "/student/id-card": "ID Card",
  "/student/profile": "My Profile",
  "/student/edit-profile": "Edit Profile",
  "/student/change-password": "Change Password",
};

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Retrieve user details from localStorage
  let displayUser = {};
  try {
    if (localStorage.getItem("user")) {
      displayUser = JSON.parse(localStorage.getItem("user"));
    }
  } catch (e) {
    console.error("Failed to parse stored user", e);
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl z-20 shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-teal-700">
          <div className="w-9 h-9 bg-emerald-400 rounded-xl flex items-center justify-center text-teal-900 font-black text-lg shrink-0">
            H
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-white text-sm leading-tight">Hostel Portal</p>
              <p className="text-teal-300 text-xs">Student Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-teal-300 hover:text-white transition-colors"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl mb-1 transition-all duration-200 group
                  ${
                    active
                      ? "bg-emerald-400 text-teal-900 font-semibold shadow-lg"
                      : "text-teal-200 hover:bg-teal-700 hover:text-white"
                  }`}
              >
                <span className="text-lg shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm truncate">{item.label}</span>
                )}
                {active && sidebarOpen && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-900" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card / Logout */}
        <div className="p-4 border-t border-teal-700 flex flex-col gap-3">
          {sidebarOpen && (
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-teal-800/50 p-2 rounded-xl transition-colors"
              onClick={() => navigate("/student/profile")}
            >
              <img
                src={displayUser.profile_image || "https://i.pravatar.cc/100"}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400 shrink-0"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">
                  {displayUser.name || "Guest"}
                </p>
                <p className="text-xs text-teal-300 truncate">
                  {displayUser.email || ""}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-teal-300 hover:bg-red-500 hover:text-white transition-all duration-200 ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {pageTitles[location.pathname] || "Student Portal"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 w-52"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔎</span>
            </div>
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <img
                src={displayUser.profile_image || "https://i.pravatar.cc/100"}
                alt="profile"
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-teal-400 hover:ring-emerald-400 transition-all"
              />
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in">
                  <p
                    onClick={() => {
                      navigate("/student/profile");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors font-medium flex items-center gap-2"
                  >
                    👤 Profile
                  </p>
                  <p
                    onClick={() => {
                      navigate("/student/change-password");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors font-medium flex items-center gap-2"
                  >
                    🔑 Password
                  </p>
                  <hr className="border-gray-100" />
                  <p
                    onClick={handleLogout}
                    className="px-4 py-3 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors font-medium flex items-center gap-2"
                  >
                    🚪 Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
