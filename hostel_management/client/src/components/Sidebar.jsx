import { useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar({ open, onClose, user }) {
  const navigate = useNavigate();

  return (
    <>
     {/* OVERLAY */}
      {open && <div className="sidebar-overlay" onClick={onClose}></div>}
    <aside className={`sidebar ${open ? "open" : ""}`}>

      <button className="close-btn" onClick={onClose}>
        ✕
      </button>

      <ul className="sidebar-menu">
        <li className="active">Dashboard</li>
        <li>Complaints</li>
        <li>Lost & Found</li>
        <li>Visitors</li>
        <li>ID Card</li>
      </ul>

      <div 
        className="sidebar-user"
        onClick={() => {
          navigate("/student/profile");
        }}
        style={{ cursor: "pointer" }}
      >
        <img
          src={user.profile_image || "https://i.pravatar.cc/100"}
          alt="profile"
        />
        <div>
          <p className="name">{user.name}</p>
          <p className="email">{user.email}</p>
        </div>
      </div>

    </aside>
    </>
  );
}
