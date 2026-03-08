// import { useEffect, useState } from "react";
// import { getStudentDashboard } from "../../api/student.api";
// import "../../styles/studentDashboard.css";

// export default function StudentDashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadDashboard = async () => {
//       try {
//         const res = await getStudentDashboard();
//         setData(res);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboard();
//   }, []);

//   if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

//   const { student, room, stats } = data;

//   return (
//     <div className="student-dashboard">

//       {/* HEADER */}
//       <header className="dash-header">
//         <h2>HMS</h2>
//         <img
//           src={student.profile_image || "https://i.pravatar.cc/100"}
//           alt="profile"
//           className="profile-img"
//         />
//       </header>

//       {/* PROFILE */}
//       <div className="profile-card">
//         <img
//           src={student.profile_image || "https://i.pravatar.cc/100"}
//           alt="profile"
//           className="profile-big"
//         />

//         <h2>{student.name}</h2>
//         <p>{student.roll_no}</p>
//         <p>{student.program}</p>
//       </div>

//       {/* STATS */}
//       <div className="stats-grid">
//         <div className="stat-card purple">
//           <h4>Lost Items</h4>
//           <p>{stats.lost}</p>
//         </div>

//         <div className="stat-card green">
//           <h4>Claimed</h4>
//           <p>{stats.claimed}</p>
//         </div>

//         <div className="stat-card blue">
//           <h4>Complaints</h4>
//           <p>{stats.complaints}</p>
//         </div>
//       </div>

//       {/* ROOM */}
//       <div className="room-card">
//         <h3>Your Room</h3>
//         <h1>{room.room_no}</h1>
//         <p>
//           {room.occupied}/{room.capacity} Occupied
//         </p>

//         <div className="roommates">
//           <strong>Roommates:</strong>
//           <p>{room.roommates.join(", ")}</p>
//         </div>
//       </div>

//       {/* COMPLAINTS */}
//       <div className="complaint-card">
//         <h3>Your Complaints</h3>

//         {stats.complaints === 0 ? (
//           <p className="empty">No active complaints</p>
//         ) : (
//           <p>You have active complaints</p>
//         )}

//         <button className="primary-btn">
//           Submit New Complaint
//         </button>
//       </div>

//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../api/student.api";
import "../../styles/studentDashboard.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";


export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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

  if (!data) return <p className="loading">Loading...</p>;

  const { student, room, stats } = data;

  return (
    <div className="dash-container">

      {/* HEADER */}
   
      <Header
  onMenuClick={() => setMenuOpen(true)}
  user={student}
  profileOpen={profileOpen}
  setProfileOpen={setProfileOpen}
/>


      {/* SIDEBAR */}

    <Sidebar
  open={menuOpen}
  onClose={() => setMenuOpen(false)}
  user={{
    name: student.name,
    email: student.email,
    profile_image: student.profile_image,
  }}
/>

      {/* MAIN */}
      <main className="dash-main">

        {/* PROFILE CARD */}
        <div className="profile-card">

          <img
            src={student.profile_image || "https://i.pravatar.cc/100"}
            alt=""
          />

          <h3>{student.name}</h3>

          <p>🎓 {student.roll_no}</p>
          <p>📘 {student.program}</p>

          <span className="badge">{room.block}</span>

        </div>

        {/* STATS */}
        <div className="stats-list">

          <div className="stat green">
            <p>Lost & Found</p>
            <h2>{stats.lost}</h2>
          </div>

          <div className="stat blue">
            <p>In Progress</p>
            <h2>{stats.inProgress}</h2>
          </div>

          <div className="stat orange">
            <p>Pending</p>
            <h2>{stats.pending}</h2>
          </div>

        </div>

        {/* ROOM */}
        <div className="room-card">

          <div className="room-header">
            <h3>Your Room</h3>
            <span>{room.block}</span>
          </div>

          <h1>{room.room_no}</h1>

          <p>
            👥 {room.occupied}/{room.capacity} Occupied
          </p>

          <p className="roommates">
            Roommates: {room.roommates.join(", ")}
          </p>

        </div>

        {/* LOST & FOUND */}
        <div className="lf-card">

          <div className="section-head">
            <h3>Lost & Found</h3>
            <span>View All</span>
          </div>

          <div className="lf-grid">

            <div className="lf-box orange">
              <h2>{stats.lost}</h2>
              <p>Active Items</p>
            </div>

            <div className="lf-box green">
              <h2>{stats.claimed}</h2>
              <p>Claimed</p>
            </div>

          </div>

          <button className="browse-btn">
            Browse Active Items
          </button>

        </div>

        {/* COMPLAINTS */}
        <div className="complaint-card">

          <div className="section-head">
            <h3>Your Complaints</h3>
            <span>View All</span>
          </div>

          {stats.complaints === 0 ? (
            <p className="empty">
              No active complaints <br />
              <span>Submit a new complaint</span>
            </p>
          ) : (
            <p>You have active complaints</p>
          )}

        </div>

      </main>
    </div>
  );
}
