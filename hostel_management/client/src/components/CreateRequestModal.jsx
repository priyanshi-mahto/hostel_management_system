import React, { useEffect, useState } from "react";
import { createVisitorRequest, getVisitorProfiles } from "../api/visitor.api";

const CreateRequestModal = ({ onClose, onSaved }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [form, setForm] = useState({
    from_date: "",
    to_date: "",
    reason: "",
  });
  const [error, setError] = useState("");

  /* ------------------ FETCH PROFILES ------------------ */
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await getVisitorProfiles();
        setProfiles(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfiles();
  }, []);

  /* ------------------ HANDLE INPUT ------------------ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ------------------ TOGGLE VISITOR ------------------ */
  const toggleVisitor = (id) => {
    setSelectedVisitors((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async () => {
    try {
      if (!form.from_date || !form.to_date || !form.reason || selectedVisitors.length === 0) {
        setError("Please select visitors and fill all request fields.");
        return;
      }

      setError("");

      await createVisitorRequest({
        ...form,
        visitor_ids: selectedVisitors,
      });

      onSaved && (await onSaved());
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error submitting request");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h2>Create Visitor Request</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Select Visitors */}
        <div className="section">
          <div className="section-header">
            <h4>Select Visitors</h4>
          </div>

          {profiles.length === 0 ? (
            <div className="empty-box">
              No visitor profiles found. Add some profiles first.
            </div>
          ) : (
            profiles.map((p) => (
              <label key={p.visitor_id} className="checkbox">
                <input
                  type="checkbox"
                  checked={selectedVisitors.includes(p.visitor_id)}
                  onChange={() => toggleVisitor(p.visitor_id)}
                />
                {p.name} ({p.relation})
              </label>
            ))
          )}
        </div>

        {/* Dates */}
        <div className="section">
          <label>From Date *</label>
          <input
            type="date"
            name="from_date"
            value={form.from_date}
            onChange={handleChange}
          />
          <small>Must be at least 2 days from today</small>
        </div>

        <div className="section">
          <label>To Date *</label>
          <input
            type="date"
            name="to_date"
            value={form.to_date}
            onChange={handleChange}
          />
        </div>

        {/* Reason */}
        <div className="section">
          <label>Reason for Visit *</label>
          <textarea
            name="reason"
            placeholder="Please provide details about the purpose of the visit"
            value={form.reason}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        {/* Actions */}
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestModal;