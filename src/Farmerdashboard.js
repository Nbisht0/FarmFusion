import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

import LeafImage from './assets/img.png';
import Rightleaf from './assets/RL3-removebg-preview.png';

const BASE_URL = "http://localhost:8080";

function FarmerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
    imageFile: null,
    imagePreview: ""
  });

  // ---------------------------
  // LOAD USER FROM LOGIN / STORAGE
  // ---------------------------
  useEffect(() => {
    const loggedUser =
      location.state?.user ||
      JSON.parse(localStorage.getItem("farmfusion_user"));

    if (!loggedUser) {
      navigate("/farmer-login");
    } else {
      setUser(loggedUser);
    }
  }, [location.state, navigate]);

  // ---------------------------
  // LOAD PRODUCTS FROM DB
  // ---------------------------
  useEffect(() => {
    if (user) {
      axios.get(`${BASE_URL}/products/farmer/${user.id}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error("Failed to load products:", err));
    }
  }, [user]);

  // ---------------------------
  // LOAD ORDERS FROM DB
  // ---------------------------
  useEffect(() => {
    if (user) {
      axios.get(`${BASE_URL}/api/orders/customer/${user.id}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error("Failed to load orders:", err));
    }
  }, [user]);

  // ---------------------------
  // REAL PROFILE DATA
  // ---------------------------
  const farmer = {
    name: user?.name || "Farmer",
    age: user?.age || "N/A",
    gender: user?.gender || "N/A",
    aadhaar: user?.aadhaar || "N/A",
    address: user?.address || "N/A",
    phone: user?.phone || "N/A",
    city: user?.city || "N/A",
    state: user?.state || "N/A",
    email: user?.email || "N/A",
  };

  // ---------------------------
  // ADD PRODUCT
  // ---------------------------
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
      alert("Please fill all fields!");
      return;
    }
    if (!newProduct.imageFile) {
      alert("Please upload product image!");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", newProduct.name);
      formDataToSend.append("quantity", newProduct.quantity);
      formDataToSend.append("price", newProduct.price);
      formDataToSend.append("description", newProduct.description || "");
      formDataToSend.append("category", newProduct.category || "General");
      formDataToSend.append("farmerId", user.id);
      formDataToSend.append("imageFile", newProduct.imageFile);

      await axios.post(
        `${BASE_URL}/products/addWithImage`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Product Added Successfully!");

      // Refresh products from DB
      const res = await axios.get(`${BASE_URL}/products/farmer/${user.id}`);
      setProducts(res.data);

      // Reset form
      setNewProduct({
        name: "", quantity: "", price: "",
        description: "", category: "",
        imageFile: null, imagePreview: ""
      });

    } catch (error) {
      alert("Failed to upload product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // DELETE PRODUCT
  // ---------------------------
  const handleDeleteProduct = (index) => setDeleteIndex(index);

  const confirmDelete = async () => {
    try {
      const productId = products[deleteIndex].id;
      await axios.delete(`${BASE_URL}/products/${productId}`);
      const res = await axios.get(`${BASE_URL}/products/farmer/${user.id}`);
      setProducts(res.data);
      setDeleteIndex(null);
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  const cancelDelete = () => setDeleteIndex(null);

  // ---------------------------
  // UPDATE ORDER STATUS
  // ---------------------------
  const handleStatusChange = async (index, val) => {
    try {
      const orderId = orders[index].id;
      await axios.patch(`${BASE_URL}/api/orders/${orderId}/status?status=${val}`);
      const updated = [...orders];
      updated[index].status = val;
      setOrders(updated);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // ---------------------------
  // CROP TREND
  // ---------------------------
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  const futureCropTrend = months.map((month) => {
    const trend = { month };
    products.forEach((p) => {
      const fluctuation = Math.floor(Math.random() * 20) - 5;
      trend[p.name] = (p.quantity || 0) + fluctuation;
    });
    return trend;
  });

  const colors = ["#FF6347", "#DAA520", "#32CD32", "#8A2BE2", "#FF69B4", "#00CED1"];
  const getColor = (i) => colors[i % colors.length];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-green-100 relative overflow-auto flex flex-col items-center p-8">

      {/* Decorative Leaves */}
      <img src={Rightleaf} alt="Leaf" className="absolute top-0 right-0 w-64 h-auto opacity-80 pointer-events-none rotate-[15deg]" />
      <img src={LeafImage} alt="Leaf" className="absolute bottom-0 left-0 w-64 h-auto opacity-80 pointer-events-none -rotate-6" />

      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        Hello, {user?.name || "Farmer"}!
      </h1>

      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-xl shadow-md w-full max-w-4xl flex flex-col items-center">

        {/* TABS */}
        <div className="flex gap-6 mb-6 flex-wrap justify-center">
          {["Profile", "My Products", "Crop Trend", "Orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md shadow transition ${
                activeTab === tab ? "bg-green-700 text-white" : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full max-w-2xl text-gray-800">

          {/* PROFILE TAB */}
          {activeTab === "Profile" && (
            <ul className="space-y-2">
              <li><strong>Full Name:</strong> {farmer.name}</li>
              <li><strong>Email:</strong> {farmer.email}</li>
              <li><strong>Phone:</strong> {farmer.phone}</li>
              <li><strong>Gender:</strong> {farmer.gender}</li>
              <li><strong>Aadhaar:</strong> {farmer.aadhaar}</li>
              <li><strong>Address:</strong> {farmer.address}</li>
              <li><strong>City:</strong> {farmer.city}</li>
              <li><strong>State:</strong> {farmer.state}</li>
            </ul>
          )}

          {/* MY PRODUCTS TAB */}
          {activeTab === "My Products" && (
            <div className="flex flex-col gap-6">

              {/* ADD PRODUCT FORM */}
              <div className="flex flex-col gap-2 mb-4">
                <input type="text" placeholder="Product Name"
                  className="border p-2 rounded" value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />

                <input type="text" placeholder="Description"
                  className="border p-2 rounded" value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />

                <input type="text" placeholder="Category (e.g. Vegetables)"
                  className="border p-2 rounded" value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />

                <input type="number" placeholder="Quantity (kg)"
                  className="border p-2 rounded" value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} />

                <input type="number" placeholder="Price per kg (₹)"
                  className="border p-2 rounded" value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />

                <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 text-center">
                  Upload Product Image
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                      imageFile: e.target.files[0],
                      imagePreview: URL.createObjectURL(e.target.files[0])
                    })} />
                </label>

                {newProduct.imagePreview && (
                  <img src={newProduct.imagePreview} alt="Preview"
                    className="w-32 h-32 object-cover rounded shadow-md mx-auto" />
                )}

                <button onClick={handleAddProduct} disabled={loading}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </div>

              {/* PRODUCT LIST */}
              {products.length === 0 ? (
                <p className="text-center text-gray-500">No products added yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product, index) => (
                    <div key={product.id || index} className="bg-green-100 rounded-md shadow flex flex-col items-center p-2 relative">
                      <img src={product.imageUrl} alt={product.name}
                        className="w-full h-48 object-cover rounded-md mb-2" />
                      <p className="font-semibold text-green-700">{product.name}</p>
                      <p>Qty: {product.quantity} kg</p>
                      <p>₹{product.price} per kg</p>

                      <button onClick={() => handleDeleteProduct(index)}
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Delete
                      </button>

                      {deleteIndex === index && (
                        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-md">
                          <p className="mb-2 font-semibold text-red-600">Delete this product?</p>
                          <div className="flex gap-2">
                            <button onClick={confirmDelete}
                              className="bg-red-600 text-white px-3 py-1 rounded">Yes</button>
                            <button onClick={cancelDelete}
                              className="bg-gray-400 text-white px-3 py-1 rounded">No</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CROP TREND */}
          {activeTab === "Crop Trend" && (
            <div className="w-full h-64">
              {products.length === 0 ? (
                <p className="text-center text-gray-500">Add products to see crop trends.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={futureCropTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} kg`} />
                    <Legend verticalAlign="top" height={36} />
                    {products.map((product, index) => (
                      <Line key={index} type="monotone"
                        dataKey={product.name} stroke={getColor(index)}
                        activeDot={{ r: 8 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "Orders" && (
            orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders yet.</p>
            ) : (
              <table className="min-w-full bg-green-50 rounded-md overflow-hidden">
                <thead className="bg-green-200 text-green-700">
                  <tr>
                    <th className="py-2 px-4">Order ID</th>
                    <th className="py-2 px-4">Total</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className="text-center border-b border-green-300">
                      <td className="py-2 px-4">{order.id}</td>
                      <td className="py-2 px-4">₹{order.totalAmount}</td>
                      <td className="py-2 px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4">
                        <select value={order.status}
                          className="border rounded px-2 py-1"
                          onChange={(e) => handleStatusChange(index, e.target.value)}>
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
      </div>

      {/* LOGOUT */}
      <button
        onClick={() => {
          localStorage.removeItem("farmfusion_user");
          navigate("/farmer-login");
        }}
        className="mt-8 bg-yellow-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-yellow-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default FarmerDashboard;