import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/editProfile.css";
import { getStudentProfile, updateStudentProfile } from "../../api/student.api";

export default function EditProfileModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    DOB: "",
    blood_group: "",
    phone: "",
    address: "",
  });

  const [guardians, setGuardians] = useState([
    {
      name: "",
      phone: "",
      relationship: "",
      address: "",
    },
  ]);

  const [readOnlyData, setReadOnlyData] = useState({
    email: "",
    roll_no: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    // Prevent scrolling the page behind the modal while it's open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const loadProfile = async () => {
    const data = await getStudentProfile();

    const address = [
      data.house_no,
      data.street,
      data.area,
      data.city,
      data.state,
      data.pincode,
    ].filter(Boolean).join(", ");

    setProfile({
      name: data.name || "",
      gender: data.gender || "",
      DOB: data.DOB?.slice(0, 10) || "",
      blood_group: data.blood_group || "",
      phone: data.phone || "",
      address,
    });

    const mappedGuardians = Array.isArray(data.guardians) && data.guardians.length
      ? data.guardians.map((g) => ({
          name: g.name || "",
          phone: g.phone || "",
          relationship: g.relationship || "",
          address: [g.house_no, g.street, g.area, g.city, g.state, g.pincode]
            .filter(Boolean)
            .join(", "),
        }))
      : [
          {
            name: data.guardian_name || "",
            phone: data.guardian_phone || "",
            relationship: data.guardian_relationship || "",
            address: [
              data.guardian_house_no,
              data.guardian_street,
              data.guardian_area,
              data.guardian_city,
              data.guardian_state,
              data.guardian_pincode,
            ]
              .filter(Boolean)
              .join(", "),
          },
        ];

    setGuardians(mappedGuardians);

    setReadOnlyData({
      email: data.email || "",
      roll_no: data.roll_no || "",
    });

    setLoading(false);
  };

  const handleSave = async () => {
    const normalizedGuardians = guardians.map((g) => ({
      name: g.name?.trim() || "",
      phone: g.phone?.trim() || "",
      relationship: g.relationship?.trim() || "",
      address: g.address?.trim() || "",
    }));

    const fatherCount = normalizedGuardians.filter(
      (g) => g.relationship === "Father"
    ).length;
    const motherCount = normalizedGuardians.filter(
      (g) => g.relationship === "Mother"
    ).length;

    if (!normalizedGuardians.length) {
      setActiveTab("guardian");
      setSaveError("At least one guardian is required.");
      return;
    }

    for (let i = 0; i < normalizedGuardians.length; i += 1) {
      const g = normalizedGuardians[i];
      if (!g.name || !g.phone || !g.relationship || !g.address) {
        setActiveTab("guardian");
        setSaveError(`Please fill all fields for Guardian ${i + 1}.`);
        return;
      }

      if (!/^\d{10}$/.test(g.phone)) {
        setActiveTab("guardian");
        setSaveError(`Guardian ${i + 1} phone must be exactly 10 digits.`);
        return;
      }
    }

    if (fatherCount > 1) {
      setActiveTab("guardian");
      setSaveError("Only one guardian can have the relationship Father.");
      return;
    }

    if (motherCount > 1) {
      setActiveTab("guardian");
      setSaveError("Only one guardian can have the relationship Mother.");
      return;
    }

    setSaveError("");

    await updateStudentProfile({
      profile,
      guardians: normalizedGuardians,
      // Backward-compatibility with older backend shape
      guardian: normalizedGuardians[0],
    });
    onClose();
  };

  const updateGuardianField = (index, field, value) => {
    setGuardians((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addGuardian = () => {
    setGuardians((prev) => [
      ...prev,
      { name: "", phone: "", relationship: "", address: "" },
    ]);
  };

  const removeGuardian = (index) => {
    setGuardians((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ name: "", phone: "", relationship: "", address: "" }];
    });
  };

  const isRelationshipDisabled = (relationship, currentIndex) => {
    if (!["Father", "Mother"].includes(relationship)) return false;

    return guardians.some(
      (guardian, index) =>
        index !== currentIndex && guardian.relationship === relationship
    );
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
          You can edit both <strong>Profile Info</strong> and <strong>Guardian Info</strong>.
          Use the tabs above to switch sections, then click Save Changes.
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="form">

            <label>Email</label>
            <input
              value={readOnlyData.email}
              readOnly
            />

            <label>Roll No</label>
            <input
              value={readOnlyData.roll_no}
              readOnly
            />

            <label>Full Name</label>
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />

            <label>Gender</label>
            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NOT PREFER TO SAY">Not Prefer to Say</option>
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

            <button
              type="button"
              className="switch-section-btn"
              onClick={() => setActiveTab("guardian")}
            >
              Go to Guardian Info →
            </button>
          </div>
        )}

        {/* GUARDIAN TAB */}
        {activeTab === "guardian" && (
          <div className="form">
            {guardians.map((guardian, index) => (
              <div key={index} className="guardian-card">
                <div className="guardian-card-header">
                  <h4>Guardian {index + 1}</h4>
                  <button
                    type="button"
                    className="remove-guardian-btn"
                    onClick={() => removeGuardian(index)}
                  >
                    Remove
                  </button>
                </div>

                <label>Guardian Name</label>
                <input
                  value={guardian.name}
                  required
                  onChange={(e) => updateGuardianField(index, "name", e.target.value)}
                />

                <label>Guardian Phone</label>
                <input
                  value={guardian.phone}
                  required
                  onChange={(e) => updateGuardianField(index, "phone", e.target.value)}
                />

                <label>Relationship</label>
                <select
                  value={guardian.relationship}
                  required
                  onChange={(e) => updateGuardianField(index, "relationship", e.target.value)}
                >
                  <option value="">Select</option>
                  <option disabled={isRelationshipDisabled("Father", index)}>
                    Father
                  </option>
                  <option disabled={isRelationshipDisabled("Mother", index)}>
                    Mother
                  </option>
                  <option>Brother</option>
                  <option>Sister</option>
                  <option>Uncle</option>
                  <option>Aunt</option>
                  <option>Grandparent</option>
                  <option>Other</option>
                </select>

                <label>Guardian Address</label>
                <textarea
                  rows="3"
                  value={guardian.address}
                  required
                  onChange={(e) => updateGuardianField(index, "address", e.target.value)}
                />
              </div>
            ))}

            <button type="button" className="add-guardian-btn" onClick={addGuardian}>
              + Add Another Guardian
            </button>

            <button
              type="button"
              className="switch-section-btn"
              onClick={() => setActiveTab("profile")}
            >
              ← Back to Profile Info
            </button>
          </div>
        )}

        {/* FOOTER */}
        {saveError && <p className="form-error">{saveError}</p>}
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
