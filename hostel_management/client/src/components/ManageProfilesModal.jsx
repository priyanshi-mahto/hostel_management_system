import React from "react";

const ManageProfilesModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Manage Visitor Profiles</h2>

        <input
          type="text"
          placeholder="Search profiles by name, relation, email..."
        />

        <div className="empty-state small">
          <div className="icon">👤</div>
          <h4>No visitor profiles found</h4>
          <p>You have not added any visitor profiles yet.</p>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ManageProfilesModal;