import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

import { BASE_URL } from "./Config";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("farmers");

  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  // ---- Auth guard ----
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("farmfusion_user") || "null");
    if (!stored || stored.role !== "ADMIN") {
      navigate("/admin-login");
      return;
    }
    setAdmin(stored);
  }, [navigate]);

  // ---- Data loaders ----
  const loadFarmers = () => {
    setLoading(true);
    axiosInstance.get(`${BASE_URL}/api/admin/farmers`)
      .then(res => setFarmers(res.data || []))
      .catch(() => setActionMsg("Failed to load farmers."))
      .finally(() => setLoading(false));
  };

  const loadProducts = () => {
    setLoading(true);
    axiosInstance.get(`${BASE_URL}/api/admin/products`, { params: { page: 0, size: 50 } })
      .then(res => setProducts(res.data?.content || []))
      .catch(() => setActionMsg("Failed to load products."))
      .finally(() => setLoading(false));
  };

  const loadStats = () => {
    setLoading(true);
    axiosInstance.get(`${BASE_URL}/api/admin/orders/stats`)
      .then(res => setStats(res.data))
      .catch(() => setActionMsg("Failed to load stats."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!admin) return;
    if (activeTab === "farmers") loadFarmers();
    if (activeTab === "products") loadProducts();
    if (activeTab === "stats") loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, admin]);

  // ---- Actions ----
  const handleApprove = (id) => {
    axiosInstance.put(`${BASE_URL}/api/admin/farmers/${id}/approve`)
      .then(() => {
        setActionMsg("Farmer approved.");
        setFarmers(prev => prev.map(f => f.id === id ? { ...f, status: "ACTIVE" } : f));
      })
      .catch(() => setActionMsg("Failed to approve farmer."));
  };

  const handleBlock = (id) => {
    axiosInstance.put(`${BASE_URL}/api/admin/farmers/${id}/block`)
      .then(() => {
        setActionMsg("Farmer blocked.");
        setFarmers(prev => prev.map(f => f.id === id ? { ...f, status: "BLOCKED" } : f));
      })
      .catch(() => setActionMsg("Failed to block farmer."));
  };

  const handleRemoveProduct = (id) => {
    if (!window.confirm("Remove this product permanently?")) return;
    axiosInstance.delete(`${BASE_URL}/api/admin/products/${id}`)
      .then(() => {
        setActionMsg("Product removed.");
        setProducts(prev => prev.filter(p => p.id !== id));
      })
      .catch(() => setActionMsg("Failed to remove product."));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("farmfusion_user");
    navigate("/admin-login");
  };

  if (!admin) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "#1a3d2b", color: "white", padding: "1rem 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem"
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>🌿 FarmFusion Admin</h2>
          <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.8 }}>Logged in as {admin.name}</p>
        </div>
        <button onClick={handleLogout} style={{
          background: "rgba(255,255,255,0.15)", color: "white", border: "none",
          padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600"
        }}>Logout</button>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 2rem", display: "flex", gap: "0.5rem" }}>
        {[
          { key: "farmers", label: "👨‍🌾 Farmers" },
          { key: "products", label: "📦 Products" },
          { key: "stats", label: "📊 Orders & Revenue" }
        ].map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setActionMsg(""); }} style={{
            padding: "0.9rem 1.2rem", border: "none", background: "none", cursor: "pointer",
            fontWeight: "600", fontSize: "0.9rem",
            color: activeTab === tab.key ? "#1a3d2b" : "#9ca3af",
            borderBottom: activeTab === tab.key ? "3px solid #1a3d2b" : "3px solid transparent"
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
        {actionMsg && (
          <div style={{
            background: "#f0fdf4", color: "#166534", padding: "0.65rem 1rem",
            borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.85rem", fontWeight: "600"
          }}>{actionMsg}</div>
        )}

        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading...</p>
        ) : (
          <>
            {/* ---- FARMERS TAB ---- */}
            {activeTab === "farmers" && (
              <div style={{ background: "white", borderRadius: "0.75rem", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>City</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers.map(f => (
                      <tr key={f.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                        <td style={tdStyle}>{f.name}</td>
                        <td style={tdStyle}>{f.email}</td>
                        <td style={tdStyle}>{f.city || "—"}</td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: "0.2rem 0.6rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "700",
                            background: f.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                            color: f.status === "ACTIVE" ? "#166534" : "#dc2626"
                          }}>{f.status}</span>
                        </td>
                        <td style={tdStyle}>
                          {f.status === "ACTIVE" ? (
                            <button onClick={() => handleBlock(f.id)} style={actionBtnStyle("#dc2626")}>Block</button>
                          ) : (
                            <button onClick={() => handleApprove(f.id)} style={actionBtnStyle("#16a34a")}>Approve</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {farmers.length === 0 && (
                      <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "#9ca3af" }}>No farmers found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ---- PRODUCTS TAB ---- */}
            {activeTab === "products" && (
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem"
              }}>
                {products.map(p => (
                  <div key={p.id} style={{
                    background: "white", borderRadius: "0.75rem", overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                  }}>
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "130px", objectFit: "cover" }} />
                    )}
                    <div style={{ padding: "0.75rem" }}>
                      <p style={{ margin: 0, fontWeight: "700", fontSize: "0.9rem" }}>{p.name}</p>
                      <p style={{ margin: "0.25rem 0", color: "#6b7280", fontSize: "0.8rem" }}>{p.category} · ₹{p.price}</p>
                      <p style={{ margin: "0 0 0.5rem 0", color: "#9ca3af", fontSize: "0.75rem" }}>By {p.addedBy?.name || "Unknown"}</p>
                      <button onClick={() => handleRemoveProduct(p.id)} style={{ ...actionBtnStyle("#dc2626"), width: "100%" }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && <p style={{ color: "#9ca3af" }}>No products found.</p>}
              </div>
            )}

            {/* ---- STATS TAB ---- */}
            {activeTab === "stats" && stats && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                  <StatCard label="Total Orders" value={stats.totalOrders} color="#1a3d2b" />
                  <StatCard label="Total Revenue" value={`₹${stats.totalRevenue?.toFixed(2)}`} color="#16a34a" />
                </div>
                <div style={{ background: "white", borderRadius: "0.75rem", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ marginTop: 0, fontSize: "1rem", color: "#1a3d2b" }}>Orders by Status</h3>
                  {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
                    <div key={status} style={{
                      display: "flex", justifyContent: "space-between", padding: "0.5rem 0",
                      borderBottom: "1px solid #f0f0f0", fontSize: "0.9rem"
                    }}>
                      <span style={{ color: "#374151" }}>{status}</span>
                      <span style={{ fontWeight: "700", color: "#1a3d2b" }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "white", borderRadius: "0.75rem", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>{label}</p>
      <p style={{ margin: "0.25rem 0 0 0", fontSize: "1.75rem", fontWeight: "800", color }}>{value}</p>
    </div>
  );
}

const thStyle = { padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#6b7280", fontWeight: "700" };
const tdStyle = { padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#374151" };
const actionBtnStyle = (color) => ({
  background: color, color: "white", border: "none", padding: "0.4rem 0.9rem",
  borderRadius: "0.4rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700"
});