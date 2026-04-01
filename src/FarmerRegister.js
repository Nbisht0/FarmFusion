import React, { useState } from "react";
import axios from "axios";

// 🔥 Correct backend call using proxy
const registerFarmer = async (farmerData) => {
  try {
   const response = await axios.post("/api/users/register", {
     name: farmerData.name,
     email: farmerData.email,
     password: farmerData.password,
     role: "FARMER",
     address: farmerData.address,
     aadhaar: farmerData.aadhaar,
     phone: farmerData.phone || "",
     city: farmerData.city || "",
     state: farmerData.state || "",
     gender: null,
     age: null,
   });

    return response.data;
  } catch (error) {
    console.error("Error registering farmer:", error);
    return { success: false, message: "Registration failed!" };
  }
};

function FarmerRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    aadhaar: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profileImage: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   const payload = {
     name: formData.name,
     email: formData.email,
     password: formData.password,
     role: "FARMER",
     address: formData.address,
     aadhaar: formData.aadhaar
   };


    const response = await registerFarmer(payload);

    if (response.success) {
      alert("✅ Farmer registered successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        aadhaar: "",
        profileImage: null,
      });
      setPreview(null);

    } else {
      alert("❌ Registration failed: " + response.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-[400px] mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Farmer Registration</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input type="text" name="name" placeholder="Full Name"
          value={formData.name} onChange={handleChange}
          className="border p-2 rounded" required />

        <input type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange}
          className="border p-2 rounded" required />

        <input type="password" name="password" placeholder="Password"
          value={formData.password} onChange={handleChange}
          className="border p-2 rounded" required />

        {/* The following fields will be added to backend LATER */}
        <input type="text" name="address" placeholder="Address"
          value={formData.address} onChange={handleChange}
          className="border p-2 rounded" />

        <input type="text" name="aadhaar" placeholder="Aadhaar Number"
          value={formData.aadhaar} onChange={handleChange}
          className="border p-2 rounded" />

        <input type="file" accept="image/*"
          onChange={handleImageChange} className="border p-2 rounded" />

        {preview && (
          <img src={preview} className="w-20 h-20 rounded-full mx-auto" />
        )}

        <button type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>

      </form>
    </div>
  );
}

export default FarmerRegistration;
