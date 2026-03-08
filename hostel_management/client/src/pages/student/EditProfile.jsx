import { useEffect, useState } from "react";
import "../../styles/editProfile.css";
import { getStudentProfile, updateStudentProfile } from "../../api/student.api";

export default function EditProfileModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    gender: "",
    DOB: "",
    blood_group: "",
    phone: "",
    address: "",
  });

  const [guardian, setGuardian] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await getStudentProfile();

    setProfile({
      gender: data.gender || "",
      DOB: data.DOB?.slice(0, 10) || "",
      blood_group: data.blood_group || "",
      phone: data.phone || "",
      address: data.address || "",
    });

    setGuardian({
      name: data.guardian_name || "",
      phone: data.guardian_phone || "",
      email: data.guardian_email || "",
    });

    setLoading(false);
  };

  const handleSave = async () => {
    await updateStudentProfile({
      profile,
      guardian,
    });
    onClose();
  };

  if (loading) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* HEADER */}
        <div className="modal-header">
          <div className="tabs">
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              Profile Info
            </button>
            <button
              className={activeTab === "guardian" ? "active" : ""}
              onClick={() => setActiveTab("guardian")}
            >
              Guardian
            </button>
          </div>

          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* INFO BOX */}
        <div className="info-note">
          You can edit the following fields in your profile.
          Any changes will be saved once you submit the form.
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="form">

            <label>Gender</label>
            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Not Prefer to Say</option>
            </select>

            <label>Date of Birth</label>
            <input
              type="date"
              value={profile.DOB}
              onChange={(e) =>
                setProfile({ ...profile, DOB: e.target.value })
              }
            />

            <label>Blood Group</label>
            <select
              value={profile.blood_group}
              onChange={(e) =>
                setProfile({ ...profile, blood_group: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option>
              <option>AB+</option><option>AB-</option>
            </select>

            <label>Phone Number</label>
            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />

            <label>Address</label>
            <textarea
              rows="3"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
            />
          </div>
        )}

        {/* GUARDIAN TAB */}
        {activeTab === "guardian" && (
          <div className="form">

            <label>Guardian Name</label>
            <input
              value={guardian.name}
              onChange={(e) =>
                setGuardian({ ...guardian, name: e.target.value })
              }
            />

            <label>Guardian Phone</label>
            <input
              value={guardian.phone}
              onChange={(e) =>
                setGuardian({ ...guardian, phone: e.target.value })
              }
            />

            <label>Guardian Email</label>
            <input
              value={guardian.email}
              onChange={(e) =>
                setGuardian({ ...guardian, email: e.target.value })
              }
            />
          </div>
        )}

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
