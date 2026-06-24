// import React, { useState } from "react";
// import "../../styles/visitorRequest.css";
// import Header from "../../components/Header";
// import Sidebar from "../../components/Sidebar";
// import VisitorProfileModal from "../../components/VisitorProfileModal";
// import ManageProfilesModal from "../../components/ManageProfilesModal";
// import CreateRequestModal from "../../components/CreateRequestModal";
// import { getVisitorRequests } from "../../api/visitor.api";

// const VisitorRequests = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [student, setStudent] = useState(null);
//   const [requests, setRequests] = useState([]);
//   const [activeFilter, setActiveFilter] = useState("All");

//   const [showFilters, setShowFilters] = useState(false);
//   const [showAddProfile, setShowAddProfile] = useState(false);
//   const [showManageProfiles, setShowManageProfiles] = useState(false);
//   const [showCreate, setShowCreate] = useState(false);

//   React.useEffect(() => {
//     try {
//       setStudent(JSON.parse(localStorage.getItem("user") || "null"));
//     } catch (err) {
//       console.error("Failed to parse stored user", err);
//     }
//     loadRequests();
//   }, []);

//   const loadRequests = async () => {
//     try {
//       const data = await getVisitorRequests();
//       setRequests(data);
//     } catch (err) {
//       console.error(err);
//       setRequests([]);
//     }
//   };

//   const filteredRequests = requests.filter((request) =>
//     activeFilter === "All" ? true : request.status === activeFilter.toUpperCase()
//   );

//   return (
//     <>
//     <Header onMenuClick={() => setMenuOpen(true)} user={student} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
//     <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} user={student} />
    
//     <div className="visitor-container">
//       <h2 className="title">Visitor Requests</h2>

//       {/* Buttons */}
//       <div className="btn-group">
//         <button onClick={() => setShowFilters(!showFilters)}>
//           {showFilters ? "Hide Filters" : "Filter Requests"}
//         </button>

//         <button onClick={() => setShowAddProfile(true)}>
//           + Add Visitor Profile
//         </button>

//         <button onClick={() => setShowManageProfiles(true)}>
//           Manage Profiles
//         </button>

//         <button className="primary" onClick={() => setShowCreate(true)}>+ New Request</button>
//       </div>

//       {/* Filters */}
//       {showFilters && (
//         <div className="filter-box">
//           <p>Filter by Status:</p>
//           <div className="status-tabs">
//             {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
//               <button
//                 key={status}
//                 className={activeFilter === status ? "active" : ""}
//                 onClick={() => setActiveFilter(status)}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Requests */}
//       {filteredRequests.length === 0 ? (
//         <div className="empty-state">
//           <div className="icon">👥</div>
//           <h3>No Visitor Requests</h3>
//           <p>
//             You haven't made any visitor accommodation requests yet. Create a new
//             request to get started.
//           </p>
//         </div>
//       ) : (
//         <div className="section">
//           {filteredRequests.map((request) => (
//             <div key={request.request_id} className="empty-box">
//               <strong>{request.visitors}</strong>
//               <p>Status: {request.status}</p>
//               <p>From: {request.from_date?.slice(0, 10)}</p>
//               <p>To: {request.to_date?.slice(0, 10)}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="pagination">
//         <button disabled>Previous</button>
//         <button className="active">1</button>
//         <button disabled>Next</button>
//       </div>

//       {/* Modals */}
//       {showAddProfile && (
//         <VisitorProfileModal onClose={() => setShowAddProfile(false)} onSaved={loadRequests} />
//       )}

//       {showManageProfiles && (
//         <ManageProfilesModal onClose={() => setShowManageProfiles(false)} />
//       )}

//       {showCreate && (
//         <CreateRequestModal onClose={() => setShowCreate(false)} onSaved={loadRequests} />
//       )}
//     </div>
//     </>
//   );
// };

// export default VisitorRequests;


import React, { useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import { VisitorProfileModal, ManageProfilesModal } from "../../components/VisitorProfileModal";
import CreateRequestModal from "../../components/CreateRequestModal";
import { getVisitorRequests } from "../../api/visitor.api";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiUser,
  FiUsers,
  FiArrowLeft,
  FiArrowRight
} from "react-icons/fi";

const statusConfig = {
  PENDING:  { color: "bg-amber-100 text-amber-700 border-amber-200",     icon: <FiClock className="w-3.5 h-3.5" /> },
  APPROVED: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <FiCheckCircle className="w-3.5 h-3.5" /> },
  REJECTED: { color: "bg-red-100 text-red-600 border-red-200",           icon: <FiXCircle className="w-3.5 h-3.5" /> },
};

function RequestCard({ request }) {
  const sc = statusConfig[request.status] || { color: "bg-gray-100 text-gray-600 border-gray-200", icon: <FiFileText className="w-3.5 h-3.5" /> };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{request.visitors || "Visitor Request"}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">#{request.request_id}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1 ${sc.color}`}>
          <span>{sc.icon}</span> {request.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
          <p className="text-xs text-gray-400">From</p>
          <p className="text-sm font-semibold text-gray-700">{request.from_date?.slice(0, 10) || "—"}</p>
        </div>
        <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
          <p className="text-xs text-gray-400">To</p>
          <p className="text-sm font-semibold text-gray-700">{request.to_date?.slice(0, 10) || "—"}</p>
        </div>
      </div>
    </div>
  );
}

const FILTER_TABS = ["All", "Pending", "Approved", "Rejected"];

const VisitorRequests = () => {
  const [requests,           setRequests]           = useState([]);
  const [activeFilter,       setActiveFilter]       = useState("All");
  const [showAddProfile,     setShowAddProfile]     = useState(false);
  const [showManageProfiles, setShowManageProfiles] = useState(false);
  const [showCreate,         setShowCreate]         = useState(false);

  React.useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try { setRequests(await getVisitorRequests()); }
    catch { setRequests([]); }
  };

  const filteredRequests = requests.filter((r) =>
    activeFilter === "All" ? true : r.status === activeFilter.toUpperCase()
  );

  const countFor = (f) => f === "All" ? requests.length : requests.filter((r) => r.status === f.toUpperCase()).length;

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Actions Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-gray-400">Manage your hostel visitor bookings</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition-colors shadow-md shadow-teal-100"
          >
            + New Request
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowAddProfile(true)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-teal-200 hover:bg-teal-50/50 transition-all text-left"
          >
            <FiUser className="w-6 h-6 text-teal-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-800">Add Profile</p>
              <p className="text-xs text-gray-400">Save a new contact</p>
            </div>
          </button>
          <button
            onClick={() => setShowManageProfiles(true)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-teal-200 hover:bg-teal-50/50 transition-all text-left"
          >
            <FiFileText className="w-6 h-6 text-teal-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-800">Manage Profiles</p>
              <p className="text-xs text-gray-400">View all contacts</p>
            </div>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm overflow-x-auto">
          {FILTER_TABS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === f
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {f}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeFilter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {countFor(f)}
              </span>
            </button>
          ))}
        </div>

        {/* Requests */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <FiUsers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-700 text-lg">No Visitor Requests</h3>
            <p className="text-sm text-gray-400 mt-1">Create a new request to get started</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-md shadow-teal-100"
            >
              + Create Request
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((r) => (
              <RequestCard key={r.request_id} request={r} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button disabled className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-400 disabled:opacity-40 flex items-center gap-1">
            <FiArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button className="w-9 h-9 rounded-xl bg-teal-600 text-white text-sm font-bold shadow-md shadow-teal-100">1</button>
          <button disabled className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-400 disabled:opacity-40 flex items-center gap-1">
            Next <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {showAddProfile     && <VisitorProfileModal  onClose={() => setShowAddProfile(false)}     onSaved={loadRequests} />}
      {showManageProfiles && <ManageProfilesModal  onClose={() => setShowManageProfiles(false)} />}
      {showCreate         && <CreateRequestModal   onClose={() => setShowCreate(false)}          onSaved={loadRequests} />}
    </StudentLayout>
  );
}

export default VisitorRequests;
