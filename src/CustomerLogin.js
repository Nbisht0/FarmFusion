import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Customer Login:", { email, password });
    alert("Logged in as Customer!");
    // For now, dummy customer data
    const customerData = { name: email.split("@")[0], email, password };
    navigate("/customer-dashboard", { state: { customer: customerData } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[400px] flex flex-col items-center">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Customer Login</h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" className="border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="border p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition">
            Login
          </button>
        </form>

        {/* Register Button */}
        <button onClick={() => navigate("/customer-register")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded mt-4 w-full transition">
          Register
        </button>

        {/* Go to Homepage */}
        <button onClick={() => navigate("/")} className="mt-4 text-green-700 font-semibold hover:underline">
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default CustomerLogin;
