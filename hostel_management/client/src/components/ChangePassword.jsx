import React, { useState } from "react";
import { changePassword } from "../api/auth.api";

const ChangePassword = ({ onClose }) => {

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(formData.new_password !== formData.confirm_password){
      alert("New passwords do not match");
      return;
    }

    const payload = {
      currentPassword: formData.current_password,
      newPassword: formData.new_password,
    };

    setLoading(true);
    changePassword(payload)
      .then((res) => {
        alert(res?.data?.message || "Password updated successfully");
        if (onClose) onClose();
      })
      .catch((err) => {
        console.error("Change password error", err?.response || err);
        const msg = err?.response?.data?.message || "Failed to update password";
        alert(msg);
      })
      .finally(() => setLoading(false));
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Change Password</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="password-form">

          <div>
            <label>Current Password</label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="save-btn" disabled={loading}>{loading? 'Updating...':'Update Password'}</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;