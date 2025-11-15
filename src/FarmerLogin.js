import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function FarmerLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:8080/api/users/login", {
          email: username, // or email for customer
          password : password,
        });
        if (res.data.success) {
          const user = res.data.user;
          alert(`Welcome, ${user.name}!`);
          localStorage.setItem("farmfusion_user", JSON.stringify(user));
          navigate(user.role === "FARMER" ? "/farmer-dashboard" : "/customer-dashboard", { state: { user } });
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        alert("Login failed: " + err.message);
      }
    };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-4xl font-bold text-green-700 mb-8">Farmer Login</h1>

      {/* Blurry transparent form */}
      <form
        onSubmit={handleLogin} // ✅ handle login
        className="bg-white/30 backdrop-blur-lg p-8 rounded-xl shadow-md flex flex-col gap-4 w-80"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-white/50 rounded-md px-3 py-2 bg-white/20 placeholder-gray-700 text-gray-900"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-white/50 rounded-md px-3 py-2 bg-white/20 placeholder-gray-700 text-gray-900"
          required
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 rounded-md font-semibold hover:bg-yellow-600 transition"
        >
          Login
        </button>

        {/* Register Button */}
        <button
          type="button"
          onClick={() => navigate("/farmer-register")}
          className="bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition"
        >
          Register
        </button>
      </form>

      <button
        onClick={() => navigate("/")}
        className="mt-6 text-green-700 underline hover:text-green-900"
      >
        Back to Home
      </button>
    </div>
  );
}

export default FarmerLogin;
