import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import axios from "../../api/axios";
import { getStudentProfile } from "../../api/student.api";
import "../../styles/idcard.css";

export default function IDCard() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [student, setStudent] = useState(null);

  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);

  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  const [status, setStatus] = useState("PENDING");

  useEffect(() => {
    loadIDCard();
    loadProfile();
  }, []);

  const loadIDCard = async () => {
    try {

      const res = await axios.get("/student/id-card");

      // server returns filenames (e.g. "1234567890-file.png"). Build full URLs
      const apiBase = (axios.defaults?.baseURL || "").replace(/\/+api\/?$/i, "");
      const frontUrl = res.data.front
        ? (res.data.front.startsWith("http") ? res.data.front : `${apiBase}/uploads/idcards/${res.data.front}`)
        : null;
      const backUrl = res.data.back
        ? (res.data.back.startsWith("http") ? res.data.back : `${apiBase}/uploads/idcards/${res.data.back}`)
        : null;

      setFrontPreview(frontUrl);
      setBackPreview(backUrl);
      setStatus(res.data.status);

    } catch (err) {
      // If backend returns 404 it means no id card uploaded yet — do not treat as error
      if (err?.response?.status === 404) return;
      console.error("Failed to load ID card", err);
    }
  };

  const loadProfile = async () => {
    try {
      const p = await getStudentProfile();
      setStudent(p);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const handleFrontChange = (e) => {

    const file = e.target.files[0];

    if (file.size > 1024 * 1024) {
      alert("Maximum file size 1MB");
      return;
    }

    setFront(file);
    setFrontPreview(URL.createObjectURL(file));
  };

  const handleBackChange = (e) => {

    const file = e.target.files[0];

    if (file.size > 1024 * 1024) {
      alert("Maximum file size 1MB");
      return;
    }

    setBack(file);
    setBackPreview(URL.createObjectURL(file));
  };

  const uploadImages = async () => {

    if (status === "VERIFIED") {
      alert("ID card has been verified and cannot be re-uploaded.");
      return;
    }

    const formData = new FormData();

    formData.append("front", front);
    formData.append("back", back);

    try {

      await axios.post("/student/upload-id-card", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("ID card uploaded successfully");

      loadIDCard();

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

  };
  if (!student) return <p>Loading...</p>;

  return (
    <>
      <Header onMenuClick={() => setMenuOpen(true)} user={student} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} user={student} />

      <div className="idcard-page">

        <h2>Student ID Card</h2>

        <p className="subtitle">
          Upload and manage your ID card images for verification purposes.
        </p>

        <div className="info-box">

          <p>
            Please upload clear images of both sides of your student ID card.
            These images will be used for verification purposes by hostel staff
            and security personnel.
          </p>

          <p><b>Maximum file size: 1MB per image</b></p>

        </div>

        {/* STATUS */}
        <div className={`status-badge ${status ? status.toLowerCase() : 'none'}`}>
          Status: {status || 'NOT UPLOADED'}
        </div>

        {/* FRONT */}
        <div className="card-section">

          <h3>ID Card Front</h3>

          <div className="image-box">
            {frontPreview ? (
              <img src={frontPreview} alt="Front ID" />
            ) : (
              <p>No image uploaded</p>
            )}
          </div>

          {status !== "VERIFIED" ? (
            <label className="change-btn">
              Change Image
              <input type="file" hidden onChange={handleFrontChange} />
            </label>
          ) : (
            <div className="change-disabled">Verified — upload disabled</div>
          )}

        </div>

        {/* BACK */}
        <div className="card-section">

          <h3>ID Card Back</h3>

          <div className="image-box">
            {backPreview ? (
              <img src={backPreview} alt="Back ID" />
            ) : (
              <p>No image uploaded</p>
            )}
          </div>

          {status !== "VERIFIED" ? (
            <label className="change-btn">
              Change Image
              <input type="file" hidden onChange={handleBackChange} />
            </label>
          ) : (
            <div className="change-disabled">Verified — upload disabled</div>
          )}

        </div>

        <button className="upload-btn" onClick={uploadImages} disabled={status === "VERIFIED"}>
          Upload ID Card
        </button>

      </div>
    </>
  );
}