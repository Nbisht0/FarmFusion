import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

function FarmerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/users/login`, {
        email: email,
        password: password,
      });

      const { success, user } = res.data;

      if (success && user) {
        // Only farmers can login here
        if (user.role !== "FARMER") {
          alert("This login is for farmers only!");
          return;
        }

        localStorage.setItem("farmfusion_user", JSON.stringify(user));
        navigate("/farmer-dashboard", { state: { user } });

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-4xl font-bold text-green-700 mb-8">Farmer Login</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white/30 backdrop-blur-lg p-8 rounded-xl shadow-md flex flex-col gap-4 w-80"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          disabled={loading}
          className="bg-yellow-500 text-white py-2 rounded-md font-semibold hover:bg-yellow-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

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