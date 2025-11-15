import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CustomerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fixed: single, well-formed handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "customer"
      };

      const res = await axios.post("http://localhost:8080/api/users/register", payload);

      if (res.data.success) {
        const user = res.data.user || payload; // fallback if backend doesn't return user
        localStorage.setItem("farmfusion_user", JSON.stringify(user));
        alert("Customer registered successfully!");
        navigate("/customer-dashboard", { state: { user } });
      } else {
        alert(res.data.message || "Registration failed!");
      }
    } catch (err) {
      alert("Error registering: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[400px] flex flex-col items-center">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Customer Registration</h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" className="border p-2 rounded" value={formData.name} onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" className="border p-2 rounded" value={formData.age} onChange={handleChange} required />
          <select name="gender" className="border p-2 rounded" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="tel" name="phone" placeholder="Phone Number" className="border p-2 rounded" value={formData.phone} onChange={handleChange} required />
          <input type="text" name="city" placeholder="City" className="border p-2 rounded" value={formData.city} onChange={handleChange} required />
          <input type="text" name="state" placeholder="State" className="border p-2 rounded" value={formData.state} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="border p-2 rounded" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="border p-2 rounded" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" className="border p-2 rounded" value={formData.confirmPassword} onChange={handleChange} required />

          <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition">
            Register
          </button>
        </form>

        {/* Login Button */}
        <button onClick={() => navigate("/customer-login")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded mt-4 w-full transition">
          Login
        </button>

        {/* Go to Homepage */}
        <button onClick={() => navigate("/")} className="mt-4 text-green-700 font-semibold hover:underline">
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default CustomerRegister;
