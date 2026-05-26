import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentProfile, updateStudentProfile } from "../../api/student.api";
import StudentLayout from "../../components/StudentLayout";

export default function EditProfile() {
  const navigate = useNavigate();
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

  const loadProfile = async () => {
    try {
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
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
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

    try {
      await updateStudentProfile({
        profile,
        guardians: normalizedGuardians,
        // Backward-compatibility with older backend shape
        guardian: normalizedGuardians[0],
      });
      navigate("/student/profile");
    } catch (err) {
      console.error(err);
      setSaveError(err.response?.data?.message || "Failed to update profile");
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Info Note */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-sm text-teal-800">
          📍 You can edit both <strong>Profile Info</strong> and <strong>Guardian Info</strong>. Use the tabs below to switch sections, then click Save Changes.
        </div>

        {/* Tab Headers */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "profile"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            👤 Profile Info
          </button>
          <button
            onClick={() => setActiveTab("guardian")}
            className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "guardian"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            👨‍👩‍👧 Guardian Info
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {activeTab === "profile" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                <input
                  value={readOnlyData.email}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll Number</label>
                <input
                  value={readOnlyData.roll_no}
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NOT PREFER TO SAY">Not Prefer to Say</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                <input
                  type="date"
                  value={profile.DOB}
                  onChange={(e) => setProfile({ ...profile, DOB: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood Group</label>
                <select
                  value={profile.blood_group}
                  onChange={(e) => setProfile({ ...profile, blood_group: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
                <textarea
                  rows="3"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {guardians.map((guardian, index) => (
                <div key={index} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-teal-700 text-sm">Guardian {index + 1}</h4>
                    {guardians.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuardian(index)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guardian Name</label>
                      <input
                        value={guardian.name}
                        onChange={(e) => updateGuardianField(index, "name", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guardian Phone</label>
                      <input
                        value={guardian.phone}
                        onChange={(e) => updateGuardianField(index, "phone", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Relationship</label>
                      <select
                        value={guardian.relationship}
                        onChange={(e) => updateGuardianField(index, "relationship", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                      >
                        <option value="">Select</option>
                        <option disabled={isRelationshipDisabled("Father", index)}>Father</option>
                        <option disabled={isRelationshipDisabled("Mother", index)}>Mother</option>
                        <option>Brother</option>
                        <option>Sister</option>
                        <option>Uncle</option>
                        <option>Aunt</option>
                        <option>Grandparent</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guardian Address</label>
                      <textarea
                        rows="3"
                        value={guardian.address}
                        onChange={(e) => updateGuardianField(index, "address", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addGuardian}
                className="w-full py-2.5 border-2 border-dashed border-teal-200 text-teal-700 hover:bg-teal-50/50 rounded-xl text-sm font-semibold transition-colors"
              >
                + Add Another Guardian
              </button>
            </div>
          )}

          {/* Action Footer */}
          {saveError && <p className="text-xs text-red-500 mt-4 font-semibold">{saveError}</p>}
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={() => navigate("/student/profile")}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-100 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
