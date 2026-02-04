import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../api/student.api";
import "./studentDashboard.css";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getStudentDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const { student, room, stats } = data;

  return (
    <div className="student-dashboard">

      {/* HEADER */}
      <header className="dash-header">
        <h2>HMS</h2>
        <img
          src={student.profile_image || "https://i.pravatar.cc/100"}
          alt="profile"
          className="profile-img"
        />
      </header>

      {/* PROFILE */}
      <div className="profile-card">
        <img
          src={student.profile_image || "https://i.pravatar.cc/100"}
          alt="profile"
          className="profile-big"
        />

        <h2>{student.name}</h2>
        <p>🎓 {student.roll_no}</p>
        <p>📘 {student.program}</p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <h4>Lost Items</h4>
          <p>{stats.lost}</p>
        </div>

        <div className="stat-card green">
          <h4>Claimed</h4>
          <p>{stats.claimed}</p>
        </div>

        <div className="stat-card blue">
          <h4>Complaints</h4>
          <p>{stats.complaints}</p>
        </div>
      </div>

      {/* ROOM */}
      <div className="room-card">
        <h3>Your Room</h3>
        <h1>{room.room_no}</h1>
        <p>
          {room.occupied}/{room.capacity} Occupied
        </p>

        <div className="roommates">
          <strong>Roommates:</strong>
          <p>{room.roommates.join(", ")}</p>
        </div>
      </div>

      {/* COMPLAINTS */}
      <div className="complaint-card">
        <h3>Your Complaints</h3>

        {stats.complaints === 0 ? (
          <p className="empty">No active complaints</p>
        ) : (
          <p>You have active complaints</p>
        )}

        <button className="primary-btn">
          Submit New Complaint
        </button>
      </div>

    </div>
  );
}
