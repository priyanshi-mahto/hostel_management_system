// import React, { useEffect, useState } from "react";
// import Header from "../../components/Header";
// import Sidebar from "../../components/Sidebar";
// import StatsCards from "../../components/StatsCard";
// import Tabs from "../../components/Tabs";
// import SearchBar from "../../components/SearchBar";
// import ItemCard from "../../components/ItemCard";
// import { getAllItems, getStats } from "../../api/lostFound";
// import "../../styles/lostfound.css";

// const LostFound = () => {
//   const [items, setItems] = useState([]);
//   const [stats, setStats] = useState({});
//   const [activeTab, setActiveTab] = useState("Active");
//   const [search, setSearch] = useState("");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   let storedUser = {};
//   try {
//     storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//   } catch (error) {
//     console.error("Failed to parse stored user", error);
//   }

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [itemsData, statsData] = await Promise.all([getAllItems(), getStats()]);
//       setItems(itemsData);
//       setStats(statsData);
//     } catch (error) {
//       console.error("Failed to load lost and found data", error);
//       setItems([]);
//       setStats({ total: 0, active: 0, claimed: 0, latestDate: "No data" });
//     }
//   };

//   const filteredItems = items
//     .filter((item) =>
//       activeTab === "All"
//         ? true
//         : (item.status || "").toLowerCase() === activeTab.toLowerCase()
//     )
//     .filter((item) =>
//       (item.title || "").toLowerCase().includes(search.toLowerCase())
//     );

//   return (
//     <div className="container">
//       <Header
//         onMenuClick={() => setMenuOpen(true)}
//         user={storedUser}
//         profileOpen={profileOpen}
//         setProfileOpen={setProfileOpen}
//       />

//       <Sidebar
//         open={menuOpen}
//         onClose={() => setMenuOpen(false)}
//         user={storedUser}
//       />

//       <h2>Lost and Found</h2>

//       <StatsCards stats={stats} />

//       <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

//       <SearchBar search={search} setSearch={setSearch} />

//       <div className="list">
//         {filteredItems.map((item) => (
//           <ItemCard key={item._id} item={item} />
//         ))}
//         {filteredItems.length === 0 && (
//           <p className="empty-text">No lost and found items found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LostFound;

import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import { getAllItems, getStats } from "../../api/lostFound";
import { FiCalendar, FiBox, FiCheckCircle, FiTag, FiSearch } from "react-icons/fi";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  claimed: "bg-blue-100 text-blue-700",
  lost: "bg-red-100 text-red-600",
  found: "bg-teal-100 text-teal-700",
};

function ItemCard({ item }) {
  const key = (item.status || "").toLowerCase();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-gray-800 leading-tight">{item.title}</h4>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyles[key] || "bg-gray-100 text-gray-600"}`}>
          {item.status}
        </span>
      </div>
      <p className="text-xs text-gray-400 font-mono">ID: {item._id}</p>
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <FiCalendar className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {new Date(item.date).toDateString()}
      </p>
      <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-2">{item.description}</p>
    </div>
  );
}

const TABS = ["All", "Active", "Claimed"];

const statConfig = [
  { key: "total",      label: "Total Items",  icon: <FiBox className="w-5 h-5" />, color: "bg-teal-50 text-teal-700 border-teal-100" },
  { key: "active",     label: "Active",       icon: <FiCheckCircle className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { key: "claimed",    label: "Claimed",      icon: <FiTag className="w-5 h-5" />, color: "bg-blue-50 text-blue-700 border-blue-100" },
  { key: "latestDate", label: "Latest",       icon: <FiCalendar className="w-5 h-5" />, color: "bg-purple-50 text-purple-700 border-purple-100" },
];

const LostFound = () => {
  const [items, setItems]           = useState([]);
  const [stats, setStats]           = useState({});
  const [activeTab, setActiveTab]   = useState("Active");
  const [search, setSearch]         = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [itemsData, statsData] = await Promise.all([getAllItems(), getStats()]);
      setItems(itemsData);
      setStats(statsData);
    } catch {
      setItems([]);
      setStats({ total: 0, active: 0, claimed: 0, latestDate: "No data" });
    }
  };

  const filteredItems = items
    .filter((item) =>
      activeTab === "All" ? true : (item.status || "").toLowerCase() === activeTab.toLowerCase()
    )
    .filter((item) =>
      (item.title || "").toLowerCase().includes(search.toLowerCase())
    );

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Description */}
        <div>
          <p className="text-sm text-gray-400">Browse and search for lost or found items</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statConfig.map(({ key, label, icon, color }) => (
            <div key={key} className={`rounded-2xl border p-4 flex flex-col gap-1 ${color}`}>
              <span className="text-xl">{icon}</span>
              <h3 className="text-xl font-black">{stats[key] ?? "—"}</h3>
              <p className="text-xs font-medium opacity-80">{label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 w-full text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Items */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <FiSearch className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-700 text-lg">No items found</h3>
            <p className="text-sm text-gray-400 mt-1">Try changing the filter or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

      </div>
    </StudentLayout>
  );
}

export default LostFound;