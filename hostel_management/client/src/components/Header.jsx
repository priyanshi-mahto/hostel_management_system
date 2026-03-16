import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/header.css";

export default function Header({
  onMenuClick,
  user,
  profileOpen,
  setProfileOpen,
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen, setProfileOpen]);

  return (
    <header className="dash-header">

      {/* MENU */}
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>

      <h2>Hostel Management System</h2>

      {/* PROFILE */}
      <div className="profile-box" ref={dropdownRef}>
        <img
          src={user.profile_image || "https://i.pravatar.cc/100"}
          alt="profile"
          onClick={() => setProfileOpen(!profileOpen)}
        />

        {profileOpen && (
          <div className="profile-dropdown">
            <p
              onClick={() => {
                navigate("/student/profile");
                setProfileOpen(false);
              }}
            >
              Profile
            </p>
            <p
              className="logout"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
