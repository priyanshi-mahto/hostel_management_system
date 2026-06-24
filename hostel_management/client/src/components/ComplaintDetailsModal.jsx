// import { FiX, FiMapPin, FiUser, FiCheckCircle } from "react-icons/fi";
// import "../styles/complaintDetailModal.css";

// export default function ComplaintDetailsModal({ data, onClose }) {
//   if (!data) return null;

//   return (
//     <div className="modal-overlay">

//       <div className="details-modal">

//         {/* HEADER */}
//         <div className="details-header">
//           <h2>{data.title}</h2>

//           <button className="close-btn" onClick={onClose}>
//             Close
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="details-body">

//           {/* TOP INFO */}
//           <div className="top-info">
//             <span className="complaint-id">{data.id}</span>
//             <span className="status resolved">Resolved</span>
//           </div>

//           <div className="meta-row">
//             <span className="tag">{data.category}</span>
//             <span className="date">📅 {data.date}</span>
//           </div>

//           <button className="feedback-btn">⭐ Feedback</button>

//           {/* RESOLVED BY */}
//           <div className="detail-card">

//             <p className="card-title green">
//               <FiCheckCircle /> RESOLVED BY
//             </p>

//             <div className="user-row">
//               <img src={data.resolver_image} alt="" />
//               <div>
//                 <h4>{data.resolver_name}</h4>
//                 <p>{data.resolver_email}</p>
//                 <p>{data.resolver_phone}</p>
//               </div>
//             </div>

//             <div className="resolved-time">
//               ✔ Resolved on {data.resolved_time}
//             </div>
//           </div>

//           {/* LOCATION */}
//           <div className="detail-card">
//             <p className="card-title blue">
//               <FiMapPin /> LOCATION DETAILS
//             </p>

//             <div className="info-row">
//               <span>Hostel</span>
//               <strong>{data.hostel}</strong>
//             </div>

//             <div className="info-row">
//               <span>Room</span>
//               <strong>{data.room}</strong>
//             </div>
//           </div>

//           {/* REPORTED BY */}
//           <div className="detail-card">
//             <p className="card-title blue">
//               <FiUser /> REPORTED BY
//             </p>

//             <div className="user-row">
//               <img src={data.user_image} alt="" />
//               <div>
//                 <h4>{data.user_name}</h4>
//                 <p>{data.user_email}</p>
//                 <p>{data.user_phone}</p>
//               </div>
//             </div>
//           </div>

//           {/* DESCRIPTION */}
//           <div className="detail-card">
//             <p className="card-title blue">📋 DESCRIPTION</p>
//             <p className="desc">{data.description}</p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
import { FiX, FiCalendar, FiStar, FiCheckCircle, FiMapPin, FiUser, FiFileText } from "react-icons/fi";

export default function ComplaintDetailsModal({ data, onClose }) {
  if (!data) return null;

  const statusStyles = {
    Resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  };
  const statusClass = statusStyles[data.status] || "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-emerald-50 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg font-bold text-gray-800 truncate">{data.title}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-gray-400 font-mono">{data.id}</span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusClass}`}>
                {data.status || "Resolved"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
              {data.category}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <FiCalendar className="w-3.5 h-3.5" /> {data.date}
            </span>
            <button className="ml-auto text-xs font-medium text-yellow-600 hover:text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 transition-colors flex items-center gap-1">
              <FiStar className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" /> Leave Feedback
            </button>
          </div>

          {/* Resolved By */}
          {data.resolver_name && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Resolved By
              </p>
              <div className="flex items-center gap-3">
                {data.resolver_image ? (
                  <img
                    src={data.resolver_image.startsWith("http") ? data.resolver_image : `http://localhost:5001/uploads/profile/${data.resolver_image}`}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-200 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center shrink-0 uppercase">
                    {data.resolver_name ? data.resolver_name.trim().charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-800">{data.resolver_name}</p>
                  <p className="text-xs text-gray-500">{data.resolver_email}</p>
                  <p className="text-xs text-gray-500">{data.resolver_phone}</p>
                </div>
              </div>
              {data.resolved_time && (
                <p className="text-xs text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Resolved on {data.resolved_time}
                </p>
              )}
            </div>
          )}

          {/* Location */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-2">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
              <FiMapPin className="w-4 h-4 text-blue-600 shrink-0" /> Location Details
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                <p className="text-xs text-gray-400">Hostel</p>
                <p className="text-sm font-semibold text-gray-800">{data.hostel || "—"}</p>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                <p className="text-xs text-gray-400">Room</p>
                <p className="text-sm font-semibold text-gray-800">{data.room || "—"}</p>
              </div>
            </div>
          </div>

          {/* Reported By */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <FiUser className="w-4 h-4 text-gray-400 shrink-0" /> Reported By
            </p>
            <div className="flex items-center gap-3">
              {data.user_image ? (
                <img
                  src={data.user_image.startsWith("http") ? data.user_image : `http://localhost:5001/uploads/profile/${data.user_image}`}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-100 border border-teal-200 text-teal-800 font-bold flex items-center justify-center shrink-0 uppercase">
                  {data.user_name ? data.user_name.trim().charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-800">{data.user_name}</p>
                <p className="text-xs text-gray-500">{data.user_email}</p>
                <p className="text-xs text-gray-500">{data.user_phone}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <FiFileText className="w-4 h-4 text-gray-400 shrink-0" /> Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{data.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
