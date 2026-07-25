import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { useToast } from "./context/ToastContext";

import { BASE_URL } from "./Config";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Dairy", "Spices", "Other"];

/* ══════════════════════════════════════════════
   PROFILE MODAL  –  tabbed, full-featured
   Tabs: Overview · Edit Profile · Address · Change Password · Order History
   All mutations call the Spring Boot backend.
   ══════════════════════════════════════════════ */
const profileStyles = `
  @keyframes fadeDown {
    from { opacity:0; transform:translateY(-8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideIn {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes flipIn {
    from { opacity:0; transform:rotateY(-90deg); }
    to   { opacity:1; transform:rotateY(0deg); }
  }
  .pm-tab-content { animation: slideIn 0.22s ease; }
  .pm-input {
    width:100%; box-sizing:border-box;
    border:1.5px solid #e5e7eb; border-radius:0.6rem;
    padding:0.55rem 0.75rem; font-size:0.88rem;
    outline:none; color:#1a3d2b; font-family:inherit;
    transition:border-color 0.2s, box-shadow 0.2s;
    background:#fafafa;
  }
  .pm-input:focus { border-color:#3d9e60; box-shadow:0 0 0 3px rgba(61,158,96,0.12); background:white; }
  .pm-label { color:#6b7280; font-size:0.75rem; font-weight:600; display:block; margin-bottom:0.3rem; }
  .pm-save-btn {
    background:#1a3d2b; color:white; border:none; border-radius:0.75rem;
    padding:0.65rem 1.5rem; cursor:pointer; font-weight:700; font-size:0.9rem;
    transition:background 0.2s, transform 0.15s;
  }
  .pm-save-btn:hover { background:#3d9e60; transform:translateY(-1px); }
  .pm-save-btn:disabled { background:#9ca3af; cursor:not-allowed; transform:none; }
  .pm-section-title { color:#1a3d2b; font-weight:800; font-size:1rem; margin:0 0 1rem; }
`;

/* ── tiny helper ── */
function StatusMsg({ ok, msg }) {
  if (!msg) return null;
  return (
    <div style={{
      padding:"0.5rem 0.75rem", borderRadius:"0.5rem", fontSize:"0.82rem", fontWeight:"600",
      background: ok ? "#dcfce7" : "#fee2e2",
      color: ok ? "#16a34a" : "#dc2626",
      marginTop:"0.5rem"
    }}>{ok ? "✓ " : "✕ "}{msg}</div>
  );
}

function ProfileModal({ user, onClose, onUserUpdate }) {
  const [tab, setTab] = useState("overview");
  const avatarColor = ["#3d9e60","#1a3d2b","#be185d","#b45309","#1d4ed8"][
    ((user?.name || "").charCodeAt(0) || 0) % 5
  ];

  /* ── live display info (updated after saves) ── */
  const [info, setInfo] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  /* ── Profile Image upload state ── */
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [imgUploading, setImgUploading] = useState(false);
  const [imgMsg, setImgMsg] = useState(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImgMsg({ ok: false, text: "Please select an image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImgMsg({ ok: false, text: "Image must be under 5MB." });
      return;
    }

    setImgUploading(true);
    setImgMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);

      // Step 1: upload to Cloudinary via existing ImageController
      const uploadRes = await axiosInstance.post(`${BASE_URL}/api/image/upload`, fd);
      const url = uploadRes.data; // ImageController returns the URL string directly

      // Step 2: save the Cloudinary URL against the user
      await axiosInstance.put(`${BASE_URL}/api/users/${user.id}/profile-image`, {
        profileImage: url,
      });

      setProfileImage(url);
      const stored = JSON.parse(localStorage.getItem("farmfusion_user") || "{}");
      const updated = { ...stored, profileImage: url };
      localStorage.setItem("farmfusion_user", JSON.stringify(updated));
      onUserUpdate?.(updated);
      setImgMsg({ ok: true, text: "Profile photo updated!" });
    } catch (err) {
      setImgMsg({ ok: false, text: err.response?.data?.message || "Upload failed. Try again." });
    }
    setImgUploading(false);
    e.target.value = ""; // allow re-selecting the same file later
  };

  /* ── Edit Profile state ── */
  const [editForm, setEditForm]     = useState({ name: info.name, email: info.email, phone: info.phone });
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg]       = useState(null);

  const saveProfile = async () => {
    setEditSaving(true); setEditMsg(null);
    try {
      await axiosInstance.put(`${BASE_URL}/api/customers/${user.id}`, editForm);
      setInfo(prev => ({ ...prev, ...editForm }));
      /* keep localStorage in sync */
      const stored = JSON.parse(localStorage.getItem("farmfusion_user") || "{}");
      const updated = { ...stored, ...editForm };
      localStorage.setItem("farmfusion_user", JSON.stringify(updated));
      onUserUpdate?.(updated);
      setEditMsg({ ok: true, text: "Profile updated successfully!" });
    } catch (err) {
      setEditMsg({ ok: false, text: err.response?.data?.message || "Update failed. Try again." });
    }
    setEditSaving(false);
  };

  /* ── Address state ── */
  const [addr, setAddr]           = useState({ street:"", city:"", state:"", pincode:"", country:"India" });
  const [addrLoading, setAddrLoading] = useState(true);
  const [addrSaving, setAddrSaving]   = useState(false);
  const [addrMsg, setAddrMsg]         = useState(null);

  useEffect(() => {
    if (tab !== "address") return;
    setAddrLoading(true);
    axiosInstance.get(`${BASE_URL}/api/customers/${user.id}/address`)
      .then(res => { if (res.data) setAddr(res.data); })
      .catch(() => {})
      .finally(() => setAddrLoading(false));
  }, [tab, user.id]);

  const saveAddress = async () => {
    setAddrSaving(true); setAddrMsg(null);
    try {
      await axiosInstance.put(`${BASE_URL}/api/customers/${user.id}/address`, addr);
      setAddrMsg({ ok: true, text: "Address saved!" });
    } catch (err) {
      setAddrMsg({ ok: false, text: err.response?.data?.message || "Failed to save address." });
    }
    setAddrSaving(false);
  };

  /* ── Change Password state ── */
  const [pwForm, setPwForm]     = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg]       = useState(null);
  const [showPw, setShowPw]     = useState({ cur:false, nw:false, cf:false });

  const savePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ ok:false, text:"New passwords do not match." }); return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ ok:false, text:"Password must be at least 6 characters." }); return;
    }
    setPwSaving(true); setPwMsg(null);
    try {
      await axiosInstance.put(`${BASE_URL}/api/customers/${user.id}/change-password`, {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      setPwMsg({ ok:true, text:"Password changed successfully!" });
      setPwForm({ currentPassword:"", newPassword:"", confirmPassword:"" });
    } catch (err) {
      setPwMsg({ ok:false, text: err.response?.data?.message || "Incorrect current password." });
    }
    setPwSaving(false);
  };

  /* ── Order History state ── */
  const [orders, setOrders]         = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (tab !== "orders") return;
    setOrdersLoading(true);
    axiosInstance.get(`${BASE_URL}/api/orders/customer/${user.id}`)
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [tab, user.id]);

  /* ── Tabs config ── */
  const TABS = [
    { id:"overview", label:"👤 Overview" },
    { id:"edit",     label:"✏️ Edit Profile" },
    { id:"address",  label:"📍 Address" },
    { id:"password", label:"🔒 Password" },
    { id:"orders",   label:"📦 Orders" },
  ];

  /* ── Input helper ── */
  const Field = ({ label, value, onChange, type="text", placeholder="", extra={} }) => (
    <div style={{ marginBottom:"0.9rem" }}>
      <label className="pm-label">{label}</label>
      <input className="pm-input" type={type} value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder} {...extra} />
    </div>
  );

  /* ── Password field with eye toggle ── */
  const PwField = ({ label, fkey, showKey }) => (
    <div style={{ marginBottom:"0.9rem" }}>
      <label className="pm-label">{label}</label>
      <div style={{ position:"relative" }}>
        <input className="pm-input" type={showPw[showKey] ? "text" : "password"}
          value={pwForm[fkey]} placeholder="••••••••"
          onChange={e => setPwForm(f => ({ ...f, [fkey]: e.target.value }))}
          style={{ paddingRight:"2.5rem" }} />
        <button onClick={() => setShowPw(s => ({ ...s, [showKey]: !s[showKey] }))}
          style={{ position:"absolute", right:"0.6rem", top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", cursor:"pointer", fontSize:"1rem", color:"#9ca3af" }}>
          {showPw[showKey] ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{profileStyles}</style>
      <div style={{
        background:"white", borderRadius:"1.5rem",
        width:"680px", maxWidth:"96vw",
        maxHeight:"90vh", display:"flex", flexDirection:"column",
        boxShadow:"0 24px 80px rgba(0,0,0,0.25)",
        overflow:"hidden"
      }}>

        {/* ── GREEN HEADER BANNER ── */}
        <div style={{
          background:"linear-gradient(135deg, #1a3d2b 0%, #3d9e60 100%)",
          padding:"1.5rem 1.75rem 1.25rem", position:"relative", flexShrink:0
        }}>
          {/* decorative blobs */}
          <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%",
            background:"rgba(255,255,255,0.05)", top:-60, right:-40, pointerEvents:"none" }} />
          <div style={{ position:"absolute", width:100, height:100, borderRadius:"50%",
            background:"rgba(255,255,255,0.05)", bottom:-30, left:20, pointerEvents:"none" }} />

          <button onClick={onClose} style={{
            position:"absolute", top:"1rem", right:"1rem",
            background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%",
            width:32, height:32, cursor:"pointer", color:"white", fontSize:"1rem",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>✕</button>

          <div style={{ display:"flex", alignItems:"center", gap:"1.1rem", position:"relative" }}>
            <label htmlFor="pm-avatar-input" style={{
              width:72, height:72, borderRadius:"50%", background:avatarColor,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.8rem", fontWeight:"900", color:"white",
              border:"3px solid rgba(255,255,255,0.35)",
              boxShadow:"0 4px 16px rgba(0,0,0,0.25)", flexShrink:0,
              cursor:"pointer", position:"relative", overflow:"hidden"
            }} title="Click to change photo">
              {profileImage ? (
                <img src={profileImage} alt="avatar"
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  onError={() => setProfileImage("")} />
              ) : (
                info.name.charAt(0).toUpperCase() || "?"
              )}
              {imgUploading && (
                <div style={{
                  position:"absolute", inset:0, background:"rgba(0,0,0,0.45)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.65rem", color:"white", fontWeight:"700"
                }}>...</div>
              )}
              <input id="pm-avatar-input" type="file" accept="image/*"
                onChange={handleAvatarChange} disabled={imgUploading}
                style={{ display:"none" }} />
            </label>
            <div>
              <div style={{ color:"white", fontWeight:"800", fontSize:"1.25rem" }}>{info.name}</div>
              <div style={{ color:"#86efac", fontSize:"0.82rem", marginTop:"0.15rem" }}>
                🌿 FarmFusion Customer &nbsp;·&nbsp; ID #{user?.id}
              </div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.78rem", marginTop:"0.1rem" }}>
                {info.email}
              </div>
              {imgMsg && (
                <div style={{
                  fontSize:"0.72rem", marginTop:"0.25rem", fontWeight:"600",
                  color: imgMsg.ok ? "#86efac" : "#fecaca"
                }}>{imgMsg.ok ? "✓ " : "✕ "}{imgMsg.text}</div>
              )}
            </div>
          </div>

          {/* ── TAB BAR ── */}
          <div className="ff-tab-bar" style={{ display:"flex", gap:"0.25rem", marginTop:"1.1rem", flexWrap:"wrap" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:"0.4rem 0.85rem", borderRadius:"2rem", border:"none",
                cursor:"pointer", fontWeight:"600", fontSize:"0.78rem",
                background: tab === t.id ? "white" : "rgba(255,255,255,0.12)",
                color: tab === t.id ? "#1a3d2b" : "rgba(255,255,255,0.85)",
                transition:"all 0.18s", whiteSpace:"nowrap"
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"1.5rem 1.75rem" }} className="pm-tab-content" key={tab}>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div>
              <p className="pm-section-title">Account Overview</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.85rem", marginBottom:"1.25rem" }}>
                {[
                  { icon:"👤", label:"Full Name",    val: info.name },
                  { icon:"📧", label:"Email",         val: info.email },
                  { icon:"📱", label:"Phone",         val: info.phone || "—" },
                  { icon:"🆔", label:"Customer ID",   val: `#${user?.id}` },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{
                    background:"#f0fdf4", borderRadius:"0.75rem", padding:"0.85rem 1rem",
                    border:"1px solid #d1fae5"
                  }}>
                    <div style={{ color:"#6b7280", fontSize:"0.72rem", fontWeight:"600", marginBottom:"0.3rem" }}>{icon} {label}</div>
                    <div style={{ color:"#1a3d2b", fontSize:"0.9rem", fontWeight:"700", wordBreak:"break-all" }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap" }}>
                {[
                  { id:"edit",     icon:"✏️", label:"Edit Profile" },
                  { id:"address",  icon:"📍", label:"Manage Address" },
                  { id:"password", icon:"🔒", label:"Change Password" },
                  { id:"orders",   icon:"📦", label:"Order History" },
                ].map(({ id, icon, label }) => (
                  <button key={id} onClick={() => setTab(id)} style={{
                    background:"white", border:"1.5px solid #d1fae5", color:"#1a3d2b",
                    padding:"0.55rem 1rem", borderRadius:"0.65rem", cursor:"pointer",
                    fontWeight:"600", fontSize:"0.82rem", transition:"all 0.15s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background="#f0fdf4"; e.currentTarget.style.borderColor="#3d9e60"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="white"; e.currentTarget.style.borderColor="#d1fae5"; }}
                  >{icon} {label}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── EDIT PROFILE ── */}
          {tab === "edit" && (
            <div>
              <p className="pm-section-title">Edit Profile</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1.25rem" }}>
                <Field label="👤 Full Name" value={editForm.name}
                  onChange={v => setEditForm(f => ({ ...f, name: v }))} placeholder="Your full name" />
                <Field label="📱 Phone" value={editForm.phone}
                  onChange={v => setEditForm(f => ({ ...f, phone: v }))} placeholder="10-digit number" />
                <div style={{ gridColumn:"1 / -1" }}>
                  <Field label="📧 Email" value={editForm.email}
                    onChange={v => setEditForm(f => ({ ...f, email: v }))} placeholder="you@example.com" />
                </div>
              </div>
              <StatusMsg ok={editMsg?.ok} msg={editMsg?.text} />
              <button className="pm-save-btn" style={{ marginTop:"0.75rem" }}
                onClick={saveProfile} disabled={editSaving}>
                {editSaving ? "Saving…" : "💾 Save Changes"}
              </button>
            </div>
          )}

          {/* ── ADDRESS ── */}
          {tab === "address" && (
            <div>
              <p className="pm-section-title">📍 Delivery Address</p>
              {addrLoading ? (
                <div style={{ textAlign:"center", color:"#9ca3af", padding:"2rem" }}>Loading address…</div>
              ) : (
                <>
                  <Field label="Street / House No." value={addr.street}
                    onChange={v => setAddr(a => ({ ...a, street: v }))} placeholder="123, MG Road" />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1.25rem" }}>
                    <Field label="City" value={addr.city}
                      onChange={v => setAddr(a => ({ ...a, city: v }))} placeholder="Dehradun" />
                    <Field label="State" value={addr.state}
                      onChange={v => setAddr(a => ({ ...a, state: v }))} placeholder="Uttarakhand" />
                    <Field label="PIN Code" value={addr.pincode}
                      onChange={v => setAddr(a => ({ ...a, pincode: v }))} placeholder="248001" />
                    <Field label="Country" value={addr.country}
                      onChange={v => setAddr(a => ({ ...a, country: v }))} placeholder="India" />
                  </div>
                  <StatusMsg ok={addrMsg?.ok} msg={addrMsg?.text} />
                  <button className="pm-save-btn" style={{ marginTop:"0.75rem" }}
                    onClick={saveAddress} disabled={addrSaving}>
                    {addrSaving ? "Saving…" : "💾 Save Address"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── CHANGE PASSWORD ── */}
          {tab === "password" && (
            <div>
              <p className="pm-section-title">🔒 Change Password</p>
              <PwField label="Current Password" fkey="currentPassword" showKey="cur" />
              <PwField label="New Password"     fkey="newPassword"     showKey="nw" />
              <PwField label="Confirm New Password" fkey="confirmPassword" showKey="cf" />
              <div style={{ background:"#f0fdf4", borderRadius:"0.6rem", padding:"0.65rem 0.85rem",
                fontSize:"0.78rem", color:"#4b5563", marginBottom:"0.75rem", lineHeight:1.6 }}>
                💡 Password must be at least 6 characters. Use a mix of letters, numbers & symbols for better security.
              </div>
              <StatusMsg ok={pwMsg?.ok} msg={pwMsg?.text} />
              <button className="pm-save-btn" style={{ marginTop:"0.5rem" }}
                onClick={savePassword} disabled={pwSaving}>
                {pwSaving ? "Updating…" : "🔒 Update Password"}
              </button>
            </div>
          )}

          {/* ── ORDER HISTORY ── */}
          {tab === "orders" && (
            <div>
              <p className="pm-section-title">📦 Order History</p>
              {ordersLoading ? (
                <div style={{ textAlign:"center", color:"#9ca3af", padding:"2rem" }}>Loading orders…</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign:"center", padding:"2.5rem 1rem", color:"#9ca3af" }}>
                  <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>📭</div>
                  <p style={{ fontWeight:"600" }}>No orders yet</p>
                  <p style={{ fontSize:"0.85rem" }}>Your order history will appear here once you place an order.</p>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                  {orders.map(order => (
                    <div key={order.id} style={{
                      border:"1.5px solid #e5e7eb", borderRadius:"0.875rem",
                      padding:"1rem 1.1rem", background:"#fafafa"
                    }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.5rem" }}>
                        <div>
                          <span style={{ fontWeight:"700", color:"#1a3d2b", fontSize:"0.9rem" }}>
                            Order #{order.id}
                          </span>
                          <span style={{ color:"#9ca3af", fontSize:"0.78rem", marginLeft:"0.6rem" }}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : ""}
                          </span>
                        </div>
                        <span style={{
                          padding:"0.2rem 0.65rem", borderRadius:"2rem", fontSize:"0.72rem", fontWeight:"700",
                          background: order.status === "DELIVERED" ? "#dcfce7"
                            : order.status === "CANCELLED" ? "#fee2e2"
                            : order.status === "PENDING"   ? "#fef9c3"
                            : "#dbeafe",
                          color: order.status === "DELIVERED" ? "#16a34a"
                            : order.status === "CANCELLED" ? "#dc2626"
                            : order.status === "PENDING"   ? "#854d0e"
                            : "#1d4ed8"
                        }}>{order.status || "PROCESSING"}</span>
                      </div>
                      {order.items && order.items.length > 0 && (
                        <div style={{ fontSize:"0.82rem", color:"#4b5563", marginBottom:"0.4rem" }}>
                          {order.items.map(it => `${it.name} × ${it.quantity}`).join(" · ")}
                        </div>
                      )}
                      <div style={{ fontWeight:"700", color:"#1a3d2b", fontSize:"0.88rem" }}>
                        Total: ₹{order.totalAmount?.toFixed(2) || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

// Product grid responsive rules — !important overrides the inline
// gridTemplateColumns so exact column counts apply at each breakpoint.
const dashboardResponsiveStyles = `
  @media (min-width: 1025px) {
    .ff-product-grid { grid-template-columns: repeat(4, 1fr) !important; }
  }
  @media (min-width: 601px) and (max-width: 1024px) {
    .ff-product-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 600px) {
    .ff-product-grid { grid-template-columns: 1fr !important; }
  }

  /* Profile modal tab bar — horizontal scroll instead of wrap on small screens */
  @media (max-width: 600px) {
    .ff-tab-bar {
      flex-wrap: nowrap !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: none !important;
      padding-bottom: 2px !important;
    }
    .ff-tab-bar::-webkit-scrollbar { display: none; }
  }

  /* Dashboard header — collapse greeting + button text so it fits on mobile */
  @media (max-width: 600px) {
    .ff-dashboard-header { padding: 0 0.75rem !important; }
    .ff-header-greeting { display: none !important; }
    .ff-header-logo-text { font-size: 1.05rem !important; }
    .ff-header-actions { gap: 0.4rem !important; }
    .ff-cart-btn, .ff-wishlist-btn { padding: 0.45rem 0.65rem !important; }
    .ff-btn-text { display: none !important; }
  }
`;

function CustomerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("farmfusion_user") || "null");
    const raw = stored || location.state?.user;
    if (!raw) return null;
    if (!stored && location.state?.user) {
      localStorage.setItem("farmfusion_user", JSON.stringify(raw));
    }
    return { ...raw, id: Number(String(raw.id).split(":")[0]) };
  });
  const [avatarBroken, setAvatarBroken] = useState(false);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [totalElements, setTotalElements] = useState(0);
  const [addingToCart, setAddingToCart] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // ── CHECKOUT STATE ──
  const [showCheckout, setShowCheckout]     = useState(false);
  const [checkoutStep, setCheckoutStep]     = useState("address");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addingNewAddr, setAddingNewAddr]   = useState(false);
  const [newAddr, setNewAddr]               = useState({ street:"", city:"", state:"", pincode:"", country:"India" });
  const [addrSaving, setAddrSaving]         = useState(false);
  const [placingOrder, setPlacingOrder]     = useState(false);
  const [checkoutMsg, setCheckoutMsg]       = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (!user) navigate("/customer-login");
  }, [user, navigate]);

  const PAGE_SIZE = 12;

  const fetchProducts = (pageNumber, { query = debouncedQuery, category = selectedCategory, sBy = sortBy, sDir = sortDir } = {}) => {
    const isFirstLoad = pageNumber === 0;
    isFirstLoad ? setLoading(true) : setLoadingMore(true);

    axiosInstance.get(`${BASE_URL}/products/search`, {
      params: {
        name: query || undefined,
        category: category !== "All" ? category : undefined,
        sortBy: sBy,
        sortDir: sDir,
        page: pageNumber,
        size: PAGE_SIZE
      }
    })
      .then(res => {
        const content = res.data?.content || [];
        const isLast = res.data?.last ?? true;
        setProducts(prev => isFirstLoad ? content : [...prev, ...content]);
        setHasMore(!isLast);
        setTotalElements(res.data?.totalElements ?? content.length);
      })
      .catch(err => { console.error(err); })
      .finally(() => {
        isFirstLoad ? setLoading(false) : setLoadingMore(false);
      });
  };

  // Debounce the raw search input -> debouncedQuery (waits 400ms after typing stops)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Re-fetch from page 0 whenever the debounced search, category, or sort changes
  useEffect(() => {
    setPage(0);
    fetchProducts(0, { query: debouncedQuery, category: selectedCategory, sBy: sortBy, sDir: sortDir });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, selectedCategory, sortBy, sortDir]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, { query: debouncedQuery, category: selectedCategory, sBy: sortBy, sDir: sortDir });
  };

  useEffect(() => {
    if (user) {
      axiosInstance.get(`${BASE_URL}/api/cart/${user.id}`).then(res => setCart(res.data)).catch(() => {});
      axiosInstance.get(`${BASE_URL}/api/wishlist/${user.id}`).then(res => setWishlist(res.data)).catch(() => {});
    }
  }, [user]);

  const addToCart = async (product) => {
    setAddingToCart(product.id);
    try {
      await axiosInstance.post(`${BASE_URL}/api/cart/add`, { userId: user.id, productId: product.id, quantity: 1 });
      const res = await axiosInstance.get(`${BASE_URL}/api/cart/${user.id}`);
      setCart(res.data);
    } catch {
      showToast("Failed to add to cart", "error");
    }
    setAddingToCart(null);
  };

  const removeFromCart = async (productId) => {
    try {
      await axiosInstance.delete(`${BASE_URL}/api/cart/remove`, { params: { userId: user.id, productId } });
      const res = await axiosInstance.get(`${BASE_URL}/api/cart/${user.id}`);
      setCart(res.data);
    } catch {
      showToast("Failed to remove from cart", "error");
    }
  };

  const toggleWishlist = async (product) => {
    const pid = product.id || product.productId;
    try {
      const exists = wishlist.some(w => w.productId === pid);
      if (exists) {
        await axiosInstance.delete(`${BASE_URL}/api/wishlist/remove`, { params: { userId: user.id, productId: pid } });
      } else {
        await axiosInstance.post(`${BASE_URL}/api/wishlist/add`, { userId: user.id, productId: pid });
      }
      const res = await axiosInstance.get(`${BASE_URL}/api/wishlist/${user.id}`);
      setWishlist(res.data);
    } catch (err) {
      console.error("Wishlist error:", err.response?.data || err.message);
      showToast("Failed to update wishlist: " + (err.response?.data || err.message), "error");
    }
  };

  // ── CHECKOUT FUNCTIONS ──
  const openCheckout = async () => {
    setCheckoutMsg(null);
    setCheckoutStep("address");
    setSelectedAddressId(null);
    setAddingNewAddr(false);
    setNewAddr({ street:"", city:"", state:"", pincode:"", country:"India" });
    try {
      const res = await axiosInstance.get(`${BASE_URL}/api/addresses/user/${user.id}`);
      const addrs = Array.isArray(res.data) ? res.data : [];
      setSavedAddresses(addrs);
      if (addrs.length === 0) setAddingNewAddr(true);
      else setSelectedAddressId(addrs[0].id);
    } catch {
      setSavedAddresses([]);
      setAddingNewAddr(true);
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  const saveNewAddress = async () => {
    if (!newAddr.street || !newAddr.city || !newAddr.state || !newAddr.pincode) {
      setCheckoutMsg({ ok:false, text:"Please fill all address fields." });
      return;
    }
    setAddrSaving(true); setCheckoutMsg(null);
    try {
      const res = await axiosInstance.post(`${BASE_URL}/api/addresses`, {
        ...newAddr,
        user: { id: user.id }
      });
      const saved = res.data;
      setSavedAddresses(prev => [...prev, saved]);
      setSelectedAddressId(saved.id);
      setAddingNewAddr(false);
      setCheckoutMsg({ ok:true, text:"Address saved!" });
    } catch {
      setCheckoutMsg({ ok:false, text:"Failed to save address. Try again." });
    }
    setAddrSaving(false);
  };

  const placeOrder = async () => {
    if (!selectedAddressId) {
      setCheckoutMsg({ ok:false, text:"Please select a delivery address." });
      return;
    }
    setPlacingOrder(true); setCheckoutMsg(null);
    try {
      const res = await axiosInstance.post(`${BASE_URL}/api/orders/place`, {
        customerId: user.id,
        addressId: selectedAddressId,
        orderItems: cart.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity || 1,
          price: item.price
        }))
      });
      setConfirmedOrder(res.data);
      // Clear cart
      await axiosInstance.delete(`${BASE_URL}/api/cart/clear`, { params: { userId: user.id } })
        .catch(() => {});
      setCart([]);
      setCheckoutStep("success");
    } catch (err) {
      setCheckoutMsg({ ok:false, text: err.response?.data || "Failed to place order. Please try again." });
    }
    setPlacingOrder(false);
  };

  const closeCheckout = () => {
    setShowCheckout(false);
    setCheckoutStep("address");
    setConfirmedOrder(null);
    setCheckoutMsg(null);
  };

  // Filtering now happens on the backend (/products/search), so we render `products` directly.
  const filteredProducts = products;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const gst = subtotal * 0.07;
  const total = subtotal + gst;

  const isInWishlist = (id) => wishlist.some(w => w.productId === id);
  const isInCart = (id) => cart.some(c => (c.productId || c.id) === id);

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{dashboardResponsiveStyles}</style>

      {/* ── HEADER ── */}
      <header className="ff-dashboard-header" style={{
        background: "#1a3d2b",
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🌿</span>
          <span className="ff-header-logo-text" style={{ color: "#facc15", fontWeight: "800", fontSize: "1.3rem", letterSpacing: "-0.5px" }}>FarmFusion</span>
        </div>

        <div className="ff-header-greeting" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#86efac", fontSize: "0.9rem" }}>
             Hello, <strong style={{ color: "white" }}>{user.name?.split(" ")[0]}</strong>
          </span>
        </div>

        <div className="ff-header-actions" style={{ display: "flex", gap: "0.75rem" }}>
          <button className="ff-cart-btn" onClick={() => setShowCart(true)} style={{
            background: "#3d9e60", color: "white", padding: "0.45rem 1rem",
            borderRadius: "2rem", border: "none", cursor: "pointer",
            fontWeight: "600", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem"
          }}>
            🛒 <span className="ff-btn-text">Cart</span>
            {cart.length > 0 && (
              <span style={{
                background: "#facc15", color: "#1a3d2b", borderRadius: "50%",
                width: "20px", height: "20px", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "0.75rem", fontWeight: "800"
              }}>{cart.length}</span>
            )}
          </button>
          <button className="ff-wishlist-btn" onClick={() => setShowWishlist(true)} style={{
            background: "#be185d", color: "white", padding: "0.45rem 1rem",
            borderRadius: "2rem", border: "none", cursor: "pointer",
            fontWeight: "600", fontSize: "0.85rem"
          }}>❤️ <span className="ff-btn-text">Wishlist</span></button>
          {/* Profile Avatar + Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowDropdown(d => !d)}
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "linear-gradient(135deg, #3d9e60, #facc15)",
                border: "2px solid rgba(255,255,255,0.3)",
                cursor: "pointer", fontSize: "1rem", fontWeight: "800",
                color: "#1a3d2b", display: "flex", alignItems: "center",
                justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                transition: "transform 0.15s", overflow: "hidden", padding: 0
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {user.profileImage && !avatarBroken ? (
                <img src={user.profileImage} alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => setAvatarBroken(true)} />
              ) : (
                user.name?.charAt(0).toUpperCase() || "U"
              )}
            </button>

            {showDropdown && (
              <>
                {/* backdrop to close */}
                <div onClick={() => setShowDropdown(false)} style={{ position: "fixed", inset: 0, zIndex: 149 }} />
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  background: "white", borderRadius: "0.875rem",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  minWidth: "200px", zIndex: 150, overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  animation: "fadeDown 0.18s ease"
                }}>
                  {/* user info strip */}
                  <div style={{ padding: "0.9rem 1rem", background: "#f0fdf4", borderBottom: "1px solid #e5e7eb" }}>
                    <div style={{ fontWeight: "700", color: "#1a3d2b", fontSize: "0.9rem" }}>{user.name}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.1rem" }}>{user.email}</div>
                  </div>
                  <button
                    onClick={() => { setShowDropdown(false); setShowProfile(true); }}
                    style={{
                      width: "100%", padding: "0.75rem 1rem", background: "none",
                      border: "none", cursor: "pointer", textAlign: "left",
                      fontSize: "0.88rem", color: "#1a3d2b", fontWeight: "600",
                      display: "flex", alignItems: "center", gap: "0.6rem",
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    👤 View / Edit Profile
                  </button>
                  <div style={{ height: "1px", background: "#f3f4f6", margin: "0 1rem" }} />
                  <button
                    onClick={() => { localStorage.removeItem("farmfusion_user");
                                     localStorage.removeItem("token"); navigate("/customer-login"); }}
                    style={{
                      width: "100%", padding: "0.75rem 1rem", background: "none",
                      border: "none", cursor: "pointer", textAlign: "left",
                      fontSize: "0.88rem", color: "#ef4444", fontWeight: "600",
                      display: "flex", alignItems: "center", gap: "0.6rem",
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── PROFILE CARD MODAL ── */}
      {showProfile && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 300, padding: "1rem"
        }} onClick={() => setShowProfile(false)}>
          <div onClick={e => e.stopPropagation()}>
            <ProfileModal user={user} onClose={() => setShowProfile(false)}
              onUserUpdate={(updated) => { setAvatarBroken(false); setUser(prev => ({ ...prev, ...updated })); }} />
          </div>
        </div>
      )}

      {/* ── HERO BANNER ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a3d2b 0%, #3d9e60 100%)",
        padding: "2.5rem 2rem 3rem",
        textAlign: "center"
      }}>
        <h1 style={{ color: "white", fontSize: "2rem", fontWeight: "800", margin: "0 0 0.4rem" }}>
          Fresh from the Farm 🌾
        </h1>
        <p style={{ color: "#86efac", margin: "0 0 1.5rem", fontSize: "1rem" }}>
          Discover organic produce directly from local farmers
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: "560px", margin: "0 auto", position: "relative" }}>
          <span style={{
            position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)",
            fontSize: "1.1rem", pointerEvents: "none"
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search products, categories, or farmers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "0.85rem 1rem 0.85rem 2.8rem",
              borderRadius: "2rem", border: "none", fontSize: "0.95rem",
              boxSizing: "border-box", outline: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              background: "white"
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{
              position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: "1rem", color: "#9ca3af"
            }}>✕</button>
          )}
        </div>

      </div>

      {/* ── CATEGORY FILTERS + SORT ── */}
      <div style={{
        background: "white", borderBottom: "1px solid #e5e7eb",
        padding: "0.75rem 2rem", display: "flex", gap: "0.5rem",
        alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.4rem 1.1rem", borderRadius: "2rem", border: "none",
                cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", whiteSpace: "nowrap",
                background: selectedCategory === cat ? "#1a3d2b" : "#f0fdf4",
                color: selectedCategory === cat ? "white" : "#3d9e60",
                transition: "all 0.2s"
              }}
            >{cat}</button>
          ))}
        </div>

        <select
          value={`${sortBy}_${sortDir}`}
          onChange={e => {
            const [by, dir] = e.target.value.split("_");
            setSortBy(by);
            setSortDir(dir);
          }}
          style={{
            padding: "0.45rem 0.9rem", borderRadius: "0.6rem",
            border: "1.5px solid #e5e7eb", background: "#f9fafb",
            color: "#1a3d2b", fontWeight: "600", fontSize: "0.82rem",
            cursor: "pointer", outline: "none"
          }}
        >
          <option value="id_desc">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: "1.5rem 2rem 3rem" }}>
        {/* Results count */}
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: "#4b5563", fontSize: "0.9rem", margin: 0 }}>
            {loading ? "Loading..." : (
              <>Showing <strong>{filteredProducts.length}</strong> of <strong>{totalElements}</strong> product{totalElements !== 1 ? "s" : ""}
                {debouncedQuery && <> for "<strong>{debouncedQuery}</strong>"</>}
                {selectedCategory !== "All" && <> in <strong>{selectedCategory}</strong></>}
              </>
            )}
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="ff-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.75rem" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                background: "white", borderRadius: "1rem", overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)", animation: "pulse 1.5s infinite"
              }}>
                <div style={{ height: "160px", background: "#e5e7eb" }} />
                <div style={{ padding: "1rem" }}>
                  <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", marginBottom: "0.5rem", width: "70%" }} />
                  <div style={{ height: "12px", background: "#f3f4f6", borderRadius: "4px", width: "90%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌱</div>
            <h3 style={{ color: "#374151", marginBottom: "0.5rem" }}>No products found</h3>
            <p style={{ color: "#9ca3af" }}>Try a different search or category</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSortBy("id"); setSortDir("desc"); }} style={{
              marginTop: "1rem", background: "#3d9e60", color: "white",
              padding: "0.6rem 1.5rem", borderRadius: "2rem", border: "none", cursor: "pointer", fontWeight: "600"
            }}>Clear filters</button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="ff-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.75rem" }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{
                background: "white", borderRadius: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}
              >
                {/* Product Image */}
                <div style={{ position: "relative", overflow: "hidden", borderRadius: "1rem 1rem 0 0" }}>
                  <img
                    src={product.imageUrl || ""}
                    alt={product.name}
                    style={{ width: "100%", height: "200px", objectFit: "cover", display: "block", background: "#f3f4f6" }}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      const placeholder = e.target.parentNode.querySelector(".img-placeholder");
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                  <div className="img-placeholder" style={{
                    display: product.imageUrl ? "none" : "flex",
                    width: "100%", height: "200px", background: "#f0fdf4",
                    alignItems: "center", justifyContent: "center",
                    flexDirection: "column", gap: "0.4rem"
                  }}>
                    <span style={{ fontSize: "2.5rem" }}>🌿</span>
                    <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>No Image</span>
                  </div>
                  {/* Category badge */}
                  {product.category && (
                    <span style={{
                      position: "absolute", top: "0.5rem", left: "0.5rem",
                      background: "rgba(26,61,43,0.85)", color: "#facc15",
                      padding: "0.2rem 0.6rem", borderRadius: "2rem",
                      fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase"
                    }}>{product.category}</span>
                  )}
                  {/* Cart icon button */}
                  <button
                    onClick={() => { if (product.quantity > 0) addToCart(product); }}
                    style={{
                      position: "absolute", top: "0.5rem", right: "2.75rem",
                      background: isInCart(product.id) ? "#dcfce7" : "rgba(255,255,255,0.9)",
                      border: "none", borderRadius: "50%", width: "32px", height: "32px",
                      cursor: "pointer", fontSize: "0.9rem", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                    }}
                  >{isInCart(product.id) ? "🛒" : "🛍️"}</button>
                  {/* Wishlist button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: "absolute", top: "0.5rem", right: "0.5rem",
                      background: isInWishlist(product.id) ? "#be185d" : "rgba(255,255,255,0.9)",
                      border: "none", borderRadius: "50%", width: "32px", height: "32px",
                      cursor: "pointer", fontSize: "0.9rem", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                    }}
                  >{isInWishlist(product.id) ? "❤️" : "🤍"}</button>
                  {/* Stock badge */}
                  {product.quantity !== undefined && (
                    <span style={{
                      position: "absolute", bottom: "0.5rem", right: "0.5rem",
                      background: product.quantity > 0 ? "rgba(22,163,74,0.9)" : "rgba(220,38,38,0.9)",
                      color: "white", padding: "0.2rem 0.5rem",
                      borderRadius: "2rem", fontSize: "0.7rem", fontWeight: "600"
                    }}>
                      {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div style={{ padding: "1.1rem" }}>
                  <h3 style={{
                    color: "#1a3d2b", margin: "0 0 0.3rem",
                    fontSize: "1rem", fontWeight: "700",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                  }}>{product.name}</h3>

                  {product.description && (
                    <p style={{
                      color: "#6b7280", fontSize: "0.8rem", margin: "0 0 0.5rem",
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4"
                    }}>{product.description}</p>
                  )}

                  {/* Farmer name */}
                  {product.addedBy?.name && (
                    <p style={{
                      color: "#3d9e60", fontSize: "0.75rem", margin: "0 0 0.6rem",
                      fontWeight: "600", display: "flex", alignItems: "center", gap: "0.25rem"
                    }}>
                      🧑‍🌾 {product.addedBy.name}
                    </p>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ color: "#1a3d2b", fontSize: "1.2rem", fontWeight: "800" }}>
                      ₹{product.price}
                    </span>
                    <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>per unit</span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={addingToCart === product.id || product.quantity === 0}
                    style={{
                      width: "100%", padding: "0.55rem",
                      borderRadius: "0.5rem", border: "none", cursor: product.quantity === 0 ? "not-allowed" : "pointer",
                      fontWeight: "700", fontSize: "0.85rem",
                      background: isInCart(product.id)
                        ? "#dcfce7"
                        : product.quantity === 0
                          ? "#e5e7eb"
                          : "#3d9e60",
                      color: isInCart(product.id)
                        ? "#16a34a"
                        : product.quantity === 0
                          ? "#9ca3af"
                          : "white",
                      transition: "background 0.2s"
                    }}
                  >
                    {addingToCart === product.id
                      ? "Adding..."
                      : product.quantity === 0
                        ? "Out of Stock"
                        : isInCart(product.id)
                          ? "✓ Added to Cart"
                          : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && hasMore && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              style={{
                background: loadingMore ? "#9ca3af" : "#1a3d2b",
                color: "#facc15", padding: "0.75rem 2rem", borderRadius: "2rem",
                border: "none", cursor: loadingMore ? "wait" : "pointer",
                fontWeight: "700", fontSize: "0.9rem"
              }}
            >
              {loadingMore ? "Loading…" : "Load More Products"}
            </button>
          </div>
        )}
      </main>

      {/* ── CART MODAL ── */}
      {showCart && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }}>
          <div style={{
            background: "white", borderRadius: "1.25rem", padding: "1.5rem",
            width: "90%", maxWidth: "480px", maxHeight: "80vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ color: "#1a3d2b", margin: 0, fontWeight: "800" }}>🛒 My Cart</h2>
              <button onClick={() => setShowCart(false)} style={{
                background: "#f3f4f6", border: "none", borderRadius: "50%",
                width: "32px", height: "32px", cursor: "pointer", fontSize: "1rem"
              }}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "#9ca3af" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0.85rem", background: "#f0fdf4", borderRadius: "0.75rem", marginBottom: "0.5rem"
                  }}>
                    <div>
                      <h4 style={{ color: "#1a3d2b", margin: "0 0 0.2rem", fontWeight: "700" }}>{item.name}</h4>
                      <p style={{ color: "#6b7280", margin: 0, fontSize: "0.85rem" }}>₹{item.price} × {item.quantity || 1}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.productId || item.id)} style={{
                      background: "#fee2e2", color: "#ef4444", padding: "0.4rem 0.8rem",
                      borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.8rem"
                    }}>Remove</button>
                  </div>
                ))}
                <div style={{ borderTop: "2px dashed #d1fae5", paddingTop: "1rem", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                    <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                    <span>GST (7%)</span><span>₹{gst.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#1a3d2b", fontWeight: "800", fontSize: "1.1rem", marginBottom: "1rem" }}>
                    <span>Total</span><span>₹{total.toFixed(2)}</span>
                  </div>
                  <button onClick={openCheckout} style={{
                    width: "100%", background: "#1a3d2b", color: "#facc15",
                    padding: "0.85rem", borderRadius: "0.75rem", border: "none",
                    cursor: "pointer", fontWeight: "800", fontSize: "1rem"
                  }}>Proceed to Checkout →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── CHECKOUT MODAL ── */}
      {showCheckout && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.65)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:250, padding:"1rem"
        }}>
          <div style={{
            background:"white", borderRadius:"1.25rem",
            width:"90%", maxWidth:"520px", maxHeight:"90vh",
            display:"flex", flexDirection:"column", overflow:"hidden",
            boxShadow:"0 24px 80px rgba(0,0,0,0.3)"
          }}>

            {/* Modal Header */}
            <div style={{
              background:"linear-gradient(135deg, #1a3d2b 0%, #3d9e60 100%)",
              padding:"1.25rem 1.5rem", display:"flex", justifyContent:"space-between",
              alignItems:"center", flexShrink:0
            }}>
              <div>
                <div style={{color:"white", fontWeight:"800", fontSize:"1.1rem"}}>
                  {checkoutStep === "success" ? "🎉 Order Confirmed!" : "🛒 Checkout"}
                </div>
                {checkoutStep === "address" && (
                  <div style={{color:"#86efac", fontSize:"0.78rem", marginTop:"0.15rem"}}>
                    Step 1 of 2 — Delivery Address
                  </div>
                )}
                {checkoutStep === "confirm" && (
                  <div style={{color:"#86efac", fontSize:"0.78rem", marginTop:"0.15rem"}}>
                    Step 2 of 2 — Review & Place Order
                  </div>
                )}
              </div>
              <button onClick={closeCheckout} style={{
                background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%",
                width:32, height:32, cursor:"pointer", color:"white", fontSize:"1rem",
                display:"flex", alignItems:"center", justifyContent:"center"
              }}>✕</button>
            </div>

            {/* Modal Body */}
            <div style={{flex:1, overflowY:"auto", padding:"1.5rem"}}>

              {/* ── STEP 1: ADDRESS ── */}
              {checkoutStep === "address" && (
                <div>
                  {/* Saved addresses */}
                  {savedAddresses.length > 0 && !addingNewAddr && (
                    <div style={{marginBottom:"1.25rem"}}>
                      <p style={{fontWeight:"700", color:"#1a3d2b", marginBottom:"0.75rem", fontSize:"0.9rem"}}>
                        📍 Select Delivery Address
                      </p>
                      {savedAddresses.map(addr => (
                        <div key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          style={{
                            border:`2px solid ${selectedAddressId === addr.id ? "#3d9e60" : "#e5e7eb"}`,
                            borderRadius:"0.75rem", padding:"0.85rem 1rem", marginBottom:"0.6rem",
                            cursor:"pointer", background: selectedAddressId === addr.id ? "#f0fdf4" : "white",
                            transition:"all 0.15s"
                          }}>
                          <div style={{display:"flex", alignItems:"flex-start", gap:"0.6rem"}}>
                            <span style={{
                              marginTop:"0.1rem", fontSize:"1rem",
                              color: selectedAddressId === addr.id ? "#3d9e60" : "#9ca3af"
                            }}>
                              {selectedAddressId === addr.id ? "🔘" : "⭕"}
                            </span>
                            <div>
                              <div style={{fontWeight:"600", color:"#1a3d2b", fontSize:"0.88rem"}}>
                                {addr.street}
                              </div>
                              <div style={{color:"#6b7280", fontSize:"0.8rem", marginTop:"0.1rem"}}>
                                {addr.city}, {addr.state} — {addr.pincode}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => { setAddingNewAddr(true); setCheckoutMsg(null); }} style={{
                        width:"100%", background:"#f0fdf4", color:"#3d9e60",
                        border:"2px dashed #86efac", borderRadius:"0.75rem",
                        padding:"0.65rem", cursor:"pointer", fontWeight:"700", fontSize:"0.85rem"
                      }}>+ Add New Address</button>
                    </div>
                  )}

                  {/* Add new address form */}
                  {addingNewAddr && (
                    <div>
                      <p style={{fontWeight:"700", color:"#1a3d2b", marginBottom:"0.85rem", fontSize:"0.9rem"}}>
                        📍 {savedAddresses.length > 0 ? "New Address" : "Add Delivery Address"}
                      </p>
                      {[
                        { label:"Street / House No.", key:"street", placeholder:"123, MG Road" },
                        { label:"City",               key:"city",   placeholder:"Dehradun" },
                        { label:"State",              key:"state",  placeholder:"Uttarakhand" },
                        { label:"PIN Code",           key:"pincode",placeholder:"248001" },
                      ].map(({ label, key, placeholder }) => (
                        <div key={key} style={{marginBottom:"0.75rem"}}>
                          <label style={{color:"#6b7280", fontSize:"0.75rem", fontWeight:"600",
                            display:"block", marginBottom:"0.3rem"}}>{label}</label>
                          <input
                            value={newAddr[key]}
                            onChange={e => setNewAddr(a => ({...a, [key]: e.target.value}))}
                            placeholder={placeholder}
                            style={{
                              width:"100%", boxSizing:"border-box",
                              border:"1.5px solid #e5e7eb", borderRadius:"0.6rem",
                              padding:"0.55rem 0.75rem", fontSize:"0.88rem", outline:"none",
                              fontFamily:"inherit", color:"#1a3d2b"
                            }}
                          />
                        </div>
                      ))}
                      <div style={{display:"flex", gap:"0.6rem", marginTop:"0.25rem"}}>
                        {savedAddresses.length > 0 && (
                          <button onClick={() => { setAddingNewAddr(false); setCheckoutMsg(null); }} style={{
                            flex:1, background:"#f3f4f6", color:"#374151", border:"none",
                            borderRadius:"0.65rem", padding:"0.6rem", cursor:"pointer", fontWeight:"700", fontSize:"0.85rem"
                          }}>← Back</button>
                        )}
                        <button onClick={saveNewAddress} disabled={addrSaving} style={{
                          flex:2, background:"#3d9e60", color:"white", border:"none",
                          borderRadius:"0.65rem", padding:"0.6rem", cursor: addrSaving ? "wait" : "pointer",
                          fontWeight:"700", fontSize:"0.85rem"
                        }}>{addrSaving ? "Saving…" : "💾 Save Address"}</button>
                      </div>
                    </div>
                  )}

                  {/* Status message */}
                  {checkoutMsg && (
                    <div style={{
                      marginTop:"0.75rem", padding:"0.5rem 0.75rem", borderRadius:"0.5rem",
                      fontSize:"0.82rem", fontWeight:"600",
                      background: checkoutMsg.ok ? "#dcfce7" : "#fee2e2",
                      color: checkoutMsg.ok ? "#16a34a" : "#dc2626"
                    }}>{checkoutMsg.ok ? "✓ " : "✕ "}{checkoutMsg.text}</div>
                  )}
                </div>
              )}

              {/* ── STEP 2: ORDER SUMMARY ── */}
              {checkoutStep === "confirm" && (
                <div>
                  <p style={{fontWeight:"700", color:"#1a3d2b", marginBottom:"0.85rem", fontSize:"0.9rem"}}>
                    📦 Order Summary
                  </p>
                  <div style={{
                    border:"1.5px solid #e5e7eb", borderRadius:"0.875rem",
                    overflow:"hidden", marginBottom:"1rem"
                  }}>
                    {cart.map((item, i) => (
                      <div key={item.id} style={{
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"0.75rem 1rem",
                        background: i % 2 === 0 ? "white" : "#f9fafb",
                        borderBottom: i < cart.length - 1 ? "1px solid #f3f4f6" : "none"
                      }}>
                        <div>
                          <div style={{fontWeight:"600", color:"#1a3d2b", fontSize:"0.88rem"}}>{item.name}</div>
                          <div style={{color:"#9ca3af", fontSize:"0.78rem"}}>Qty: {item.quantity || 1}</div>
                        </div>
                        <div style={{fontWeight:"700", color:"#1a3d2b", fontSize:"0.88rem"}}>
                          ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery address summary */}
                  {(() => {
                    const addr = savedAddresses.find(a => a.id === selectedAddressId);
                    return addr ? (
                      <div style={{
                        background:"#f0fdf4", borderRadius:"0.75rem", padding:"0.85rem 1rem",
                        marginBottom:"1rem", border:"1.5px solid #d1fae5"
                      }}>
                        <div style={{color:"#6b7280", fontSize:"0.72rem", fontWeight:"600", marginBottom:"0.3rem"}}>
                          📍 DELIVERY TO
                        </div>
                        <div style={{fontWeight:"600", color:"#1a3d2b", fontSize:"0.88rem"}}>{addr.street}</div>
                        <div style={{color:"#4b5563", fontSize:"0.82rem"}}>{addr.city}, {addr.state} — {addr.pincode}</div>
                      </div>
                    ) : null;
                  })()}

                  {/* Price breakdown */}
                  <div style={{borderTop:"2px dashed #d1fae5", paddingTop:"0.85rem"}}>
                    <div style={{display:"flex", justifyContent:"space-between", color:"#6b7280", fontSize:"0.88rem", marginBottom:"0.35rem"}}>
                      <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", color:"#6b7280", fontSize:"0.88rem", marginBottom:"0.75rem"}}>
                      <span>GST (7%)</span><span>₹{gst.toFixed(2)}</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", color:"#1a3d2b", fontWeight:"800", fontSize:"1.05rem"}}>
                      <span>Total</span><span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {checkoutMsg && (
                    <div style={{
                      marginTop:"0.75rem", padding:"0.5rem 0.75rem", borderRadius:"0.5rem",
                      fontSize:"0.82rem", fontWeight:"600",
                      background:"#fee2e2", color:"#dc2626"
                    }}>✕ {checkoutMsg.text}</div>
                  )}
                </div>
              )}

              {/* ── STEP 3: SUCCESS ── */}
              {checkoutStep === "success" && (
                <div style={{textAlign:"center", padding:"1.5rem 0.5rem"}}>
                  <div style={{fontSize:"4rem", marginBottom:"1rem"}}>🎉</div>
                  <h3 style={{color:"#1a3d2b", fontWeight:"800", margin:"0 0 0.4rem"}}>
                    Order Placed Successfully!
                  </h3>
                  <p style={{color:"#6b7280", fontSize:"0.9rem", marginBottom:"1.25rem"}}>
                    Order #{confirmedOrder?.id} has been confirmed.
                  </p>
                  <div style={{
                    background:"#f0fdf4", borderRadius:"0.875rem", padding:"1rem 1.25rem",
                    marginBottom:"1.5rem", border:"1.5px solid #d1fae5", textAlign:"left"
                  }}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:"0.4rem"}}>
                      <span style={{color:"#6b7280", fontSize:"0.82rem"}}>Order ID</span>
                      <span style={{fontWeight:"700", color:"#1a3d2b", fontSize:"0.82rem"}}>#{confirmedOrder?.id}</span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:"0.4rem"}}>
                      <span style={{color:"#6b7280", fontSize:"0.82rem"}}>Total Paid</span>
                      <span style={{fontWeight:"700", color:"#1a3d2b", fontSize:"0.82rem"}}>
                        ₹{confirmedOrder?.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <span style={{color:"#6b7280", fontSize:"0.82rem"}}>Status</span>
                      <span style={{
                        background:"#fef9c3", color:"#854d0e",
                        padding:"0.15rem 0.6rem", borderRadius:"2rem",
                        fontSize:"0.72rem", fontWeight:"700"
                      }}>PENDING</span>
                    </div>
                  </div>
                  <button onClick={closeCheckout} style={{
                    width:"100%", background:"#1a3d2b", color:"#facc15",
                    border:"none", borderRadius:"0.75rem", padding:"0.8rem",
                    cursor:"pointer", fontWeight:"800", fontSize:"0.95rem"
                  }}>Continue Shopping 🛍️</button>
                </div>
              )}
            </div>

            {/* Modal Footer — action buttons */}
            {checkoutStep !== "success" && (
              <div style={{
                padding:"1rem 1.5rem", borderTop:"1px solid #f3f4f6",
                display:"flex", gap:"0.75rem", flexShrink:0
              }}>
                {checkoutStep === "address" && (
                  <>
                    <button onClick={closeCheckout} style={{
                      flex:1, background:"#f3f4f6", color:"#374151", border:"none",
                      borderRadius:"0.75rem", padding:"0.75rem", cursor:"pointer",
                      fontWeight:"700", fontSize:"0.9rem"
                    }}>Cancel</button>
                    <button
                      onClick={() => {
                        if (!selectedAddressId) {
                          setCheckoutMsg({ ok:false, text:"Please select or add a delivery address." });
                          return;
                        }
                        setCheckoutMsg(null);
                        setCheckoutStep("confirm");
                      }}
                      style={{
                        flex:2, background:"#1a3d2b", color:"#facc15", border:"none",
                        borderRadius:"0.75rem", padding:"0.75rem", cursor:"pointer",
                        fontWeight:"800", fontSize:"0.9rem"
                      }}>Review Order →</button>
                  </>
                )}
                {checkoutStep === "confirm" && (
                  <>
                    <button onClick={() => { setCheckoutStep("address"); setCheckoutMsg(null); }} style={{
                      flex:1, background:"#f3f4f6", color:"#374151", border:"none",
                      borderRadius:"0.75rem", padding:"0.75rem", cursor:"pointer",
                      fontWeight:"700", fontSize:"0.9rem"
                    }}>← Back</button>
                    <button onClick={placeOrder} disabled={placingOrder} style={{
                      flex:2, background: placingOrder ? "#9ca3af" : "#16a34a", color:"white", border:"none",
                      borderRadius:"0.75rem", padding:"0.75rem",
                      cursor: placingOrder ? "wait" : "pointer",
                      fontWeight:"800", fontSize:"0.9rem"
                    }}>{placingOrder ? "Placing Order…" : "✅ Place Order"}</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── WISHLIST MODAL ── */}
      {showWishlist && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }}>
          <div style={{
            background: "white", borderRadius: "1.25rem", padding: "1.5rem",
            width: "90%", maxWidth: "480px", maxHeight: "80vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ color: "#be185d", margin: 0, fontWeight: "800" }}>❤️ My Wishlist</h2>
              <button onClick={() => setShowWishlist(false)} style={{
                background: "#f3f4f6", border: "none", borderRadius: "50%",
                width: "32px", height: "32px", cursor: "pointer", fontSize: "1rem"
              }}>✕</button>
            </div>

            {wishlist.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "#9ca3af" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🤍</div>
                <p>Your wishlist is empty</p>
              </div>
            ) : (
              wishlist.map(item => (
                <div key={item.id} style={{
                  padding: "0.85rem", background: "#fdf2f8", borderRadius: "0.75rem", marginBottom: "0.5rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div>
                      <h4 style={{ color: "#be185d", margin: "0 0 0.2rem", fontWeight: "700" }}>{item.name}</h4>
                      <p style={{ color: "#6b7280", margin: 0, fontSize: "0.85rem" }}>₹{item.price}</p>
                    </div>
                    <button onClick={() => toggleWishlist({ id: item.productId })} style={{
                      background: "#fee2e2", color: "#ef4444", padding: "0.4rem 0.8rem",
                      borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.8rem"
                    }}>Remove</button>
                  </div>
                  <button
                    onClick={() => addToCart({ id: item.productId, name: item.name, price: item.price, quantity: 99 })}
                    style={{
                      width: "100%", padding: "0.45rem",
                      background: isInCart(item.productId) ? "#dcfce7" : "#3d9e60",
                      color: isInCart(item.productId) ? "#16a34a" : "white",
                      border: "none", borderRadius: "0.5rem", cursor: "pointer",
                      fontWeight: "700", fontSize: "0.82rem"
                    }}
                  >{isInCart(item.productId) ? "✓ Added to Cart" : "🛒 Add to Cart"}</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;