// ─── SearchBar.jsx ───────────────────────────────────────────────────────────
import React from "react";

export const SearchBar = ({ search, setSearch }) => {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔎</span>
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9 pr-4 py-2.5 w-full sm:w-64 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
      />
    </div>
  );
};

// ─── Tabs.jsx ─────────────────────────────────────────────────────────────────
export const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      {["All", "Active", "Claimed"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === tab
              ? "bg-white text-teal-700 shadow-sm font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// ─── ItemCard.jsx ─────────────────────────────────────────────────────────────
const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  claimed: "bg-blue-100 text-blue-700",
  lost: "bg-red-100 text-red-600",
  found: "bg-teal-100 text-teal-700",
};

export const ItemCard = ({ item }) => {
  const statusKey = (item.status || "").toLowerCase();
  const statusClass = statusStyles[statusKey] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-800 leading-tight">{item.title}</h4>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusClass}`}>
          {item.status}
        </span>
      </div>

      <p className="text-xs text-gray-400 font-mono">ID: {item._id}</p>
      <p className="text-xs text-gray-400">📅 {new Date(item.date).toDateString()}</p>

      <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-2 mt-1">
        {item.description}
      </p>
    </div>
  );
};

// ─── StatsCard.jsx ────────────────────────────────────────────────────────────
const statConfig = [
  { key: "total", label: "Total Items", icon: "📦", color: "bg-teal-50 text-teal-700" },
  { key: "active", label: "Active Items", icon: "✅", color: "bg-emerald-50 text-emerald-700" },
  { key: "claimed", label: "Claimed", icon: "🏷️", color: "bg-blue-50 text-blue-700" },
  { key: "latestDate", label: "Latest", icon: "📅", color: "bg-purple-50 text-purple-700" },
];

export const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {statConfig.map(({ key, label, icon, color }) => (
        <div
          key={key}
          className={`rounded-2xl p-4 flex flex-col gap-1 ${color} border border-white/60`}
        >
          <span className="text-xl">{icon}</span>
          <h3 className="text-xl font-bold leading-tight">{stats[key]}</h3>
          <p className="text-xs font-medium opacity-80">{label}</p>
        </div>
      ))}
    </div>
  );
};
