import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "./Config";

function FarmerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/users/login`, { email, password });
      if (res.data.success && res.data.user) {
        if (res.data.user.role !== "FARMER") {
          alert("This login is for farmers only!");
          return;
        }
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("farmfusion_user", JSON.stringify(res.data.user));
        navigate("/farmer-dashboard", { state: { user: res.data.user } });
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fef3c7"}}>
      <form onSubmit={handleLogin} style={{background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px"}}>
        <h2 style={{textAlign: "center", color: "#92400e", marginBottom: "2rem"}}>Farmer Login</h2>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{width: "100%", padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{width: "100%", padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />

        <button type="submit" disabled={loading} style={{width: "100%", background: "#ca8a04", color: "white", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "bold", border: "none", cursor: "pointer"}}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button type="button" onClick={() => navigate("/farmer-register")} style={{width: "100%", background: "#eab308", color: "white", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "1rem"}}>Register</button>
        <button type="button" onClick={() => navigate("/")} style={{width: "100%", background: "#6b7280", color: "white", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "0.5rem"}}>Back</button>
      </form>
    </div>
  );
}

export default FarmerLogin;