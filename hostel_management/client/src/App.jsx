// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
       
//       </div>
//     </>
//   )
// }

// export default App
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import ChangePassword from "./components/ChangePassword";
import IDCard from "./pages/student/IDCard";
// import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyProfile from "./pages/student/MyProfile";
import EditProfile from "./pages/student/EditProfile";
import Complaints from "./pages/student/Complaints";
import LostFound from "./pages/student/LostFound";


import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentManagement from "./pages/admin/StudentManagement";
import AdminLostFound from "./pages/admin/LostFound";
import Notifications from "./pages/admin/Notifications";
import RoomAllocation from "./pages/admin/RoomAllocation";
import ComplaintsManagement from "./pages/admin/ComplaintsManagement";
import AdminVisitorRequests from "./pages/admin/VisitorRequests";
import WardenStaffManagement from "./pages/admin/WardenStaffManagement";
import IDCardVerification from "./pages/admin/IDCardVerification";
// import WardenDashboard from "./pages/warden/WardenDashboard";
// import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import VisitorRequests from "./pages/student/VisitorRequests";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Welcome/>}/>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="STUDENT">
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/complaints"
          element={
            <ProtectedRoute role="STUDENT">
              <Complaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/lost-found"
          element={
            <ProtectedRoute role="STUDENT">
              <LostFound />
            </ProtectedRoute>
          }
        />

        <Route
         path="/student/change-password"
         element={
          <ProtectedRoute role="STUDENT">
          <ChangePassword />
          </ProtectedRoute>
          }
        />

        <Route
        path="/student/edit-profile"
        element={
         <ProtectedRoute role="STUDENT">
         <EditProfile />
         </ProtectedRoute>
         }
        />

        <Route
  path="/student/id-card"
  element={
    <ProtectedRoute role="STUDENT">
      <IDCard />
    </ProtectedRoute>
  }
/>
        <Route
         path="/student/visitors"
          element={
          <ProtectedRoute role="STUDENT">
           <VisitorRequests />
            </ProtectedRoute>} />
        {/* Warden */}
        {/* <Route
          path="/warden"
          element={
            <ProtectedRoute role="WARDEN">
              <WardenDashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* Admin */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <StudentManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/lost-found"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <AdminLostFound />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <RoomAllocation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <ComplaintsManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/visitors"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <AdminVisitorRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <WardenStaffManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/id-cards"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <IDCardVerification />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}