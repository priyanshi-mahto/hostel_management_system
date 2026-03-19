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