import React from "react";

const VisitorProfileModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Visitor Profile</h2>

        <label>Visitor Name *</label>
        <input type="text" />

        <label>Phone Number *</label>
        <input type="text" />

        <label>Email Address *</label>
        <input type="email" />

        <label>Relation with Student</label>
        <select>
          <option>Select relation</option>
          <option>Parent</option>
          <option>Sibling</option>
          <option>Friend</option>
        </select>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary">Save Profile</button>
        </div>
      </div>
    </div>
  );
};

export default VisitorProfileModal;