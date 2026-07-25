import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { useToast } from "./context/ToastContext";

import { BASE_URL } from "./config";

function Farmerdashboard() {
const navigate = useNavigate();
const location = useLocation();
const { showToast } = useToast();

const [user, setUser] = useState(null);
const [activeTab, setActiveTab] = useState("Profile");
const [products, setProducts] = useState([]);
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(false);
const [newProduct, setNewProduct] = useState({
name: "",
quantity: "",
price: "",
description: "",
category: "",
});
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

const [uploadingImage, setUploadingImage] = useState(false);

// ── EDIT PRODUCT STATE ──
const [editingProduct, setEditingProduct] = useState(null);
const [editForm, setEditForm] = useState({});
const [editImageFile, setEditImageFile] = useState(null);
const [editImagePreview, setEditImagePreview] = useState(null);
const [editSaving, setEditSaving] = useState(false);
const [editUploadingImage, setEditUploadingImage] = useState(false);
const [editMsg, setEditMsg] = useState(null);

// ── PROFILE EDIT STATE ──
const [profileFlipped, setProfileFlipped] = useState(false);
const [profileForm, setProfileForm] = useState({});
const [profileSaving, setProfileSaving] = useState(false);
const [profileMsg, setProfileMsg] = useState(null);
const [pwForm, setPwForm] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
const [pwSaving, setPwSaving] = useState(false);
const [pwMsg, setPwMsg] = useState(null);
const [showPw, setShowPw] = useState({ cur:false, nw:false, cf:false });
const [profileTab, setProfileTab] = useState("view"); // "view" | "edit" | "password"

const openProfileEdit = () => {
  setProfileForm({
    name:    user?.name    || "",
    email:   user?.email   || "",
    phone:   user?.phone   || "",
    city:    user?.city    || "",
    state:   user?.state   || "",
    address: user?.address || "",
    age:     user?.age     || "",
    gender:  user?.gender  || "",
  });
  setProfileMsg(null);
  setProfileTab("edit");
};

const saveProfile = async () => {
  if (!profileForm.name || !profileForm.email) {
    setProfileMsg({ ok:false, text:"Name and email are required." });
    return;
  }
  setProfileSaving(true); setProfileMsg(null);
  try {
    const res = await axiosInstance.put(BASE_URL + "/api/users/update/" + user.id, profileForm);
    const updatedUser = res.data.user || res.data;
    setUser(updatedUser);
    const stored = JSON.parse(localStorage.getItem("farmfusion_user") || "{}");
    localStorage.setItem("farmfusion_user", JSON.stringify({ ...stored, ...updatedUser }));
    setProfileMsg({ ok:true, text:"Profile updated successfully!" });
    setTimeout(() => setProfileTab("view"), 1200);
  } catch (err) {
    setProfileMsg({ ok:false, text: (err.response && err.response.data && err.response.data.message) || "Update failed. Try again." });
  }
  setProfileSaving(false);
};

const savePassword = async () => {
  if (pwForm.newPassword !== pwForm.confirmPassword) {
    setPwMsg({ ok:false, text:"New passwords do not match." }); return;
  }
  if (pwForm.newPassword.length < 6) {
    setPwMsg({ ok:false, text:"Min 6 characters required." }); return;
  }
  setPwSaving(true); setPwMsg(null);
  try {
    await axiosInstance.put(BASE_URL + "/api/users/update/" + user.id, {
      password: pwForm.newPassword
    });
    setPwMsg({ ok:true, text:"Password changed successfully!" });
    setPwForm({ currentPassword:"", newPassword:"", confirmPassword:"" });
    setTimeout(() => setProfileTab("view"), 1400);
  } catch (err) {
    setPwMsg({ ok:false, text: (err.response && err.response.data && err.response.data.message) || "Failed to update password." });
  }
  setPwSaving(false);
};

const openEditModal = (product) => {
  setEditingProduct(product);
  setEditForm({
    name:        product.name        || '',
    price:       product.price       || '',
    quantity:    product.quantity    || '',
    description: product.description || '',
    category:    product.category    || '',
    inStock:     product.quantity > 0,
    imageUrl:    product.imageUrl    || '',
  });
  setEditImageFile(null);
  setEditImagePreview(null);
  setEditMsg(null);
};

const closeEditModal = () => {
  setEditingProduct(null);
  setEditImageFile(null);
  setEditImagePreview(null);
  setEditMsg(null);
};

const handleEditImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setEditImageFile(file);
  setEditImagePreview(URL.createObjectURL(file));
};

const handleEditSave = async () => {
  if (!editForm.name || !editForm.price) {
    setEditMsg({ ok: false, text: 'Name and price are required.' });
    return;
  }
  setEditSaving(true); setEditMsg(null);
  try {
    let imageUrl = editForm.imageUrl;
    if (editImageFile) {
      setEditUploadingImage(true);
      const imgFormData = new FormData();
      imgFormData.append('file', editImageFile);
      const imgRes = await axiosInstance.post(BASE_URL + '/api/image/upload', imgFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      imageUrl = imgRes.data;
      setEditUploadingImage(false);
    }
    const payload = {
      name:        editForm.name,
      price:       parseFloat(editForm.price),
      quantity:    editForm.inStock ? (parseInt(editForm.quantity) || 0) : 0,
      description: editForm.description,
      category:    editForm.category,
      imageUrl:    imageUrl,
    };
    await axiosInstance.put(BASE_URL + '/products/' + editingProduct.id, payload);
    const res = await axiosInstance.get(BASE_URL + '/products/farmer/' + user.id);
    setProducts(res.data);
    setEditMsg({ ok: true, text: 'Product updated successfully!' });
    setTimeout(() => closeEditModal(), 1200);
  } catch (err) {
    setEditUploadingImage(false);
    setEditMsg({ ok: false, text: (err.response && err.response.data && err.response.data.message) || 'Update failed. Try again.' });
  }
  setEditSaving(false);
};

useEffect(() => {
const loggedUser = location.state?.user || JSON.parse(localStorage.getItem("farmfusion_user"));
if (!loggedUser) {
navigate("/farmer-login");
} else {
setUser(loggedUser);
}
}, [location.state, navigate]);

useEffect(() => {
if (user) {
axiosInstance.get(`${BASE_URL}/products/farmer/${user.id}`)
.then(res => setProducts(res.data))
.catch(err => console.error("Failed to load products:", err));

axiosInstance.get(`${BASE_URL}/api/orders/farmer/${user.id}`)
.then(res => setOrders(res.data))
.catch(err => console.error("Failed to load orders:", err));
}
}, [user]);

const handleImageChange = (e) => {
const file = e.target.files[0];
if (!file) return;
setImageFile(file);
setImagePreview(URL.createObjectURL(file));
};

const handleAddProduct = async () => {
if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
showToast("Please fill all required fields!", "error");
return;
}

setLoading(true);
try {
// Step 1: Upload image to Cloudinary if one is selected
let imageUrl = "";
if (imageFile) {
setUploadingImage(true);
const imgFormData = new FormData();
imgFormData.append("file", imageFile);
const imgRes = await axiosInstance.post(`${BASE_URL}/api/image/upload`, imgFormData, {
headers: { "Content-Type": "multipart/form-data" }
});
imageUrl = imgRes.data;
setUploadingImage(false);
}

// Step 2: Save product with the returned Cloudinary URL
await axiosInstance.post(`${BASE_URL}/products/add`, {
name: newProduct.name,
quantity: parseInt(newProduct.quantity),
price: parseFloat(newProduct.price),
description: newProduct.description || "",
category: newProduct.category || "Other",
imageUrl: imageUrl,
addedBy: { id: user.id }
});

showToast("Product Added Successfully!", "success");
const res = await axiosInstance.get(`${BASE_URL}/products/farmer/${user.id}`);
setProducts(res.data);
setNewProduct({ name: "", quantity: "", price: "", description: "", category: "" });
setImageFile(null);
setImagePreview(null);
} catch (error) {
setUploadingImage(false);
showToast("Failed to add product: " + (error.response?.data || error.message), "error");
} finally {
setLoading(false);
}
};

const handleDeleteProduct = async (productId) => {
try {
await axiosInstance.delete(`${BASE_URL}/products/${productId}`);
const res = await axiosInstance.get(`${BASE_URL}/products/farmer/${user.id}`);
setProducts(res.data);
} catch (err) {
showToast("Failed to delete product", "error");
}
};

const handleStatusChange = async (orderId, status) => {
try {
await axiosInstance.patch(`${BASE_URL}/api/orders/${orderId}/status?status=${status}`);
const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
setOrders(updated);
} catch (err) {
showToast("Failed to update status", "error");
}
};

if (!user) return null;

return (
<div style={{minHeight: "100vh", background: "#dcfce7", padding: "2rem"}}>
<h1 style={{textAlign: "center", color: "#047857", fontSize: "2.5rem", marginBottom: "1rem"}}>Hello, {user?.name}!</h1>

<div style={{background: "rgba(255,255,255,0.3)", backdropFilter: "blur(10px)", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxWidth: "1000px", margin: "0 auto"}}>
{/* TABS */}
<div style={{display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap"}}>
{["Profile", "My Products", "Orders"].map(tab => (
<button key={tab} onClick={() => setActiveTab(tab)} style={{padding: "0.75rem 1.5rem", borderRadius: "0.5rem", background: activeTab === tab ? "#047857" : "#16a34a", color: "white", border: "none", cursor: "pointer", fontWeight: "bold"}}>
{tab}
</button>
))}
</div>

{/* PROFILE TAB */}
{activeTab === "Profile" && (
<div style={{maxWidth:"640px", margin:"0 auto"}}>

  {/* ── PROFILE CARD HEADER ── */}
  <div style={{
    background:"linear-gradient(135deg, #064e3b 0%, #16a34a 100%)",
    borderRadius:"1.25rem", padding:"1.75rem", marginBottom:"1.25rem",
    position:"relative", overflow:"hidden"
  }}>
    <div style={{position:"absolute", width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.05)", top:-50, right:-40}} />
    <div style={{position:"absolute", width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.05)", bottom:-20, left:20}} />
    <div style={{display:"flex", alignItems:"center", gap:"1.25rem", position:"relative"}}>
      <div style={{
        width:72, height:72, borderRadius:"50%",
        background:"#facc15", display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"1.8rem", fontWeight:"900", color:"#064e3b",
        border:"3px solid rgba(255,255,255,0.3)", boxShadow:"0 4px 16px rgba(0,0,0,0.2)", flexShrink:0
      }}>
        {user?.name?.charAt(0).toUpperCase() || "F"}
      </div>
      <div style={{flex:1}}>
        <div style={{color:"white", fontWeight:"800", fontSize:"1.3rem"}}>{user?.name}</div>
        <div style={{color:"#86efac", fontSize:"0.82rem", marginTop:"0.15rem"}}>🌾 FarmFusion Farmer · ID #{user?.id}</div>
        <div style={{color:"rgba(255,255,255,0.7)", fontSize:"0.78rem", marginTop:"0.1rem"}}>{user?.email}</div>
      </div>
      <div style={{display:"flex", flexDirection:"column", gap:"0.5rem", flexShrink:0}}>
        <button onClick={openProfileEdit} style={{
          background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)",
          color:"white", padding:"0.45rem 1rem", borderRadius:"2rem",
          cursor:"pointer", fontWeight:"700", fontSize:"0.8rem", whiteSpace:"nowrap"
        }}>✏ Edit Profile</button>
        <button onClick={() => { setProfileTab("password"); setPwMsg(null); }} style={{
          background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
          color:"rgba(255,255,255,0.85)", padding:"0.45rem 1rem", borderRadius:"2rem",
          cursor:"pointer", fontWeight:"700", fontSize:"0.8rem", whiteSpace:"nowrap"
        }}> Change Password</button>
      </div>
    </div>
  </div>

  {/* ── VIEW MODE ── */}
  {profileTab === "view" && (
    <div style={{background:"white", borderRadius:"1.25rem", padding:"1.5rem", boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
      <p style={{fontWeight:"800", color:"#047857", marginBottom:"1rem", fontSize:"0.95rem"}}>👤 Profile Details</p>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.85rem"}}>
        {[
          { icon:"👤", label:"Full Name",   val: user?.name },
          { icon:"📧", label:"Email",        val: user?.email },
          { icon:"📱", label:"Phone",        val: user?.phone || "—" },
          { icon:"🏙️", label:"City",         val: user?.city  || "—" },
          { icon:"🗺️", label:"State",        val: user?.state || "—" },
          { icon:"🏠", label:"Address",      val: user?.address || "—" },
          { icon:"🎂", label:"Age",           val: user?.age   || "—" },
          { icon:"⚧️", label:"Gender",        val: user?.gender || "—" },
          { icon:"🪪", label:"Aadhaar",       val: user?.aadhaar ? "••••" + user.aadhaar.slice(-4) : "—" },
        ].map(({ icon, label, val }) => (
          <div key={label} style={{background:"#f0fdf4", borderRadius:"0.75rem", padding:"0.8rem 0.9rem", border:"1px solid #d1fae5"}}>
            <div style={{color:"#6b7280", fontSize:"0.7rem", fontWeight:"600", marginBottom:"0.25rem"}}>{icon} {label}</div>
            <div style={{color:"#1a3d2b", fontSize:"0.88rem", fontWeight:"700", wordBreak:"break-all"}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* ── EDIT MODE ── */}
  {profileTab === "edit" && (
    <div style={{background:"white", borderRadius:"1.25rem", padding:"1.5rem", boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem"}}>
        <p style={{fontWeight:"800", color:"#047857", margin:0, fontSize:"0.95rem"}}>✏️ Edit Profile</p>
        <button onClick={() => setProfileTab("view")} style={{background:"#f3f4f6", border:"none", borderRadius:"50%", width:30, height:30, cursor:"pointer", fontSize:"0.9rem"}}>✕</button>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem"}}>
        {[
          { key:"name",    label:" Full Name",  type:"text"   },
          { key:"phone",   label:" Phone",       type:"text"   },
          { key:"email",   label:" Email",        type:"email"  },
          { key:"age",     label:" Age",          type:"number" },
          { key:"city",    label:" City",         type:"text"   },
          { key:"state",   label:" State",        type:"text"   },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label style={{color:"#6b7280", fontSize:"0.73rem", fontWeight:"600", display:"block", marginBottom:"0.3rem"}}>{label}</label>
            <input type={type} value={profileForm[key] || ""} onChange={e => setProfileForm(f => ({...f, [key]: e.target.value}))}
              style={{width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:"0.6rem",
                padding:"0.55rem 0.7rem", fontSize:"0.88rem", outline:"none", fontFamily:"inherit"}}
              onFocus={e => e.target.style.borderColor="#16a34a"}
              onBlur={e => e.target.style.borderColor="#e5e7eb"} />
          </div>
        ))}
        <div style={{gridColumn:"1 / -1"}}>
          <label style={{color:"#6b7280", fontSize:"0.73rem", fontWeight:"600", display:"block", marginBottom:"0.3rem"}}>🏠 Address</label>
          <textarea value={profileForm.address || ""} onChange={e => setProfileForm(f => ({...f, address: e.target.value}))}
            rows={2} style={{width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:"0.6rem",
              padding:"0.55rem 0.7rem", fontSize:"0.88rem", outline:"none", fontFamily:"inherit", resize:"vertical"}}
            onFocus={e => e.target.style.borderColor="#16a34a"}
            onBlur={e => e.target.style.borderColor="#e5e7eb"} />
        </div>
        <div style={{gridColumn:"1 / -1"}}>
          <label style={{color:"#6b7280", fontSize:"0.73rem", fontWeight:"600", display:"block", marginBottom:"0.3rem"}}>⚧️ Gender</label>
          <select value={profileForm.gender || ""} onChange={e => setProfileForm(f => ({...f, gender: e.target.value}))}
            style={{width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:"0.6rem",
              padding:"0.55rem 0.7rem", fontSize:"0.88rem", outline:"none", background:"white", fontFamily:"inherit"}}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      {profileMsg && (
        <div style={{marginTop:"0.75rem", padding:"0.55rem 0.8rem", borderRadius:"0.5rem", fontSize:"0.83rem", fontWeight:"600",
          background: profileMsg.ok ? "#dcfce7" : "#fee2e2", color: profileMsg.ok ? "#16a34a" : "#dc2626"}}>
          {profileMsg.ok ? "✓ " : "✕ "}{profileMsg.text}
        </div>
      )}
      <button onClick={saveProfile} disabled={profileSaving} style={{
        marginTop:"1rem", width:"100%", background:"#047857", color:"white", border:"none",
        borderRadius:"0.75rem", padding:"0.75rem", cursor: profileSaving ? "wait" : "pointer",
        fontWeight:"800", fontSize:"0.92rem", transition:"background 0.2s"
      }}>
        {profileSaving ? "Saving..." : "💾 Save Changes"}
      </button>
    </div>
  )}

  {/* ── CHANGE PASSWORD MODE ── */}
  {profileTab === "password" && (
    <div style={{background:"white", borderRadius:"1.25rem", padding:"1.5rem", boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem"}}>
        <p style={{fontWeight:"800", color:"#047857", margin:0, fontSize:"0.95rem"}}> Change Password</p>
        <button onClick={() => setProfileTab("view")} style={{background:"#f3f4f6", border:"none", borderRadius:"50%", width:30, height:30, cursor:"pointer", fontSize:"0.9rem"}}>✕</button>
      </div>
      {[
        { key:"currentPassword", label:"Current Password", showKey:"cur" },
        { key:"newPassword",     label:"New Password",     showKey:"nw"  },
        { key:"confirmPassword", label:"Confirm Password", showKey:"cf"  },
      ].map(({ key, label, showKey }) => (
        <div key={key} style={{marginBottom:"0.9rem"}}>
          <label style={{color:"#6b7280", fontSize:"0.73rem", fontWeight:"600", display:"block", marginBottom:"0.3rem"}}>{label}</label>
          <div style={{position:"relative"}}>
            <input type={showPw[showKey] ? "text" : "password"} value={pwForm[key]} placeholder="••••••••"
              onChange={e => setPwForm(f => ({...f, [key]: e.target.value}))}
              style={{width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:"0.6rem",
                padding:"0.55rem 2.5rem 0.55rem 0.7rem", fontSize:"0.88rem", outline:"none", fontFamily:"inherit"}}
              onFocus={e => e.target.style.borderColor="#16a34a"}
              onBlur={e => e.target.style.borderColor="#e5e7eb"} />
            <button onClick={() => setShowPw(s => ({...s, [showKey]: !s[showKey]}))} style={{
              position:"absolute", right:"0.6rem", top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", cursor:"pointer", fontSize:"1rem", color:"#9ca3af"
            }}>{showPw[showKey] ? "🙈" : "👁️"}</button>
          </div>
        </div>
      ))}
      <div style={{background:"#f0fdf4", borderRadius:"0.6rem", padding:"0.6rem 0.8rem", fontSize:"0.78rem", color:"#4b5563", marginBottom:"0.75rem", lineHeight:1.6}}>
         Min 6 characters. Mix of letters, numbers & symbols recommended.
      </div>
      {pwMsg && (
        <div style={{marginBottom:"0.75rem", padding:"0.55rem 0.8rem", borderRadius:"0.5rem", fontSize:"0.83rem", fontWeight:"600",
          background: pwMsg.ok ? "#dcfce7" : "#fee2e2", color: pwMsg.ok ? "#16a34a" : "#dc2626"}}>
          {pwMsg.ok ? "✓ " : "✕ "}{pwMsg.text}
        </div>
      )}
      <button onClick={savePassword} disabled={pwSaving} style={{
        width:"100%", background:"#047857", color:"white", border:"none",
        borderRadius:"0.75rem", padding:"0.75rem", cursor: pwSaving ? "wait" : "pointer",
        fontWeight:"800", fontSize:"0.92rem"
      }}>
        {pwSaving ? "Updating..." : " Update Password"}
      </button>
    </div>
  )}

</div>
)}

{/* MY PRODUCTS TAB */}
{activeTab === "My Products" && (
<div>
<div style={{background: "#f0fdf4", padding: "1.5rem", borderRadius: "0.5rem", marginBottom: "2rem"}}>
<h3 style={{color: "#047857", marginBottom: "1rem"}}>Add New Product</h3>
<input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
<input type="number" placeholder="Quantity (kg)" value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
<input type="number" placeholder="Price (₹)" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
<input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem"}} />
<select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} style={{width: "100%", padding: "0.5rem", marginBottom: "0.75rem", border: "1px solid #ddd", borderRadius: "0.5rem", background: "white", color: newProduct.category ? "#111" : "#9ca3af"}}>
<option value="">Select Category</option>
<option value="Vegetables">Vegetables</option>
<option value="Fruits">Fruits</option>
<option value="Grains">Grains</option>
<option value="Dairy">Dairy</option>
<option value="Spices">Spices</option>
<option value="Other">Other</option>
</select>

{/* Image Upload */}
<div style={{marginBottom: "1rem"}}>
<label style={{display: "block", color: "#047857", fontWeight: "600", marginBottom: "0.4rem", fontSize: "0.9rem"}}>
Product Image (optional)
</label>
<label style={{
display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
border: "2px dashed #86efac", borderRadius: "0.75rem", padding: "1rem",
cursor: "pointer", background: "#f0fdf4", color: "#047857", fontWeight: "600",
fontSize: "0.9rem", transition: "all 0.2s"
}}>
📷 {imageFile ? imageFile.name : "Click to choose image from your files"}
<input type="file" accept="image/*" onChange={handleImageChange} style={{display: "none"}} />
</label>
{imagePreview && (
<div style={{marginTop: "0.75rem", textAlign: "center"}}>
<img src={imagePreview} alt="Preview" style={{
width: "100%", maxHeight: "180px", objectFit: "cover",
borderRadius: "0.5rem", border: "2px solid #86efac"
}} />
<button onClick={() => { setImageFile(null); setImagePreview(null); }} style={{
marginTop: "0.4rem", background: "none", border: "none",
color: "#ef4444", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600"
}}>✕ Remove image</button>
</div>
)}
</div>

<button onClick={handleAddProduct} disabled={loading} style={{width: "100%", background: "#16a34a", color: "white", padding: "0.75rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem"}}>
{uploadingImage ? "Uploading image..." : loading ? "Adding product..." : "Add Product"}
</button>
</div>

{products.length === 0 ? (
<p style={{color: "#666"}}>No products added yet.</p>
) : (
<div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem"}}>
{products.map(product => (
<div key={product.id} style={{background: "white", borderRadius: "0.75rem", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"}}>
{/* Product Image */}
<div style={{position: "relative", height: "160px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center"}}>
{product.imageUrl ? (
<img
src={product.imageUrl}
alt={product.name}
style={{width: "100%", height: "160px", objectFit: "cover", display: "block"}}
onError={e => { e.target.onerror = null; e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
/>
) : null}
<div style={{
display: product.imageUrl ? "none" : "flex",
width: "100%", height: "160px", background: "#f0fdf4",
alignItems: "center", justifyContent: "center",
flexDirection: "column", gap: "0.4rem", position: "absolute", top: 0, left: 0
}}>
<span style={{fontSize: "2.5rem"}}> </span>
<span style={{color: "#9ca3af", fontSize: "0.75rem"}}>No Image</span>
</div>
{product.category && (
<span style={{
position: "absolute", top: "0.5rem", left: "0.5rem",
background: "rgba(4,120,87,0.85)", color: "white",
padding: "0.2rem 0.6rem", borderRadius: "2rem",
fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase"
}}>{product.category}</span>
)}
</div>
{/* Product Info */}
<div style={{padding: "0.9rem"}}>
<p style={{fontWeight: "700", color: "#047857", margin: "0 0 0.3rem", fontSize: "1rem"}}>{product.name}</p>
{product.description && <p style={{color: "#6b7280", fontSize: "0.8rem", margin: "0 0 0.4rem"}}>{product.description}</p>}
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem"}}>
<span style={{color: "#1a3d2b", fontWeight: "800", fontSize: "1.1rem"}}>₹{product.price}</span>
<span style={{color: product.quantity > 0 ? "#16a34a" : "#ef4444", fontSize: "0.8rem", fontWeight: "600"}}>
{product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
</span>
</div>
<div style={{display:"flex", gap:"0.5rem"}}>
  <button onClick={() => openEditModal(product)} style={{
    flex:1, background:"#f0fdf4", color:"#047857",
    padding:"0.5rem", borderRadius:"0.5rem", border:"1.5px solid #86efac",
    cursor:"pointer", fontWeight:"700", fontSize:"0.82rem"
  }}> Edit</button>
  <button onClick={() => handleDeleteProduct(product.id)} style={{
    flex:1, background:"#fee2e2", color:"#ef4444",
    padding:"0.5rem", borderRadius:"0.5rem", border:"none",
    cursor:"pointer", fontWeight:"700", fontSize:"0.82rem"
  }}>🗑 Delete</button>
</div>
</div>
</div>
))}
</div>
)}
</div>
)}

{/* ORDERS TAB */}
{activeTab === "Orders" && (
orders.length === 0 ? (
<p style={{color: "#666"}}>No orders yet.</p>
) : (
<table style={{width: "100%", borderCollapse: "collapse"}}>
<thead>
<tr style={{background: "#dcfce7"}}>
<th style={{padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd"}}>Order ID</th>
<th style={{padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd"}}>Total</th>
<th style={{padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd"}}>Date</th>
<th style={{padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd"}}>Status</th>
</tr>
</thead>
<tbody>
{orders.map(order => (
<tr key={order.id} style={{borderBottom: "1px solid #ddd"}}>
<td style={{padding: "0.75rem"}}>{order.id}</td>
<td style={{padding: "0.75rem"}}>₹{order.totalAmount}</td>
<td style={{padding: "0.75rem"}}>{new Date(order.orderDate).toLocaleDateString()}</td>
<td style={{padding: "0.75rem"}}>
<select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} style={{padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #ddd"}}>
<option>PENDING</option>
<option>CONFIRMED</option>
<option>SHIPPED</option>
<option>DELIVERED</option>
<option>CANCELLED</option>
</select>
</td>
</tr>
))}
</tbody>
</table>
)
)}
</div>

{/* LOGOUT */}
<button onClick={() => {  localStorage.removeItem("farmfusion_user");
                          localStorage.removeItem("token");  navigate("/farmer-login"); }} style={{display: "block", margin: "2rem auto", background: "#eab308", color: "white", padding: "0.75rem 2rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem"}}>
Logout
</button>
{/* ── EDIT PRODUCT MODAL ── */}
{editingProduct && (
  <div onClick={closeEditModal} style={{
    position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:1000, padding:"1rem"
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      background:"white", borderRadius:"1.25rem",
      width:"560px", maxWidth:"96vw", maxHeight:"90vh",
      display:"flex", flexDirection:"column",
      boxShadow:"0 24px 80px rgba(0,0,0,0.28)", overflow:"hidden"
    }}>

      {/* Modal Header */}
      <div style={{
        background:"linear-gradient(135deg, #064e3b 0%, #16a34a 100%)",
        padding:"1.25rem 1.5rem",
        display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0
      }}>
        <div>
          <div style={{color:"white", fontWeight:"800", fontSize:"1.1rem"}}> Edit Product</div>
          <div style={{color:"#86efac", fontSize:"0.8rem", marginTop:"0.1rem"}}>{editingProduct.name}</div>
        </div>
        <button onClick={closeEditModal} style={{
          background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%",
          width:32, height:32, cursor:"pointer", color:"white", fontSize:"1rem",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>✕</button>
      </div>

      {/* Modal Body */}
      <div style={{padding:"1.5rem", overflowY:"auto", flex:1, display:"flex", flexDirection:"column", gap:"1rem"}}>

        {/* In Stock Toggle */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background: editForm.inStock ? "#f0fdf4" : "#fef2f2",
          border:"1.5px solid " + (editForm.inStock ? "#86efac" : "#fca5a5"),
          borderRadius:"0.75rem", padding:"0.8rem 1rem"
        }}>
          <div>
            <div style={{fontWeight:"700", color: editForm.inStock ? "#047857" : "#dc2626", fontSize:"0.9rem"}}>
              {editForm.inStock ? " In Stock" : " Out of Stock"}
            </div>
            <div style={{color:"#6b7280", fontSize:"0.75rem", marginTop:"0.1rem"}}>Toggle availability</div>
          </div>
          <div onClick={() => setEditForm(f => ({...f, inStock: !f.inStock}))} style={{
            width:50, height:28, borderRadius:"999px", cursor:"pointer", position:"relative",
            background: editForm.inStock ? "#16a34a" : "#d1d5db", transition:"background 0.25s", flexShrink:0
          }}>
            <div style={{
              position:"absolute", top:4, left: editForm.inStock ? 26 : 4,
              width:20, height:20, borderRadius:"50%", background:"white",
              boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left 0.25s"
            }} />
          </div>
        </div>

        {/* Name + Category */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem"}}>
          <div>
            <label style={{color:"#6b7280", fontSize:"0.75rem", fontWeight:"600", display:"block", marginBottom:"0.3rem"}}>📦 Product Name *</label>
            <input value={editForm.name} onChange={e => setEditForm(f => ({...f, name:e.target.value}))}
              placeholder="Product name"
              style={{width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:"0.6rem", padding:"0.6rem 0.75rem", fontSize:"0.88rem", outline:"none", fontFamily:"inherit"}} />
          </div>
          <div>
            <label style={{color:"#6b7280", fontSize:"0.75rem", fontWeight:"600", display:"block", marginBottom:"0.3rem"}}>🏷️ Category</label>
            <select value={editForm.category} onChange={e => setEditForm(f => ({...f, category:e.target.value}))}
              style={{width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:"0.6rem", padding:"0.6rem 0.75rem", fontSize:"0.88rem", outline:"none", background:"white", fontFamily:"inherit"}}>
              <option value="">Select Category</option>
              {["Vegetables","Fruits","Grains","Dairy","Spices","Other"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price + Quantity */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem"}}>
          <div>
            <label style={{color:"#6b7280", fontSize:"0.75rem", fontWeight:"600", display:"block", marginBottom:"0.3rem"}}>💰 Price (₹) *</label>
            <input type="number" value={editForm.price} onChange={e => setEditForm(f => ({...f, price:e.target.value}))}
              placeholder="0.00"
              style={{width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:"0.6rem", padding:"0.6rem 0.75rem", fontSize:"0.88rem", outline:"none", fontFamily:"inherit"}} />
          </div>
          <div>
            <label style={{color:"#6b7280", fontSize:"0.75rem", fontWeight:"600", display:"block", marginBottom:"0.3rem"}}>📊 Quantity (kg)</label>
            <input type="number" value={editForm.quantity}
              onChange={e => setEditForm(f => ({...f, quantity:e.target.value}))}
              disabled={!editForm.inStock}
              placeholder={editForm.inStock ? "Enter qty" : "Out of stock"}
              style={{width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:"0.6rem", padding:"0.6rem 0.75rem", fontSize:"0.88rem", outline:"none", fontFamily:"inherit",
                background: editForm.inStock ? "white" : "#f3f4f6", color: editForm.inStock ? "#111" : "#9ca3af"}} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{color:"#6b7280", fontSize:"0.75rem", fontWeight:"600", display:"block", marginBottom:"0.3rem"}}>📝 Description</label>
          <textarea value={editForm.description} onChange={e => setEditForm(f => ({...f, description:e.target.value}))}
            rows={3} placeholder="Short description..."
            style={{width:"100%", boxSizing:"border-box", border:"1.5px solid #e5e7eb", borderRadius:"0.6rem", padding:"0.6rem 0.75rem", fontSize:"0.88rem", outline:"none", fontFamily:"inherit", resize:"vertical"}} />
        </div>

        {/* Image Upload */}
        <div>
          <label style={{color:"#6b7280", fontSize:"0.75rem", fontWeight:"600", display:"block", marginBottom:"0.5rem"}}>🖼️ Product Image</label>
          {(editImagePreview || editForm.imageUrl) && (
            <div style={{position:"relative", marginBottom:"0.75rem"}}>
              <img src={editImagePreview || editForm.imageUrl} alt="preview"
                style={{width:"100%", height:"160px", objectFit:"cover", borderRadius:"0.6rem", border:"2px solid #86efac", display:"block"}} />
              <button onClick={() => { setEditImageFile(null); setEditImagePreview(null); setEditForm(f => ({...f, imageUrl:""})); }}
                style={{position:"absolute", top:"0.4rem", right:"0.4rem", background:"rgba(0,0,0,0.55)", border:"none", borderRadius:"50%", width:28, height:28, cursor:"pointer", color:"white", fontSize:"0.85rem", display:"flex", alignItems:"center", justifyContent:"center"}}>✕</button>
            </div>
          )}
          <label style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
            border:"2px dashed #86efac", borderRadius:"0.75rem", padding:"0.85rem",
            cursor:"pointer", background:"#f0fdf4", color:"#047857", fontWeight:"600", fontSize:"0.85rem"
          }}>
            📷 {editImageFile ? editImageFile.name : "Click to change image"}
            <input type="file" accept="image/*" onChange={handleEditImageChange} style={{display:"none"}} />
          </label>
        </div>

        {/* Status Message */}
        {editMsg && (
          <div style={{
            padding:"0.55rem 0.8rem", borderRadius:"0.5rem", fontSize:"0.83rem", fontWeight:"600",
            background: editMsg.ok ? "#dcfce7" : "#fee2e2",
            color: editMsg.ok ? "#16a34a" : "#dc2626"
          }}>{editMsg.ok ? "✓ " : "✕ "}{editMsg.text}</div>
        )}

        {/* Save Button */}
        <button onClick={handleEditSave} disabled={editSaving} style={{
          background:"#047857", color:"white", border:"none", borderRadius:"0.75rem",
          padding:"0.8rem", cursor: editSaving ? "wait" : "pointer",
          fontWeight:"800", fontSize:"0.95rem", transition:"background 0.2s",
          marginTop:"0.25rem"
        }}>
          {editUploadingImage ? "️ Uploading image..." : editSaving ? "Saving..." : " Save Changes"}
        </button>

      </div>
    </div>
  </div>
)}

</div>
);
}

export default Farmerdashboard;