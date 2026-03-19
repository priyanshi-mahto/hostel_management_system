import { useEffect, useRef, useState } from "react";
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
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = typeof profileOpen === "boolean" ? profileOpen : internalOpen;
  const setOpen = typeof setProfileOpen === "function" ? setProfileOpen : setInternalOpen;

  // Prefer passed `user`, otherwise fallback to stored user in localStorage
  let displayUser = user || {};
  try {
    if ((!displayUser || Object.keys(displayUser).length === 0) && localStorage.getItem("user")) {
      displayUser = JSON.parse(localStorage.getItem("user"));
    }
  } catch (e) {
    console.error("Failed to parse stored user", e);
  }

  // CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setOpen]);

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
          src={(displayUser && displayUser.profile_image) || "https://i.pravatar.cc/100"}
          alt="profile"
          onClick={() => setOpen(!isOpen)}
        />

        {isOpen && (
          <div className="profile-dropdown">
            <p
              onClick={() => {
                navigate("/student/profile");
                setProfileOpen && setProfileOpen(false);
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
