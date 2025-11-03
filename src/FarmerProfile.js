import React, { useState } from "react";

function FarmerProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-[400px] mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Farmer Profile</h2>

      <div className="flex flex-col items-center gap-3">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full border flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded"
        />
      </div>
    </div>
  );
}

export default FarmerProfile;
