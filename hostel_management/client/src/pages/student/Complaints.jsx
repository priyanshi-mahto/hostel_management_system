
// import { useState, useEffect } from "react";
// import Header from "../../components/Header";
// import Sidebar from "../../components/Sidebar";
// import axios from "../../api/axios";
// import "../../styles/complaints.css";
// import NewComplaintModal from "../../components/NewComplaintModal";

// import { FiList, FiFilter } from "react-icons/fi";
// import { BsGrid } from "react-icons/bs";

// export default function Complaints() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [view, setView] = useState("list");
//   const [showFilter, setShowFilter] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [complaints, setComplaints] = useState([]);
//   const [status, setStatus] = useState("ALL");

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const fetchComplaints = async () => {
//     try {
//       const res = await axios.get("/complaints/my");
//       setComplaints(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filtered = complaints.filter((c) => {
//     if (status === "ALL") return true;
//     return c.status === status;
//   });

//   return (
//     <>
//       <Header onMenuClick={() => setMenuOpen(true)} />
//       <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

//       <div className="complaints-container">

//         {/* TOP CONTROLS */}
//         <div className="top-controls">

//           <div className="view-toggle">
//             <button
//               className={view === "list" ? "active" : ""}
//               onClick={() => setView("list")}
//             >
//               <FiList />
//             </button>

//             <button
//               className={view === "grid" ? "active" : ""}
//               onClick={() => setView("grid")}
//             >
//               <BsGrid />
//             </button>
//           </div>

//           <button
//             className={`filter-btn ${showFilter ? "active" : ""}`}
//             onClick={() => setShowFilter(!showFilter)}
//           >
//             <FiFilter />
//           </button>

//           <button className="new-btn" onClick={() => setShowModal(true)}>+ New Complaint</button>
//         </div>

//         {/* FILTER PANEL */}
//         {showFilter && (
//           <div className="filter-panel">

//             <div className="filter-header">
//               <h3>Filters</h3>
//               <span className="reset" onClick={() => setStatus("ALL")}>
//                 ↻ Reset
//               </span>
//             </div>

//             <div className="filter-group">
//               <label>Status</label>
//               <select onChange={(e) => setStatus(e.target.value)}>
//                 <option value="ALL">All Complaints</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Resolved">Resolved</option>
//               </select>
//             </div>

//             <div className="filter-group">
//               <label>Category</label>
//               <select>
//                 <option>All Categories</option>
//                 <option>Plumbing</option>
//                 <option>Electricity</option>
//               </select>
//             </div>

//             <div className="filter-group">
//               <label>Feedback Rating</label>
//               <select>
//                 <option>All Ratings</option>
//               </select>
//             </div>

//             <div className="filter-group">
//               <label>Satisfaction Status</label>
//               <select>
//                 <option>All Statuses</option>
//               </select>
//             </div>

//             <div className="filter-group">
//               <label>Items per page</label>
//               <select>
//                 <option>10</option>
//                 <option>20</option>
//               </select>
//             </div>

//           </div>
//         )}

//         {view === "list" && (
//   filtered.length === 0 ? (
//     <div className="empty-box">
//       <div className="empty-icon">?</div>
//       <h3>No Data Found</h3>
//       <p>No complaints to display</p>
//     </div>
//   ) : (
//     <div className="list-box">
//       <div className="table-header">
//         <span>ID/TITLE</span>
//         <span>STATUS</span>
//       </div>

//       {filtered.map((c) => (
//         <div className="row" key={c.id}>
//           <div>
//             <p className="id">{c.id}</p>
//             <h4>{c.title}</h4>
//           </div>

//           <span className={`status ${c.status.toLowerCase()}`}>
//             {c.status}
//           </span>
//         </div>
//       ))}
//     </div>
//   )
// )}

// {view === "grid" && (
//   filtered.length === 0 ? (
//     <div className="empty-box">
//       <div className="empty-icon">?</div>
//       <h3>No Data Found</h3>
//       <p>No complaints to display</p>
//     </div>
//   ) : (
//     <div className="grid-box">
//       {filtered.map((c) => (
//         <div className="card" key={c.id}>
//           ...
//         </div>
//       ))}
//     </div>
//   )
// )}

//         {/* TABS */}
//         <div className="tabs">
//           <button
//             className={status === "ALL" ? "active" : ""}
//             onClick={() => setStatus("ALL")}
//           >
//             All Complaints <span className="count">{complaints.length}</span>
//           </button>

//           <button
//             className={status === "Pending" ? "active" : ""}
//             onClick={() => setStatus("Pending")}
//           >
//             Pending{" "}
//             <span className="count">
//               {complaints.filter((c) => c.status === "Pending").length}
//             </span>
//           </button>

//           <button
//             className={status === "Resolved" ? "active" : ""}
//             onClick={() => setStatus("Resolved")}
//           >
//             Resolved
//           </button>
//         </div>

//         {/* LIST VIEW */}
//         {view === "list" && (
//           <div className="list-box">
//             <div className="table-header">
//               <span>ID/TITLE</span>
//               <span>STATUS</span>
//             </div>

//             {filtered.map((c) => (
//               <div className="row" key={c.id}>
//                 <div>
//                   <p className="id">{c.id}</p>
//                   <h4>{c.title}</h4>
//                 </div>

//                 <span className={`status ${c.status.toLowerCase()}`}>
//                   {c.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* GRID VIEW */}
//         {view === "grid" && (
//           <div className="grid-box">
//             {filtered.map((c) => (
//               <div className="card" key={c.id}>

//                 <div className="status-row">
//                   <span className={`status ${c.status.toLowerCase()}`}>
//                     {c.status}
//                   </span>
//                 </div>

//                 <h3>{c.title}</h3>

//                 <p className="location">
//                   🏢 {c.block}, Room {c.room}
//                 </p>

//                 <p className="desc">{c.description}</p>

//                 <div className="meta">
//                   <span>🧩 {c.category}</span>
//                   <span>{c.days_ago} days ago</span>
//                 </div>

//                 <div className="user">
//                   <img src={c.user_image || "https://i.pravatar.cc/40"} alt="" />
//                   <div>
//                     <p>{c.user_name}</p>
//                     <small>Reporter</small>
//                   </div>
//                 </div>

//               </div>
//             ))}
//           </div>
//         )}

//         {/* PAGINATION */}
//         <div className="pagination">
//           <button>Previous</button>
//           <button className="active">1</button>
//           <button>Next</button>
//         </div>
//       {showModal && (
//         <NewComplaintModal onClose={() => setShowModal(false)} onSubmitted={() => { setShowModal(false); fetchComplaints(); }} />
//       )}
//       </div>
//     </>
//   );
// }





import { useState, useEffect } from "react";
import StudentLayout from "../../components/StudentLayout";
import axios from "../../api/axios";
import NewComplaintModal from "../../components/NewComplaintModal";

const statusStyles = {
  pending:     "bg-amber-100 text-amber-700 border-amber-200",
  resolved:    "bg-emerald-100 text-emerald-700 border-emerald-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  rejected:    "bg-red-100 text-red-600 border-red-200",
};

function StatusBadge({ status = "" }) {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[key] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

export default function Complaints() {
  const [view, setView]         = useState("list");
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [status, setStatus]         = useState("ALL");
  const [category, setCategory]     = useState("All Categories");

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchStatus   = status === "ALL" || c.status === status;
    const matchCategory = category === "All Categories" || c.category === category;
    return matchStatus && matchCategory;
  });

  const tabs = [
    { label: "All",         value: "ALL",         count: complaints.length },
    { label: "Pending",     value: "Pending",     count: complaints.filter(c => c.status === "Pending").length },
    { label: "In Progress", value: "In Progress", count: complaints.filter(c => c.status === "In Progress").length },
    { label: "Resolved",    value: "Resolved",    count: complaints.filter(c => c.status === "Resolved").length },
  ];

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-400">Track and manage your hostel complaints</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === "list" ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                ☰ List
              </button>
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === "grid" ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                ⊞ Grid
              </button>
            </div>

            {/* Filter */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${showFilter ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"}`}
            >
              🔽 Filter
            </button>

            {/* New Complaint */}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-md shadow-teal-100"
            >
              + New Complaint
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-700">Filters</p>
              <button
                onClick={() => { setStatus("ALL"); setCategory("All Categories"); }}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
              >
                ↻ Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="ALL">All Complaints</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option>All Categories</option>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Internet</option>
                  <option>Cleanliness</option>
                  <option>Civil</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                status === tab.value
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${status === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="font-bold text-gray-700 text-lg">No complaints found</h3>
            <p className="text-sm text-gray-400 mt-1">Try changing filters or submit a new complaint</p>
          </div>
        ) : view === "list" ? (
          /* LIST VIEW */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">ID / Title</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</span>
            </div>

            {filtered.map((c, i) => (
              <div
                key={c.id}
                className={`grid grid-cols-[1fr_auto] items-center px-5 py-4 gap-4 hover:bg-gray-50 transition-colors ${
                  i !== filtered.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div>
                  <p className="text-xs text-gray-400 font-mono mb-0.5">{c.id}</p>
                  <h4 className="text-sm font-semibold text-gray-800">{c.title}</h4>
                  {c.category && (
                    <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {c.category}
                    </span>
                  )}
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-800 leading-tight">{c.title}</h3>
                  <StatusBadge status={c.status} />
                </div>

                {c.block && (
                  <p className="text-xs text-gray-400">🏢 {c.block}, Room {c.room}</p>
                )}

                <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-2 line-clamp-3">
                  {c.description}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full font-medium">
                    🧩 {c.category}
                  </span>
                  <span className="text-xs text-gray-400">{c.days_ago} days ago</span>
                </div>

                {c.user_name && (
                  <div className="flex items-center gap-2">
                    <img
                      src={c.user_image || "https://i.pravatar.cc/40"}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{c.user_name}</p>
                      <p className="text-xs text-gray-400">Reporter</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 py-2">
          <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
            ← Previous
          </button>
          <button className="w-9 h-9 rounded-xl bg-teal-600 text-white text-sm font-bold shadow-md shadow-teal-100">
            1
          </button>
          <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
            Next →
          </button>
        </div>

      </div>

      {showModal && (
        <NewComplaintModal
          onClose={() => setShowModal(false)}
          onSubmitted={() => { setShowModal(false); fetchComplaints(); }}
        />
      )}
    </StudentLayout>
  );
}
