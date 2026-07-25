import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

import { BASE_URL } from "./config";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post(`${BASE_URL}/api/users/login`, { email, password });
      const { user, token } = res.data;

      if (!user || user.role !== "ADMIN") {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("farmfusion_user", JSON.stringify(user));
      navigate("/admin-dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1a3d2b 0%, #2d5940 100%)", padding: "1rem"
    }}>
      <form onSubmit={handleLogin} style={{
        background: "white", borderRadius: "1rem", padding: "2.5rem",
        width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ color: "#1a3d2b", fontSize: "1.5rem", margin: 0 }}>🌿 FarmFusion</h1>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: "0.25rem" }}>Admin Portal</p>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2", color: "#dc2626", padding: "0.65rem 0.9rem",
            borderRadius: "0.5rem", fontSize: "0.85rem", marginBottom: "1rem"
          }}>{error}</div>
        )}

        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "0.3rem" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%", padding: "0.65rem 0.9rem", borderRadius: "0.5rem",
            border: "1.5px solid #e5e7eb", marginBottom: "1rem", fontSize: "0.9rem",
            outline: "none", boxSizing: "border-box"
          }}
        />

        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "0.3rem" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%", padding: "0.65rem 0.9rem", borderRadius: "0.5rem",
            border: "1.5px solid #e5e7eb", marginBottom: "1.5rem", fontSize: "0.9rem",
            outline: "none", boxSizing: "border-box"
          }}
        />

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "none",
          background: "#1a3d2b", color: "white", fontWeight: "700", fontSize: "0.95rem",
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1
        }}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}