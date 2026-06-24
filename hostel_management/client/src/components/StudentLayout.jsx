import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { getStudentProfile } from "../api/student.api";
import {
  FiGrid,
  FiFileText,
  FiSearch,
  FiUsers,
  FiCreditCard,
  FiUser,
  FiKey,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

const navItems = [
  { path: "/student", label: "Dashboard", icon: <FiGrid className="w-4 h-4" /> },
  { path: "/student/complaints", label: "Complaints", icon: <FiFileText className="w-4 h-4" /> },
  { path: "/student/lost-found", label: "Lost & Found", icon: <FiSearch className="w-4 h-4" /> },
  { path: "/student/visitors", label: "Visitor Requests", icon: <FiUsers className="w-4 h-4" /> },
  { path: "/student/id-card", label: "ID Card", icon: <FiCreditCard className="w-4 h-4" /> },
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

  const [userProfile, setUserProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    getStudentProfile()
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile(data);
      })
      .catch((err) => console.error("Failed to refresh layout profile:", err));
  }, []);

  const apiBase = (axios.defaults?.baseURL || "http://localhost:5001/api").replace(/\/+api\/?$/i, "");
  const avatarUrl = userProfile.profile_image
    ? (userProfile.profile_image.startsWith("http") ? userProfile.profile_image : `${apiBase}/uploads/profile/${userProfile.profile_image}`)
    : null;

  const renderAvatar = (sizeClass = "w-9 h-9", ringClass = "ring-2 ring-teal-400", extraClass = "", onClick = null) => {
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt="profile"
          onClick={onClick}
          className={`${sizeClass} rounded-full object-cover ${ringClass} shrink-0 ${extraClass}`}
        />
      );
    }
    const initial = userProfile.name ? userProfile.name.trim().charAt(0).toUpperCase() : "?";
    return (
      <div
        onClick={onClick}
        className={`${sizeClass} rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center shrink-0 uppercase ${ringClass} ${extraClass}`}
      >
        {initial}
      </div>
    );
  };

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
            {sidebarOpen ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
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
              {renderAvatar("w-9 h-9", "ring-2 ring-emerald-400", "text-sm")}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">
                  {userProfile.name || "Guest"}
                </p>
                <p className="text-xs text-teal-300 truncate">
                  {userProfile.email || ""}
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
            <FiLogOut className="text-lg shrink-0" />
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
              <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            </div>
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {renderAvatar(
                "w-9 h-9",
                "ring-2 ring-teal-400 hover:ring-emerald-400",
                "cursor-pointer transition-all",
                () => setProfileOpen(!profileOpen)
              )}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in">
                  <p
                    onClick={() => {
                      navigate("/student/profile");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors font-medium flex items-center gap-2"
                  >
                    <FiUser className="w-4 h-4" /> Profile
                  </p>
                  <p
                    onClick={() => {
                      navigate("/student/change-password");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors font-medium flex items-center gap-2"
                  >
                    <FiKey className="w-4 h-4" /> Password
                  </p>
                  <hr className="border-gray-100" />
                  <p
                    onClick={handleLogout}
                    className="px-4 py-3 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors font-medium flex items-center gap-2"
                  >
                    <FiLogOut className="w-4 h-4" /> Logout
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
