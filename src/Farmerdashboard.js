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
import TomatoImg from './assets/organictomatoes.jpg';
import WheatImg from './assets/organicwheat.jpg';
import SpinachImg from './assets/organicspinach.jpg';

function FarmerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const [deleteIndex, setDeleteIndex] = useState(null);

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

  // ------------------------------------------
  // DEFAULT FARMER DETAILS (UNTIL YOU CONNECT DB)
  // ------------------------------------------
  const farmer = {
    name: user?.name || "Farmer",
    age: 35,
    gender: user?.gender || "Male",
    aadhar: "1234-5678-9012",
    address: "Village X, District Y"
  };

  // ------------------------------------------
  // PRODUCTS
  // ------------------------------------------
 const [products, setProducts] = useState([
   { name: "Organic Tomato", quantity: 20, price: 20, imageUrl: TomatoImg },
   { name: "Organic Wheat", quantity: 50, price: 15, imageUrl: WheatImg },
   { name: "Organic Spinach", quantity: 30, price: 25, imageUrl: SpinachImg },
 ]);


 const [newProduct, setNewProduct] = useState({
   name: "",
   quantity: "",
   price: "",
   imageFile: null,   // <-- real file
   imagePreview: ""    // <-- preview for UI
 });

const handleAddProduct = async () => {
  if (!newProduct.imageFile) {
    alert("Please upload product image");
    return;
  }

  const formData = new FormData();

  const productData = {
    name: newProduct.name,
    quantity: newProduct.quantity,
    price: newProduct.price
  };

  formData.append(
    "product",
    new Blob([JSON.stringify(productData)], { type: "application/json" })
  );

  formData.append("image", newProduct.imageFile);

  try {
    const response = await axios.post(
      "http://localhost:8080/products/addProduct",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Product Added Successfully!");

  } catch (error) {
    console.log(error);
    alert("Failed to upload product");
  }
};


  const handleDeleteProduct = (index) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    const updated = [...products];
    updated.splice(deleteIndex, 1);
    setProducts(updated);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
  };

  const handleUpdateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;

    setProducts(updated);
  };

  // ------------------------------------------
  // ORDERS
  // ------------------------------------------
  const [orders, setOrders] = useState([
    { id: 101, product: "Organic Tomato", quantity: 3, status: "Delivered" },
    { id: 102, product: "Organic Wheat", quantity: 10, status: "Pending" },
    { id: 103, product: "Organic Spinach", quantity: 2, status: "Shipped" },
  ]);

  const handleStatusChange = (index, val) => {
    const updated = [...orders];
    updated[index].status = val;
    setOrders(updated);
  };

  // ------------------------------------------
  // CROP TREND SIMULATION
  // ------------------------------------------
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

  const futureCropTrend = months.map((month) => {
    const trend = { month };
    products.forEach((p) => {
      const fluctuation = Math.floor(Math.random() * 20) - 5;
      trend[p.name] = p.quantity + fluctuation;
    });
    return trend;
  });

  const colors = ["#FF6347", "#DAA520", "#32CD32", "#8A2BE2", "#FF69B4", "#00CED1"];
  const getColor = (i) => colors[i % colors.length];

  // STOP UI FROM RENDERING WITHOUT USER
  if (!user) return null;

  return (
    <div className="min-h-screen bg-green-100 relative overflow-auto flex flex-col items-center p-8">

      {/* Decorative Leaves */}
      <img src={Rightleaf} alt="Leaf Top Right" className="absolute top-0 right-0 w-64 h-auto opacity-80 pointer-events-none rotate-[15deg]" />
      <img src={LeafImage} alt="Leaf Bottom Left" className="absolute bottom-0 left-0 w-64 h-auto opacity-80 pointer-events-none -rotate-6" />
      <img src={LeafImage} alt="Leaf Pattern" className="absolute top-10 left-10 w-32 h-32 opacity-20 pointer-events-none rotate-12" />
      <img src={Rightleaf} alt="Leaf Pattern" className="absolute bottom-20 right-20 w-48 h-48 opacity-15 pointer-events-none -rotate-45" />
      <img src={LeafImage} alt="Leaf Pattern" className="absolute top-1/2 right-1/3 w-40 h-40 opacity-10 pointer-events-none rotate-6" />

      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        Hello, {user?.name || "Farmer"}!
      </h1>

      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-xl shadow-md w-full max-w-4xl flex flex-col items-center">
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
              <li><strong>Age:</strong> {farmer.age}</li>
              <li><strong>Gender:</strong> {farmer.gender}</li>
              <li><strong>Aadhar ID:</strong> {farmer.aadhar}</li>
              <li><strong>Address:</strong> {farmer.address}</li>
            </ul>
          )}

          {/* MY PRODUCTS TAB */}
          {activeTab === "My Products" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-2 mb-4 items-center">

                <input
                  type="text"
                  placeholder="Product Name"
                  className="border p-2 rounded"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />

                <input
                  type="number"
                  placeholder="Quantity (kg)"
                  className="border p-2 rounded"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                />

                <input
                  type="number"
                  placeholder="Price per kg (₹)"
                  className="border p-2 rounded"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />

                <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700">
                  Upload Product Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      imageFile: e.target.files[0],
                      imagePreview: URL.createObjectURL(e.target.files[0])
                    })
                  }
                />

                </label>

               {newProduct.imagePreview && (
                 <img
                   src={newProduct.imagePreview}
                   alt="Preview"
                   className="mt-2 w-32 h-32 object-cover rounded shadow-md"
                 />
               )}

                <button
                  onClick={handleAddProduct}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                  Add
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product, index) => (
                  <div key={index} className="bg-green-100 rounded-md shadow flex flex-col items-center p-2 relative min-h-[350px]">
                    <img src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-3/4 object-cover rounded-md mb-2"
                    />

                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleUpdateProduct(index, "name", e.target.value)}
                      className="font-semibold text-green-700 text-center border-b mb-1"
                    />

                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleUpdateProduct(index, "quantity", e.target.value)}
                      className="mb-1 text-center border-b"
                    />

                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleUpdateProduct(index, "price", e.target.value)}
                      className="mb-2 text-center border-b"
                    />

                    <p>₹{product.price} per kg</p>

                    <button
                      onClick={() => handleDeleteProduct(index)}
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>

                    {deleteIndex === index && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-md">
                        <p className="mb-2 font-semibold text-red-600">Are you sure you want to delete this?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={confirmDelete}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Yes
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CROP TREND */}
          {activeTab === "Crop Trend" && (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={futureCropTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} kg`} />
                  <Legend verticalAlign="top" height={36} />

                  {products.map((product, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={product.name}
                      stroke={getColor(index)}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "Orders" && (
            <table className="min-w-full bg-green-50 rounded-md overflow-hidden">
              <thead className="bg-green-200 text-green-700">
                <tr>
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Quantity (kg)</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className="text-center border-b border-green-300">
                    <td className="py-2 px-4">{order.id}</td>
                    <td className="py-2 px-4">{order.product}</td>
                    <td className="py-2 px-4">{order.quantity} kg</td>
                    <td className="py-2 px-4">
                      <select
                        value={order.status}
                        className="border rounded px-2 py-1"
                        onChange={(e) => handleStatusChange(index, e.target.value)}
                      >
                        <option>Pending</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
