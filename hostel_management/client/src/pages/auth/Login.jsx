import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/auth.api";
import "../../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting login with:", { email, password });

    try {
      setLoading(true);
      setError("");

      const data = await loginUser({
        email,
        password,
      });

      console.log("Login response:", data);

      // Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect by role
      if (data.role === "STUDENT") {
        navigate("/student");
      } else if (data.role === "WARDEN") {
        navigate("/warden");
      } else if (data.role === "HOSTEL_ADMIN") {
        navigate("/admin");
      }

    } catch (err) {
      console.log("Login error:", err.response?.data);
      setError(
        err.response?.data?.message || err.response?.data?.error || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>HMS</h1>
        <h3>IIT INDORE</h3>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && <p className="error">{error}</p>}

          {/* Button */}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </button>

        </form>

        <p className="forgot">Forgot your password?</p>

      </div>

    </div>
  );
}
