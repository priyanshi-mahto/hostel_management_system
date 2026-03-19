// import { useState, useEffect } from "react";
// import Header from "../../components/Header";
// import Sidebar from "../../components/Sidebar";
// import axios from "../../api/axios";
// import "../../styles/complaints.css";
// import { FiList } from "react-icons/fi";
// import { BsGrid } from "react-icons/bs";
// import { FiFilter } from "react-icons/fi";
// export default function Complaints() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [view, setView] = useState("list");
//   const [showFilter, setShowFilter] = useState(false);
//   const [complaints, setComplaints] = useState([]);
//   const [status, setStatus] = useState("ALL");

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const fetchComplaints = async () => {
//     const res = await axios.get("/complaints/my");
//     setComplaints(res.data);
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

//         <div className="top-controls">

//   {/* VIEW TOGGLE */}
//   <div className="view-toggle">
//     <button
//       className={view === "list" ? "active" : ""}
//       onClick={() => setView("list")}
//     >
//       ☰
//     </button>

//     <button
//       className={view === "grid" ? "active" : ""}
//       onClick={() => setView("grid")}
//     >
//       ⬛
//     </button>
//   </div>

//   {/* FILTER */}
//   {showFilter && (
//   <div className="filter-panel">

//     <div className="filter-header">
//       <h3>Filters</h3>
//       <span className="reset" onClick={() => setStatus("ALL")}>
//         ↻ Reset
//       </span>
//     </div>

//     {/* STATUS */}
//     <div className="filter-group">
//       <label>Status</label>
//       <select onChange={(e) => setStatus(e.target.value)}>
//         <option value="ALL">All Complaints</option>
//         <option value="PENDING">Pending</option>
//         <option value="IN_PROGRESS">In Progress</option>
//         <option value="RESOLVED">Resolved</option>
//       </select>
//     </div>

//     {/* CATEGORY */}
//     <div className="filter-group">
//       <label>Category</label>
//       <select>
//         <option>All Categories</option>
//         <option>Plumbing</option>
//         <option>Electricity</option>
//         <option>Cleaning</option>
//       </select>
//     </div>

//     {/* FEEDBACK */}
//     <div className="filter-group">
//       <label>Feedback Rating</label>
//       <select>
//         <option>All Ratings</option>
//         <option>5 ⭐</option>
//         <option>4 ⭐</option>
//         <option>3 ⭐</option>
//       </select>
//     </div>

//     {/* SATISFACTION */}
//     <div className="filter-group">
//       <label>Satisfaction Status</label>
//       <select>
//         <option>All Statuses</option>
//         <option>Satisfied</option>
//         <option>Not Satisfied</option>
//       </select>
//     </div>

//     {/* ITEMS PER PAGE */}
//     <div className="filter-group">
//       <label>Items per page</label>
//       <select>
//         <option>10</option>
//         <option>20</option>
//         <option>50</option>
//       </select>
//     </div>

//   </div>
// )}

//   {/* NEW */}
//   <button className="new-btn">
//     + New Complaint
//   </button>

// </div>
        

//         {/* TABS */}
//         <div className="tabs">
//           <button
//             className={status === "ALL" ? "active" : ""}
//             onClick={() => setStatus("ALL")}
//           >
//             All Complaints <span>{complaints.length}</span>
//           </button>

//           <button onClick={() => setStatus("PENDING")}>
//             Pending <span>{complaints.filter(c => c.status==="PENDING").length}</span>
//           </button>

//           <button onClick={() => setStatus("IN_PROGRESS")}>
//             In Progress
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
//                   <img src={c.user_image || "https://i.pravatar.cc/40"} />
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

//       </div>
//     </>
//   );
// }



import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import axios from "../../api/axios";
import "../../styles/complaints.css";
import NewComplaintModal from "../../components/NewComplaintModal";

import { FiList, FiFilter } from "react-icons/fi";
import { BsGrid } from "react-icons/bs";

export default function Complaints() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("list");
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = complaints.filter((c) => {
    if (status === "ALL") return true;
    return c.status === status;
  });

  return (
    <>
      <Header onMenuClick={() => setMenuOpen(true)} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="complaints-container">

        {/* TOP CONTROLS */}
        <div className="top-controls">

          <div className="view-toggle">
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              <FiList />
            </button>

            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
            >
              <BsGrid />
            </button>
          </div>

          <button
            className={`filter-btn ${showFilter ? "active" : ""}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FiFilter />
          </button>

          <button className="new-btn" onClick={() => setShowModal(true)}>+ New Complaint</button>
        </div>

        {/* FILTER PANEL */}
        {showFilter && (
          <div className="filter-panel">

            <div className="filter-header">
              <h3>Filters</h3>
              <span className="reset" onClick={() => setStatus("ALL")}>
                ↻ Reset
              </span>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select onChange={(e) => setStatus(e.target.value)}>
                <option value="ALL">All Complaints</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select>
                <option>All Categories</option>
                <option>Plumbing</option>
                <option>Electricity</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Feedback Rating</label>
              <select>
                <option>All Ratings</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Satisfaction Status</label>
              <select>
                <option>All Statuses</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Items per page</label>
              <select>
                <option>10</option>
                <option>20</option>
              </select>
            </div>

          </div>
        )}

        {view === "list" && (
  filtered.length === 0 ? (
    <div className="empty-box">
      <div className="empty-icon">?</div>
      <h3>No Data Found</h3>
      <p>No complaints to display</p>
    </div>
  ) : (
    <div className="list-box">
      <div className="table-header">
        <span>ID/TITLE</span>
        <span>STATUS</span>
      </div>

      {filtered.map((c) => (
        <div className="row" key={c.id}>
          <div>
            <p className="id">{c.id}</p>
            <h4>{c.title}</h4>
          </div>

          <span className={`status ${c.status.toLowerCase()}`}>
            {c.status}
          </span>
        </div>
      ))}
    </div>
  )
)}

{view === "grid" && (
  filtered.length === 0 ? (
    <div className="empty-box">
      <div className="empty-icon">?</div>
      <h3>No Data Found</h3>
      <p>No complaints to display</p>
    </div>
  ) : (
    <div className="grid-box">
      {filtered.map((c) => (
        <div className="card" key={c.id}>
          ...
        </div>
      ))}
    </div>
  )
)}

        {/* TABS */}
        <div className="tabs">
          <button
            className={status === "ALL" ? "active" : ""}
            onClick={() => setStatus("ALL")}
          >
            All Complaints <span className="count">{complaints.length}</span>
          </button>

          <button
            className={status === "Pending" ? "active" : ""}
            onClick={() => setStatus("Pending")}
          >
            Pending{" "}
            <span className="count">
              {complaints.filter((c) => c.status === "Pending").length}
            </span>
          </button>

          <button
            className={status === "Resolved" ? "active" : ""}
            onClick={() => setStatus("Resolved")}
          >
            Resolved
          </button>
        </div>

        {/* LIST VIEW */}
        {view === "list" && (
          <div className="list-box">
            <div className="table-header">
              <span>ID/TITLE</span>
              <span>STATUS</span>
            </div>

            {filtered.map((c) => (
              <div className="row" key={c.id}>
                <div>
                  <p className="id">{c.id}</p>
                  <h4>{c.title}</h4>
                </div>

                <span className={`status ${c.status.toLowerCase()}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* GRID VIEW */}
        {view === "grid" && (
          <div className="grid-box">
            {filtered.map((c) => (
              <div className="card" key={c.id}>

                <div className="status-row">
                  <span className={`status ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </div>

                <h3>{c.title}</h3>

                <p className="location">
                  🏢 {c.block}, Room {c.room}
                </p>

                <p className="desc">{c.description}</p>

                <div className="meta">
                  <span>🧩 {c.category}</span>
                  <span>{c.days_ago} days ago</span>
                </div>

                <div className="user">
                  <img src={c.user_image || "https://i.pravatar.cc/40"} alt="" />
                  <div>
                    <p>{c.user_name}</p>
                    <small>Reporter</small>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="pagination">
          <button>Previous</button>
          <button className="active">1</button>
          <button>Next</button>
        </div>
      {showModal && (
        <NewComplaintModal onClose={() => setShowModal(false)} onSubmitted={() => { setShowModal(false); fetchComplaints(); }} />
      )}
      </div>
    </>
  );
}