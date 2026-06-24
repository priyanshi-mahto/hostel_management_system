// import { useState, useEffect } from "react";
// import Header from "../../components/Header";
// import Sidebar from "../../components/Sidebar";
// import axios from "../../api/axios";
// import { getStudentProfile } from "../../api/student.api";
// import "../../styles/idcard.css";

// export default function IDCard() {

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   const [student, setStudent] = useState(null);

//   const [front, setFront] = useState(null);
//   const [back, setBack] = useState(null);

//   const [frontPreview, setFrontPreview] = useState(null);
//   const [backPreview, setBackPreview] = useState(null);

//   const [status, setStatus] = useState("PENDING");
//   const [rejectionReason, setRejectionReason] = useState("");

//   useEffect(() => {
//     loadIDCard();
//     loadProfile();
//   }, []);

//   const loadIDCard = async () => {
//     try {

//       const res = await axios.get("/student/id-card");

//       // server returns filenames (e.g. "1234567890-file.png"). Build full URLs
//       const apiBase = (axios.defaults?.baseURL || "").replace(/\/+api\/?$/i, "");
//       const frontUrl = res.data.front
//         ? (res.data.front.startsWith("http") ? res.data.front : `${apiBase}/uploads/idcards/${res.data.front}`)
//         : null;
//       const backUrl = res.data.back
//         ? (res.data.back.startsWith("http") ? res.data.back : `${apiBase}/uploads/idcards/${res.data.back}`)
//         : null;

//       setFrontPreview(frontUrl);
//       setBackPreview(backUrl);
//       setStatus(res.data.status);
//       setRejectionReason(res.data.rejection_reason || "");

//     } catch (err) {
//       // If backend returns 404 it means no id card uploaded yet — do not treat as error
//       if (err?.response?.status === 404) return;
//       console.error("Failed to load ID card", err);
//     }
//   };

//   const loadProfile = async () => {
//     try {
//       const p = await getStudentProfile();
//       setStudent(p);
//     } catch (err) {
//       console.error("Failed to load profile", err);
//     }
//   };

//   const handleFrontChange = (e) => {

//     const file = e.target.files[0];

//     if (file.size > 1024 * 1024) {
//       alert("Maximum file size 1MB");
//       return;
//     }

//     setFront(file);
//     setFrontPreview(URL.createObjectURL(file));
//   };

//   const handleBackChange = (e) => {

//     const file = e.target.files[0];

//     if (file.size > 1024 * 1024) {
//       alert("Maximum file size 1MB");
//       return;
//     }

//     setBack(file);
//     setBackPreview(URL.createObjectURL(file));
//   };

//   const uploadImages = async () => {

//     if (status === "VERIFIED") {
//       alert("ID card has been verified and cannot be re-uploaded.");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("front", front);
//     formData.append("back", back);

//     try {

//       await axios.post("/student/upload-id-card", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       });

//       alert("ID card uploaded successfully");

//       loadIDCard();

//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }

//   };
//   if (!student) return <p>Loading...</p>;

//   return (
//     <>
//       <Header onMenuClick={() => setMenuOpen(true)} user={student} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
//       <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} user={student} />

//       <div className="idcard-page">

//         <h2>Student ID Card</h2>

//         <p className="subtitle">
//           Upload and manage your ID card images for verification purposes.
//         </p>

//         <div className="info-box">

//           <p>
//             Please upload clear images of both sides of your student ID card.
//             These images will be used for verification purposes by hostel staff
//             and security personnel.
//           </p>

//           <p><b>Maximum file size: 1MB per image</b></p>

//         </div>

//         {/* STATUS */}
//         <div className={`status-badge ${status ? status.toLowerCase() : 'none'}`}>
//           Status: {status || 'NOT UPLOADED'}
//         </div>

//         {status === "REJECTED" && rejectionReason && (
//           <div className="info-box" style={{ borderLeft: "4px solid #ef4444", marginTop: "12px" }}>
//             <p><b>Rejection reason:</b> {rejectionReason}</p>
//           </div>
//         )}

//         {/* FRONT */}
//         <div className="card-section">

//           <h3>ID Card Front</h3>

//           <div className="image-box">
//             {frontPreview ? (
//               <img src={frontPreview} alt="Front ID" />
//             ) : (
//               <p>No image uploaded</p>
//             )}
//           </div>

//           {status !== "VERIFIED" ? (
//             <label className="change-btn">
//               Change Image
//               <input type="file" hidden onChange={handleFrontChange} />
//             </label>
//           ) : (
//             <div className="change-disabled">Verified — upload disabled</div>
//           )}

//         </div>

//         {/* BACK */}
//         <div className="card-section">

//           <h3>ID Card Back</h3>

//           <div className="image-box">
//             {backPreview ? (
//               <img src={backPreview} alt="Back ID" />
//             ) : (
//               <p>No image uploaded</p>
//             )}
//           </div>

//           {status !== "VERIFIED" ? (
//             <label className="change-btn">
//               Change Image
//               <input type="file" hidden onChange={handleBackChange} />
//             </label>
//           ) : (
//             <div className="change-disabled">Verified — upload disabled</div>
//           )}

//         </div>

//         <button className="upload-btn" onClick={uploadImages} disabled={status === "VERIFIED"}>
//           Upload ID Card
//         </button>

//       </div>
//     </>
//   );
// }



import { useState, useEffect } from "react";
import StudentLayout from "../../components/StudentLayout";
import axios from "../../api/axios";
import { getStudentProfile } from "../../api/student.api";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiCreditCard,
  FiImage,
  FiLock,
  FiFolder,
  FiInfo,
  FiUploadCloud,
  FiClock
} from "react-icons/fi";

const statusConfig = {
  PENDING:  { label: "Pending Review", color: "bg-amber-100 text-amber-700 border-amber-200",   icon: <FiClock className="w-5 h-5" /> },
  VERIFIED: { label: "Verified",       color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <FiCheckCircle className="w-5 h-5" /> },
  REJECTED: { label: "Rejected",       color: "bg-red-100 text-red-600 border-red-200",          icon: <FiXCircle className="w-5 h-5" /> },
};

function ImageUploadBox({ label, preview, onChange, disabled }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
        <FiCreditCard className="w-4 h-4 text-teal-600" />
        <h3 className="font-bold text-gray-700 text-sm">{label}</h3>
      </div>

      <div className="p-5">
        {/* Image Preview Area */}
        <div className="w-full h-44 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden mb-4">
          {preview ? (
            <img src={preview} alt={label} className="w-full h-full object-contain" />
          ) : (
            <div className="text-center">
              <FiImage className="w-8 h-8 text-gray-300 mx-auto mb-1" />
              <p className="text-xs text-gray-400">No image uploaded</p>
            </div>
          )}
        </div>

        {disabled ? (
          <div className="w-full py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-400 text-center font-medium flex items-center justify-center gap-1.5">
            <FiLock className="w-3.5 h-3.5" /> Verified — upload disabled
          </div>
        ) : (
          <label className="block w-full py-2.5 rounded-xl border border-teal-200 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5">
            <FiFolder className="w-4 h-4" /> Change Image
            <input type="file" accept="image/*" hidden onChange={onChange} />
          </label>
        )}
      </div>
    </div>
  );
}

export default function IDCard() {
  const [student,        setStudent]        = useState(null);
  const [front,          setFront]          = useState(null);
  const [back,           setBack]           = useState(null);
  const [frontPreview,   setFrontPreview]   = useState(null);
  const [backPreview,    setBackPreview]    = useState(null);
  const [status,         setStatus]         = useState("PENDING");
  const [rejectionReason, setRejectionReason] = useState("");
  const [uploading,      setUploading]      = useState(false);

  useEffect(() => { loadIDCard(); loadProfile(); }, []);

  const loadIDCard = async () => {
    try {
      const res = await axios.get("/student/id-card");
      const apiBase = (axios.defaults?.baseURL || "").replace(/\/+api\/?$/i, "");
      const toUrl = (f) => f ? (f.startsWith("http") ? f : `${apiBase}/uploads/idcards/${f}`) : null;
      setFrontPreview(toUrl(res.data.front));
      setBackPreview(toUrl(res.data.back));
      setStatus(res.data.status);
      setRejectionReason(res.data.rejection_reason || "");
    } catch (err) {
      if (err?.response?.status !== 404) console.error("Failed to load ID card", err);
    }
  };

  const loadProfile = async () => {
    try { setStudent(await getStudentProfile()); }
    catch (err) { console.error("Failed to load profile", err); }
  };

  const handleFile = (setter, previewSetter) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { alert("Maximum file size 1MB"); return; }
    setter(file);
    previewSetter(URL.createObjectURL(file));
  };

  const uploadImages = async () => {
    if (status === "VERIFIED") { alert("ID card has been verified and cannot be re-uploaded."); return; }
    if (!front || !back) { alert("Please select both front and back images."); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("front", front);
      formData.append("back", back);
      await axios.post("/student/upload-id-card", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("ID card uploaded successfully");
      loadIDCard();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!student)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const sc = statusConfig[status] || statusConfig.PENDING;

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex gap-3">
          <FiInfo className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-blue-700">Upload clear images of both sides of your student ID card for verification by hostel staff and security.</p>
            <p className="text-xs text-blue-500 font-semibold">Maximum file size: 1MB per image</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border font-medium ${sc.color}`}>
          <span className="text-lg">{sc.icon}</span>
          <div>
            <p className="text-sm font-bold">Status: {sc.label}</p>
            {status === "PENDING" && <p className="text-xs opacity-70">Your ID card is under review</p>}
          </div>
        </div>

        {/* Rejection Reason */}
        {status === "REJECTED" && rejectionReason && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-2xl px-5 py-4">
            <p className="text-sm font-bold text-red-700 mb-0.5">Rejection Reason</p>
            <p className="text-sm text-red-600">{rejectionReason}</p>
          </div>
        )}

        {/* Image Upload Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUploadBox
            label="ID Card — Front"
            preview={frontPreview}
            onChange={handleFile(setFront, setFrontPreview)}
            disabled={status === "VERIFIED"}
          />
          <ImageUploadBox
            label="ID Card — Back"
            preview={backPreview}
            onChange={handleFile(setBack, setBackPreview)}
            disabled={status === "VERIFIED"}
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={uploadImages}
          disabled={status === "VERIFIED" || uploading}
          className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors shadow-lg shadow-teal-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <FiUploadCloud className="w-4 h-4" /> Upload ID Card
            </span>
          )}
        </button>

      </div>
    </StudentLayout>
  );
}
