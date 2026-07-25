import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BASE_URL } from "./config";

function CustomerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    state: "",
    age: "",
    gender: "",
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
      const payload = { ...formData, role: "CUSTOMER", aadhaar: null, address: null };
      const res = await axios.post(`${BASE_URL}/api/users/register`, payload);
      if (res.data.success) {
        alert("✅ Customer registered successfully!");
        navigate("/customer-login");
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
    <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#dcfce7", padding: "1rem"}}>
      <form onSubmit={handleSubmit} style={{background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px"}}>
        <h2 style={{textAlign: "center", color: "#047857", marginBottom: "1.5rem"}}>Customer Register</h2>

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />
        <select name="gender" value={formData.gender} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem", color: formData.gender ? "#000" : "#999"}} required>
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} style={{width: "100%", padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} required />

        <button type="submit" disabled={loading} style={{width: "100%", background: "#16a34a", color: "white", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "bold", border: "none", cursor: "pointer"}}>
          {loading ? "Registering..." : "Register"}
        </button>

        <button type="button" onClick={() => navigate("/customer-login")} style={{width: "100%", background: "#eab308", color: "white", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "0.75rem"}}>
          Already have account? Login
        </button>
      </form>
    </div>
  );
}

export default CustomerRegister;