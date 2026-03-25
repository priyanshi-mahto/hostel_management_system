import React, { useState } from "react";
import "../../styles/visitorRequest.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import VisitorProfileModal from "../../components/VisitorProfileModal";
import ManageProfilesModal from "../../components/ManageProfilesModal";
import CreateRequestModal from "../../components/CreateRequestModal";
import { getVisitorRequests } from "../../api/visitor.api";

const VisitorRequests = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showManageProfiles, setShowManageProfiles] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  React.useEffect(() => {
    try {
      setStudent(JSON.parse(localStorage.getItem("user") || "null"));
    } catch (err) {
      console.error("Failed to parse stored user", err);
    }
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getVisitorRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setRequests([]);
    }
  };

  const filteredRequests = requests.filter((request) =>
    activeFilter === "All" ? true : request.status === activeFilter.toUpperCase()
  );

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
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                className={activeFilter === status ? "active" : ""}
                onClick={() => setActiveFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Requests */}
      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <div className="icon">👥</div>
          <h3>No Visitor Requests</h3>
          <p>
            You haven't made any visitor accommodation requests yet. Create a new
            request to get started.
          </p>
        </div>
      ) : (
        <div className="section">
          {filteredRequests.map((request) => (
            <div key={request.request_id} className="empty-box">
              <strong>{request.visitors}</strong>
              <p>Status: {request.status}</p>
              <p>From: {request.from_date?.slice(0, 10)}</p>
              <p>To: {request.to_date?.slice(0, 10)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button disabled>Previous</button>
        <button className="active">1</button>
        <button disabled>Next</button>
      </div>

      {/* Modals */}
      {showAddProfile && (
        <VisitorProfileModal onClose={() => setShowAddProfile(false)} onSaved={loadRequests} />
      )}

      {showManageProfiles && (
        <ManageProfilesModal onClose={() => setShowManageProfiles(false)} />
      )}

      {showCreate && (
        <CreateRequestModal onClose={() => setShowCreate(false)} onSaved={loadRequests} />
      )}
    </div>
    </>
  );
};

export default VisitorRequests;