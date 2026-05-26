import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
  { path: "/admin/students", label: "Students", icon: "🎓" },
  { path: "/admin/rooms", label: "Room Allocation", icon: "🏠" },
  { path: "/admin/complaints", label: "Complaints", icon: "📋" },
  { path: "/admin/visitors", label: "Visitor Requests", icon: "👥" },
  { path: "/admin/staff", label: "Warden & Staff", icon: "👤" },
  { path: "/admin/id-cards", label: "ID Verification", icon: "🪪" },
  { path: "/admin/lost-found", label: "Lost & Found", icon: "🔍" },
  { path: "/admin/notifications", label: "Notifications", icon: "🔔" },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
              <p className="font-bold text-white text-sm leading-tight">Hostel Admin</p>
              <p className="text-teal-300 text-xs">Management Portal</p>
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
                  ${active
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

        {/* Logout */}
        <div className="p-4 border-t border-teal-700">
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
              {navItems.find((n) => n.path === location.pathname)?.label || "Admin Panel"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
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
            <div className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
