
// import { useEffect, useState } from "react";
// import { getStudentDashboard } from "../../api/student.api";
// import "../../styles/studentDashboard.css";
// import Sidebar from "../../components/Sidebar";
// import Header from "../../components/Header";


// export default function StudentDashboard() {
//   const [data, setData] = useState(null);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const res = await getStudentDashboard();
//       setData(res);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   if (!data) return <p className="loading">Loading...</p>;

//   const { student, room, stats } = data;

//   return (
//     <div className="dash-container">

//       {/* HEADER */}
   
//       <Header
//   onMenuClick={() => setMenuOpen(true)}
//   user={student}
//   profileOpen={profileOpen}
//   setProfileOpen={setProfileOpen}
// />


//       {/* SIDEBAR */}

//     <Sidebar
//   open={menuOpen}
//   onClose={() => setMenuOpen(false)}
//   user={{
//     name: student.name,
//     email: student.email,
//     profile_image: student.profile_image,
//   }}
// />

//       {/* MAIN */}
//       <main className="dash-main">

//         {/* PROFILE CARD */}
//         <div className="profile-card">

//           <img
//             src={student.profile_image || "https://i.pravatar.cc/100"}
//             alt=""
//           />

//           <h3>{student.name}</h3>

//           <p>🎓 {student.roll_no}</p>
//           <p>📘 {student.program}</p>

//           <span className="badge">{room.block}</span>

//         </div>

//         {/* STATS */}
//         <div className="stats-list">

//           <div className="stat green">
//             <p>Lost & Found</p>
//             <h2>{stats.lost}</h2>
//           </div>

//           <div className="stat blue">
//             <p>In Progress</p>
//             <h2>{stats.inProgress}</h2>
//           </div>

//           <div className="stat orange">
//             <p>Pending</p>
//             <h2>{stats.pending}</h2>
//           </div>

//         </div>

//         {/* ROOM */}
//         <div className="room-card">

//           <div className="room-header">
//             <h3>Your Room</h3>
//             <span>{room.block}</span>
//           </div>

//           <h1>{room.room_no}</h1>

//           <p>
//             👥 {room.occupied}/{room.capacity} Occupied
//           </p>

//           <p className="roommates">
//             Roommates: {room.roommates.join(", ")}
//           </p>

//         </div>

//         {/* LOST & FOUND */}
//         <div className="lf-card">

//           <div className="section-head">
//             <h3>Lost & Found</h3>
//             <span>View All</span>
//           </div>

//           <div className="lf-grid">

//             <div className="lf-box orange">
//               <h2>{stats.lost}</h2>
//               <p>Active Items</p>
//             </div>

//             <div className="lf-box green">
//               <h2>{stats.claimed}</h2>
//               <p>Claimed</p>
//             </div>

//           </div>

//           <button className="browse-btn">
//             Browse Active Items
//           </button>

//         </div>

//         {/* COMPLAINTS */}
//         <div className="complaint-card">

//           <div className="section-head">
//             <h3>Your Complaints</h3>
//             <span>View All</span>
//           </div>

//           {stats.complaints === 0 ? (
//             <p className="empty">
//               No active complaints <br />
//               <span>Submit a new complaint</span>
//             </p>
//           ) : (
//             <p>You have active complaints</p>
//           )}

//         </div>

//       </main>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../api/student.api";
import StudentLayout from "../../components/StudentLayout";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getStudentDashboard();
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );

  const { student, room, stats } = data;

  const statCards = [
    { label: "Lost & Found", value: stats.lost, color: "bg-teal-50 text-teal-700 border-teal-100", icon: "🔍" },
    { label: "In Progress", value: stats.inProgress, color: "bg-blue-50 text-blue-700 border-blue-100", icon: "⚙️" },
    { label: "Pending", value: stats.pending, color: "bg-amber-50 text-amber-700 border-amber-100", icon: "⏳" },
    { label: "Complaints", value: stats.complaints, color: "bg-rose-50 text-rose-700 border-rose-100", icon: "📋" },
  ];

  return (
    <StudentLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Profile and Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src={student.profile_image || "https://i.pravatar.cc/100"}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-400/50 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">{student.name}</h2>
                <p className="text-teal-300 text-sm mt-0.5">🎓 {student.roll_no}</p>
                <p className="text-teal-300 text-sm">📘 {student.program}</p>
              </div>
              <span className="shrink-0 bg-emerald-400 text-teal-900 text-xs font-bold px-3 py-1.5 rounded-full">
                {room.block}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {statCards.map(({ label, value, color, icon }) => (
              <div key={label} className={`rounded-2xl border p-4 flex flex-col gap-1 shadow-sm ${color}`}>
                <span className="text-xl">{icon}</span>
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-xs font-medium opacity-75">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Room details, Complaints & Lost/Found */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Your Room</h3>
              <span className="text-xs bg-teal-50 text-teal-700 font-medium px-2.5 py-1 rounded-full border border-teal-100">
                {room.block}
              </span>
            </div>

            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black text-teal-700">{room.room_no}</span>
              <span className="text-sm text-gray-400 mb-1.5">
                👥 {room.occupied}/{room.capacity} Occupied
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1 font-medium">ROOMMATES</p>
              <p className="text-sm text-gray-700 font-medium">
                {room.roommates?.join(", ") || "No roommates yet"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lost & Found Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">Lost & Found</h3>
                  <button
                    onClick={() => navigate("/student/lost-found")}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    View All →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                    <h2 className="text-3xl font-black text-amber-600">{stats.lost}</h2>
                    <p className="text-xs text-amber-600 font-medium mt-0.5">Active Items</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                    <h2 className="text-3xl font-black text-emerald-600">{stats.claimed}</h2>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">Claimed</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/student/lost-found")}
                className="w-full py-2.5 rounded-xl border border-teal-200 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
              >
                Browse Active Items
              </button>
            </div>

            {/* Complaints Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">Your Complaints</h3>
                  <button
                    onClick={() => navigate("/student/complaints")}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    View All →
                  </button>
                </div>

                {stats.complaints === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-2xl mb-1">✅</p>
                    <p className="text-sm font-semibold text-gray-600">No active complaints</p>
                    <p className="text-xs text-gray-400 mt-0.5">Everything looks good!</p>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-4">
                    <p className="text-sm font-medium text-rose-700">
                      You have <span className="font-bold">{stats.complaints}</span> active complaint{stats.complaints !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/student/complaints")}
                className="w-full mt-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-md shadow-teal-100"
              >
                Submit New Complaint
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
