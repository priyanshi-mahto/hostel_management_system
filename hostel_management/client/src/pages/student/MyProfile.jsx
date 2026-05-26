// import Header from "../../components/Header";
// import Sidebar from "../../components/Sidebar";
// import EditProfile from "./EditProfile";
// import ChangePasswordModal from "../../components/ChangePassword";
// import { useEffect, useState } from "react";
// import { getStudentProfile } from "../../api/student.api";
// import "../../styles/myProfile.css";

// export default function MyProfile() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [data, setData] = useState(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const loadProfile = async () => {
//     const res = await getStudentProfile();
//     setData(res);
//   };

//   const handleCloseEdit = async () => {
//     setEditOpen(false);
//     await loadProfile();
//   };

//   if (!data) return <p>Loading...</p>;

//   const studentAddress = [
//     data.house_no,
//     data.street,
//     data.area,
//     data.city,
//     data.state,
//     data.pincode,
//   ]
//     .filter(Boolean)
//     .join(", ");

//   return (
//     <>
//       <Header
//         onMenuClick={() => setMenuOpen(true)}
//         user={data}
//         profileOpen={profileOpen}
//         setProfileOpen={setProfileOpen}
//       />

//       <Sidebar
//         open={menuOpen}
//         onClose={() => setMenuOpen(false)}
//         user={data}
//       />

//       <div className="profile-page">

//         <div className="page-title">
//           <h2>My Profile</h2>
//           <p>View and manage your profile information</p>
//         </div>

//         {/* PROFILE CARD */}
//         <div className="profile-card-main">
//           <img
//             src={data.profile_image || "https://i.pravatar.cc/150"}
//             alt="profile"
//           />

//           <button className="edit-btn" onClick={() => {
//             console.log("Edit button clicked, opening modal");
//             setEditOpen(true);
//           }}>✏️ Edit Profile</button>

//           <h3>{data.name}</h3>
//           <span className="role-badge">Student</span>

//           <p>Computer Science and Engineering | BTech</p>

//           <button
//   className="primary-btn"
//   onClick={() => setShowPasswordModal(true)}
// >
//   Change Password
// </button>
//           <button className="secondary-btn">Manage Sessions</button>
//         </div>

//         {/* PERSONAL INFO */}
//         <Section title="Personal Information">
//           <Info label="Full Name" value={data.name} />
//           <Info label="Email Address" value={data.email} />
//           <Info label="Phone Number" value={data.phone} />
//           <Info label="Roll Number" value={data.roll_no} />
//           <Info label="Date of Birth" value={data.DOB} />
//           <Info label="Gender" value={data.gender} />
//           <Info label="Blood Group" value={data.blood_group} />
//           <Info label="Address" value={studentAddress || "Not provided"} />
//         </Section>

//         {/* GUARDIAN INFO */}
//         <Section title="Guardian Information">
//           {Array.isArray(data.guardians) && data.guardians.length > 0 ? (
//             data.guardians.map((guardian, index) => (
//               <div key={guardian.guardian_id || index} className="guardian-profile-card">
//                 <h5 className="guardian-profile-title">Guardian {index + 1}</h5>
//                 <Info label="Name" value={guardian.name} />
//                 <Info label="Phone" value={guardian.phone} />
//                 <Info label="Relationship" value={guardian.relationship} />
//                 <Info
//                   label="Address"
//                   value={[
//                     guardian.house_no,
//                     guardian.street,
//                     guardian.area,
//                     guardian.city,
//                     guardian.state,
//                     guardian.pincode,
//                   ]
//                     .filter(Boolean)
//                     .join(", ") || "Not provided"}
//                 />
//               </div>
//             ))
//           ) : (
//             <>
//               <Info label="Guardian Name" value={data.guardian_name} />
//               <Info label="Guardian Phone" value={data.guardian_phone} />
//               <Info label="Guardian Relationship" value={data.guardian_relationship} />
//               <Info
//                 label="Guardian Address"
//                 value={[
//                   data.guardian_house_no,
//                   data.guardian_street,
//                   data.guardian_area,
//                   data.guardian_city,
//                   data.guardian_state,
//                   data.guardian_pincode,
//                 ]
//                   .filter(Boolean)
//                   .join(", ") || "Not provided"}
//               />
//             </>
//           )}
//         </Section>

//         {/* HOSTEL INFO */}
//         <Section title="Hostel Information">
//           <Info label="Hostel" value={data.hostel_name} />
//           <Info label="Unit" value={data.unit} />
//           <Info label="Room Number" value={data.room_no} />
//         </Section>

//       </div>

//       {editOpen && <EditProfile onClose={() => setEditOpen(false)} />}
//         {showPasswordModal && (
//   <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
// )}
//     </>
//   );
// }

// function Section({ title, children }) {
//   return (
//     <div className="info-section">
//       <h4>{title}</h4>
//       <div className="info-box">{children}</div>
//     </div>
//   );
// }

// function Info({ label, value }) {
//   return (
//     <div className="info-row">
//       <p className="label">{label}</p>
//       <p className="value">{value}</p>
//     </div>
//   );
// }


import ChangePasswordModal from "../../components/ChangePassword";
import { useEffect, useState } from "react";
import { getStudentProfile } from "../../api/student.api";
import StudentLayout from "../../components/StudentLayout";
import { useNavigate } from "react-router-dom";

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide sm:w-36 shrink-0 mt-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value || <span className="text-gray-300 italic">Not provided</span>}</p>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <span className="text-lg">{icon}</span>
        <h4 className="font-bold text-gray-800">{title}</h4>
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  );
}

export default function MyProfile() {
  const navigate = useNavigate();
  const [data,               setData]               = useState(null);
  const [showPasswordModal,  setShowPasswordModal]  = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const res = await getStudentProfile();
    setData(res);
  };

  if (!data)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );

  const studentAddress = [data.house_no, data.street, data.area, data.city, data.state, data.pincode]
    .filter(Boolean).join(", ");

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Hero Card */}
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              <img
                src={data.profile_image || "https://i.pravatar.cc/150"}
                alt="profile"
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-400/50"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-400 text-teal-900 text-xs font-black px-2 py-0.5 rounded-full">
                Student
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black">{data.name}</h2>
              <p className="text-teal-300 text-sm mt-0.5">{data.email}</p>
              <p className="text-teal-300 text-sm">{data.roll_no}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full pt-1">
              <button
                onClick={() => navigate("/student/edit-profile")}
                className="flex-1 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-teal-900 text-sm font-bold transition-colors"
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-colors"
              >
                🔐 Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <Section title="Personal Information" icon="👤">
          <InfoRow label="Full Name"    value={data.name} />
          <InfoRow label="Email"        value={data.email} />
          <InfoRow label="Phone"        value={data.phone} />
          <InfoRow label="Roll Number"  value={data.roll_no} />
          <InfoRow label="Date of Birth" value={data.DOB} />
          <InfoRow label="Gender"       value={data.gender} />
          <InfoRow label="Blood Group"  value={data.blood_group} />
          <InfoRow label="Address"      value={studentAddress || "Not provided"} />
        </Section>

        {/* Guardian Info */}
        <Section title="Guardian Information" icon="👨‍👩‍👧">
          {Array.isArray(data.guardians) && data.guardians.length > 0 ? (
            data.guardians.map((g, i) => (
              <div key={g.guardian_id || i} className={i > 0 ? "mt-4 pt-4 border-t border-gray-100" : ""}>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">
                  Guardian {i + 1}
                </p>
                <InfoRow label="Name"         value={g.name} />
                <InfoRow label="Phone"        value={g.phone} />
                <InfoRow label="Relationship" value={g.relationship} />
                <InfoRow label="Address"      value={[g.house_no, g.street, g.area, g.city, g.state, g.pincode].filter(Boolean).join(", ")} />
              </div>
            ))
          ) : (
            <>
              <InfoRow label="Name"         value={data.guardian_name} />
              <InfoRow label="Phone"        value={data.guardian_phone} />
              <InfoRow label="Relationship" value={data.guardian_relationship} />
              <InfoRow label="Address"      value={[data.guardian_house_no, data.guardian_street, data.guardian_area, data.guardian_city, data.guardian_state, data.guardian_pincode].filter(Boolean).join(", ")} />
            </>
          )}
        </Section>

        {/* Hostel Info */}
        <Section title="Hostel Information" icon="🏠">
          <InfoRow label="Hostel" value={data.hostel_name} />
          <InfoRow label="Unit"   value={data.unit} />
          <InfoRow label="Room"   value={data.room_no} />
        </Section>

      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </StudentLayout>
  );
}
