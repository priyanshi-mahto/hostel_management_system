import React, { useState } from "react";
import "../../styles/visitorRequest.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import VisitorProfileModal from "../../components/VisitorProfileModal";
import ManageProfilesModal from "../../components/ManageProfilesModal";
import CreateRequestModal from "../../components/CreateRequestModal";
import { useAuth } from "../../context/AuthContext";

const VisitorRequests = () => {
     const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
   const [student, setStudent] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showManageProfiles, setShowManageProfiles] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const { user } = useAuth();

  return (
    <>
    <Header onMenuClick={() => setMenuOpen(true)} user={student} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
    <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} user={student} />
    
    <div className="visitor-container">
      <h2 className="title">Visitor Requests</h2>

      {/* Buttons */}
      <div className="btn-group">
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Filter Requests"}
        </button>

        <button onClick={() => setShowAddProfile(true)}>
          + Add Visitor Profile
        </button>

        <button onClick={() => setShowManageProfiles(true)}>
          Manage Profiles
        </button>

        <button className="primary" onClick={() => setShowCreate(true)}>+ New Request</button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filter-box">
          <p>Filter by Status:</p>
          <div className="status-tabs">
            <button className="active">All</button>
            <button>Pending</button>
            <button>Approved</button>
            <button>Rejected</button>
          </div>
        </div>
      )}

      {/* Empty State */}
      <div className="empty-state">
        <div className="icon">👥</div>
        <h3>No Visitor Requests</h3>
        <p>
          You haven't made any visitor accommodation requests yet. Create a new
          request to get started.
        </p>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled>Previous</button>
        <button className="active">1</button>
        <button disabled>Next</button>
      </div>

      {/* Modals */}
      {showAddProfile && (
        <VisitorProfileModal onClose={() => setShowAddProfile(false)} />
      )}

      {showManageProfiles && (
        <ManageProfilesModal onClose={() => setShowManageProfiles(false)} />
      )}

      {showCreate && (
  <CreateRequestModal
    onClose={() => setShowCreate(false)}
    // studentId={user?.student_id} 
  />
)}
    </div>
    </>
  );
};

export default VisitorRequests;