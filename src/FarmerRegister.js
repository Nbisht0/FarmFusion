import React, { useState } from "react";
import axios from "axios"; // ✅ added axios import

// ✅ added registerFarmer function
const registerFarmer = async (farmerData) => {
  try {
    const response = await axios.post("http://localhost:5000/farmers/register", farmerData);
    return response.data;
  } catch (error) {
    console.error("Error registering farmer:", error);
    return { success: false, message: error.message };
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
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert image file to base64 (optional) for JSON submission
    let imageBase64 = null;
    if (formData.profileImage) {
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(formData.profileImage);
        reader.onload = () => resolve(reader.result);
      });
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      aadhaar: formData.aadhaar,
      profileImage: imageBase64,
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
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="aadhaar"
          placeholder="Aadhaar Number"
          value={formData.aadhaar}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* Profile Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full mx-auto"
          />
        )}

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default FarmerRegistration;
