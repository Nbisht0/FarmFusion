import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

function FarmerRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    aadhaar: "",
    phone: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "FARMER",
        address: formData.address,
        aadhaar: formData.aadhaar,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        gender: null,
        age: null,
      };

      const res = await axios.post(`${BASE_URL}/api/users/register`, payload);

      if (res.data.success) {
        alert("Farmer registered successfully!");
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
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[400px] flex flex-col items-center">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Farmer Registration</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">

          <input type="text" name="name" placeholder="Full Name"
            value={formData.name} onChange={handleChange}
            className="border p-2 rounded" required />

          <input type="email" name="email" placeholder="Email"
            value={formData.email} onChange={handleChange}
            className="border p-2 rounded" required />

          <input type="text" name="phone" placeholder="Phone Number"
            value={formData.phone} onChange={handleChange}
            className="border p-2 rounded" />

          <input type="text" name="address" placeholder="Address"
            value={formData.address} onChange={handleChange}
            className="border p-2 rounded" required />

          <input type="text" name="city" placeholder="City"
            value={formData.city} onChange={handleChange}
            className="border p-2 rounded" />

          <input type="text" name="state" placeholder="State"
            value={formData.state} onChange={handleChange}
            className="border p-2 rounded" />

          <input type="text" name="aadhaar" placeholder="Aadhaar Number"
            value={formData.aadhaar} onChange={handleChange}
            className="border p-2 rounded" required />

          <input type="password" name="password" placeholder="Password"
            value={formData.password} onChange={handleChange}
            className="border p-2 rounded" required />

          <input type="password" name="confirmPassword" placeholder="Confirm Password"
            value={formData.confirmPassword} onChange={handleChange}
            className="border p-2 rounded" required />

          <button type="submit" disabled={loading}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <button onClick={() => navigate("/farmer-login")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded mt-4 w-full transition">
          Already have an account? Login
        </button>

        <button onClick={() => navigate("/")}
          className="mt-4 text-green-700 font-semibold hover:underline">
          Go to Homepage
        </button>

      </div>
    </div>
  );
}

export default FarmerRegistration;