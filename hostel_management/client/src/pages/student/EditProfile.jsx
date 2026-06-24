import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { getStudentProfile, updateStudentProfile, uploadStudentProfileImage, deleteStudentProfileImage } from "../../api/student.api";
import StudentLayout from "../../components/StudentLayout";
import { FiUser, FiUsers, FiInfo } from "react-icons/fi";

export default function EditProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const apiBase = (axios.defaults?.baseURL || "http://localhost:5001/api").replace(/\/+api\/?$/i, "");
  const avatarUrl = profileImage
    ? (profileImage.startsWith("http") ? profileImage : `${apiBase}/uploads/profile/${profileImage}`)
    : null;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Image must be smaller than 1MB");
      return;
    }

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      setUploading(true);
      const res = await uploadStudentProfileImage(formData);
      setProfileImage(res.profile_image);

      // Update local storage user profile cache
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        u.profile_image = res.profile_image;
        localStorage.setItem("user", JSON.stringify(u));
      }
      alert("Profile photo updated!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoRemove = async () => {
    if (!window.confirm("Are you sure you want to remove your profile photo?")) return;

    try {
      setUploading(true);
      await deleteStudentProfileImage();
      setProfileImage("");

      // Update local storage user profile cache
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        u.profile_image = null;
        localStorage.setItem("user", JSON.stringify(u));
      }
      alert("Profile photo removed!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove photo");
    } finally {
      setUploading(false);
    }
  };

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

      setProfileImage(data.profile_image || "");

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
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-sm text-teal-800 flex items-center gap-2">
          <FiInfo className="w-4 h-4 text-teal-600 shrink-0" />
          <span>You can edit both <strong>Profile Info</strong> and <strong>Guardian Info</strong>. Use the tabs below to switch sections, then click Save Changes.</span>
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
            <span className="flex items-center gap-1.5">
              <FiUser className="w-4 h-4" /> Profile Info
            </span>
          </button>
          <button
            onClick={() => setActiveTab("guardian")}
            className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "guardian"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FiUsers className="w-4 h-4" /> Guardian Info
            </span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {activeTab === "profile" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Profile Photo Upload/Remove Section */}
              <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-gray-100 mb-2">
                <div className="relative group">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-50 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-teal-50 border-2 border-dashed border-teal-200 text-teal-800 font-black text-3xl flex items-center justify-center shadow-inner uppercase">
                      {profile.name ? profile.name.trim().charAt(0) : "?"}
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 items-center sm:items-start">
                  <h4 className="font-bold text-gray-800 text-base">Profile Photo</h4>
                  <p className="text-xs text-gray-400 font-medium">Accepts PNG, JPG or JPEG. Max size 1MB.</p>
                  <div className="flex gap-3 mt-1">
                    <label className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-teal-100 transition-colors">
                      {uploading ? "Uploading..." : "Upload New Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    {profileImage && (
                      <button
                        type="button"
                        onClick={handlePhotoRemove}
                        disabled={uploading}
                        className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
