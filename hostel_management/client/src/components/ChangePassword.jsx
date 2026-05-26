import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../api/auth.api";
import StudentLayout from "./StudentLayout";

const ChangePassword = ({ onClose }) => {
  const navigate = useNavigate();
  const isModal = typeof onClose === "function";

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
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
        if (isModal) {
          onClose();
        } else {
          navigate("/student/profile");
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Failed to update password";
        alert(msg);
      })
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    if (isModal) {
      onClose();
    } else {
      navigate("/student/profile");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Current Password
        </label>
        <input
          type="password"
          name="current_password"
          value={formData.current_password}
          onChange={handleChange}
          placeholder="Enter current password"
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          New Password
        </label>
        <input
          type="password"
          name="new_password"
          value={formData.new_password}
          onChange={handleChange}
          placeholder="Enter new password"
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="Confirm new password"
          required
          className={inputClass}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-md shadow-teal-100"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
              <p className="text-xs text-gray-400 mt-0.5">Update your account password</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-5">{formContent}</div>
        </div>
      </div>
    );
  }

  // Standalone Route View
  return (
    <StudentLayout>
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
          <div className="mb-5 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update your account password</p>
          </div>
          {formContent}
        </div>
      </div>
    </StudentLayout>
  );
};

export default ChangePassword;