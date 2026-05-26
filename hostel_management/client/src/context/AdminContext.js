import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin_session");
    if (!stored) { navigate("/login"); return; }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "HOSTEL_ADMIN" && parsed.role !== "WARDEN") {
        navigate("/login"); return;
      }
      setAdmin(parsed);
    } catch { navigate("/login"); }
    finally { setLoading(false); }
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AdminContext.Provider value={{ admin, loading, logout }}>
      {!loading && children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}