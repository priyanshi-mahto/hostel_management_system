import React, { useState } from "react";
import { createVisitorProfile } from "../api/visitor.api";

const VisitorProfileModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    relation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.relation) {
      setError("Name, phone and relation are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createVisitorProfile(form);
      onSaved && (await onSaved());
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save visitor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Visitor Profile</h2>

        <label>Visitor Name *</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />

        <label>Phone Number *</label>
        <input type="text" name="phone" value={form.phone} onChange={handleChange} />

        <label>Email Address</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>Relation with Student *</label>
        <select name="relation" value={form.relation} onChange={handleChange}>
          <option value="">Select relation</option>
          <option>Parent</option>
          <option>Sibling</option>
          <option>Guardian</option>
          <option>Relative</option>
          <option>Friend</option>
          <option>Other</option>
        </select>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitorProfileModal;