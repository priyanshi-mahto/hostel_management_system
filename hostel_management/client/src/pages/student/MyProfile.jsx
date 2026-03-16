import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import EditProfile from "./EditProfile";
import ChangePasswordModal from "../../components/ChangePassword";
import { useEffect, useState } from "react";
import { getStudentProfile } from "../../api/student.api";
import "../../styles/myProfile.css";

export default function MyProfile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [data, setData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await getStudentProfile();
    setData(res);
  };

  const handleCloseEdit = async () => {
    setEditOpen(false);
    await loadProfile();
  };

  if (!data) return <p>Loading...</p>;

  const studentAddress = [
    data.house_no,
    data.street,
    data.area,
    data.city,
    data.state,
    data.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <Header
        onMenuClick={() => setMenuOpen(true)}
        user={data}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={data}
      />

      <div className="profile-page">

        <div className="page-title">
          <h2>My Profile</h2>
          <p>View and manage your profile information</p>
        </div>

        {/* PROFILE CARD */}
        <div className="profile-card-main">
          <img
            src={data.profile_image || "https://i.pravatar.cc/150"}
            alt="profile"
          />

          <button className="edit-btn" onClick={() => {
            console.log("Edit button clicked, opening modal");
            setEditOpen(true);
          }}>✏️ Edit Profile</button>

          <h3>{data.name}</h3>
          <span className="role-badge">Student</span>

          <p>Computer Science and Engineering | BTech</p>

          <button
  className="primary-btn"
  onClick={() => setShowPasswordModal(true)}
>
  Change Password
</button>
          <button className="secondary-btn">Manage Sessions</button>
        </div>

        {/* PERSONAL INFO */}
        <Section title="Personal Information">
          <Info label="Full Name" value={data.name} />
          <Info label="Email Address" value={data.email} />
          <Info label="Phone Number" value={data.phone} />
          <Info label="Roll Number" value={data.roll_no} />
          <Info label="Date of Birth" value={data.DOB} />
          <Info label="Gender" value={data.gender} />
          <Info label="Blood Group" value={data.blood_group} />
          <Info label="Address" value={studentAddress || "Not provided"} />
        </Section>

        {/* GUARDIAN INFO */}
        <Section title="Guardian Information">
          {Array.isArray(data.guardians) && data.guardians.length > 0 ? (
            data.guardians.map((guardian, index) => (
              <div key={guardian.guardian_id || index} className="guardian-profile-card">
                <h5 className="guardian-profile-title">Guardian {index + 1}</h5>
                <Info label="Name" value={guardian.name} />
                <Info label="Phone" value={guardian.phone} />
                <Info label="Relationship" value={guardian.relationship} />
                <Info
                  label="Address"
                  value={[
                    guardian.house_no,
                    guardian.street,
                    guardian.area,
                    guardian.city,
                    guardian.state,
                    guardian.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Not provided"}
                />
              </div>
            ))
          ) : (
            <>
              <Info label="Guardian Name" value={data.guardian_name} />
              <Info label="Guardian Phone" value={data.guardian_phone} />
              <Info label="Guardian Relationship" value={data.guardian_relationship} />
              <Info
                label="Guardian Address"
                value={[
                  data.guardian_house_no,
                  data.guardian_street,
                  data.guardian_area,
                  data.guardian_city,
                  data.guardian_state,
                  data.guardian_pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not provided"}
              />
            </>
          )}
        </Section>

        {/* HOSTEL INFO */}
        <Section title="Hostel Information">
          <Info label="Hostel" value={data.hostel_name} />
          <Info label="Unit" value={data.unit} />
          <Info label="Room Number" value={data.room_no} />
        </Section>

      </div>

      {editOpen && <EditProfile onClose={() => setEditOpen(false)} />}
        {showPasswordModal && (
  <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
)}
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="info-section">
      <h4>{title}</h4>
      <div className="info-box">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-row">
      <p className="label">{label}</p>
      <p className="value">{value}</p>
    </div>
  );
}
