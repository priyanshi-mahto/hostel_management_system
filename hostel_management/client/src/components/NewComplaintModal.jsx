import { useState } from "react";
import axios from "../api/axios";

export default function NewComplaintModal({ onClose, onSubmitted }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/student/complaint", {
        category,
        title,
        description,
      });
      alert("Complaint submitted");
      onSubmitted && onSubmitted();
    } catch (err) {
      console.error("Submit complaint failed", err);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Submit New Complaint</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Complaint Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief summary of the issue" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please provide details..." />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Internet">Internet</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Civil">Civil</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </div>

      </div>
    </div>
  );
}