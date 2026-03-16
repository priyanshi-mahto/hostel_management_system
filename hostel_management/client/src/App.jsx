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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import ChangePassword from "./components/ChangePassword";
// import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyProfile from "./pages/student/MyProfile";
import EditProfile from "./pages/student/EditProfile";
// import WardenDashboard from "./pages/warden/WardenDashboard";
// import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

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
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute role="HOSTEL_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}