import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar({ open, onClose, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  let displayUser = user || {};
  try {
    if ((!displayUser || Object.keys(displayUser).length === 0) && localStorage.getItem("user")) {
      displayUser = JSON.parse(localStorage.getItem("user"));
    }
  } catch (e) {
    console.error("Failed to parse stored user", e);
  }

  return (
    <>
     {/* OVERLAY */}
      {open && <div className="sidebar-overlay" onClick={onClose}></div>}
    <aside className={`sidebar ${open ? "open" : ""}`}>

      <button className="close-btn" onClick={onClose}>
        ✕
      </button>

      <ul className="sidebar-menu">
        <li className={location.pathname === "/student" ? "active" : ""} onClick={() => navigate("/student")}>Dashboard</li>
        <li className={location.pathname === "/student/complaints" ? "active" : ""} onClick={() => navigate("/student/complaints")}>Complaints</li>
        <li className={location.pathname === "/student/lost-found" ? "active" : ""} onClick={() => navigate("/student/lost-found")}>Lost & Found</li>
        <li className={location.pathname === "/student/visitors" ? "active" : ""} onClick={() => navigate("/student/visitors")}>Visitors</li>
        <li className={location.pathname === "/student/id-card" ? "active" : ""} onClick={() => navigate("/student/id-card")}>ID Card</li>
      </ul>

      <div 
        className="sidebar-user"
        onClick={() => {
          navigate("/student/profile");
        }}
        style={{ cursor: "pointer" }}
      >
        <img
          src={(displayUser && displayUser.profile_image) || "https://i.pravatar.cc/100"}
          alt="profile"
        />
        <div>
          <p className="name">{(displayUser && displayUser.name) || "Guest"}</p>
          <p className="email">{(displayUser && displayUser.email) || ""}</p>
        </div>
      </div>

    </aside>
    </>
  );
}
