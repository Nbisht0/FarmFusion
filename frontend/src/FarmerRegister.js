import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "./config";

function FarmerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    state: "",
    aadhaar: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, role: "FARMER", gender: null, age: null };
      const res = await axios.post(`${BASE_URL}/api/users/register`, payload);
      if (res.data.success) {
        alert("✅ Farmer registered successfully!");
        navigate("/farmer-login");
      } else {
        alert(res.data.message || "Registration failed!");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fef3c7", padding: "1rem"}}>
      <form onSubmit={handleSubmit} style={{background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px"}}>
        <h2 style={{textAlign: "center", color: "#92400e", marginBottom: "1.5rem"}}>Farmer Register</h2>

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
        <input type="text" name="aadhaar" placeholder="Aadhaar" value={formData.aadhaar} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />

        <button type="submit" disabled={loading} style={{width: "100%", background: "#ca8a04", color: "white", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "bold", border: "none", cursor: "pointer"}}>
          {loading ? "Registering..." : "Register"}
        </button>
        <button type="button" onClick={() => navigate("/farmer-login")} style={{width: "100%", background: "#eab308", color: "white", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "0.75rem"}}>
          Login
        </button>
      </form>
    </div>
  );
}

export default FarmerRegister;