import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/users/login`, {
        email,
        password,
      });

      const { success, user } = res.data;

      if (success && user) {
        // Check role — customer hi login kar sake yahan
        if (user.role !== "CUSTOMER") {
          alert("This login is for customers only!");
          return;
        }

        localStorage.setItem("farmfusion_user", JSON.stringify(user));
        navigate("/customer-dashboard", { state: { user } });

      } else {
        alert(res.data.message || "Login failed!");
      }

    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[400px] flex flex-col items-center">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Customer Login</h2>

        <form className="flex flex-col gap-4 w-full" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={() => navigate("/customer-register")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded mt-4 w-full transition"
        >
          Register
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-green-700 font-semibold hover:underline"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default CustomerLogin;