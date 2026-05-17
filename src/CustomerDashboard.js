import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaTrash } from "react-icons/fa";
import axios from "axios";

import LeafTopRight from "./assets/RL3-removebg-preview.png";
import LeafBottomLeft from "./assets/img.png";

const BASE_URL = "http://localhost:8080";

function CustomerDashboard() {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("farmfusion_user"));
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({
    phone: user?.phone || "",
    addressId: "",
    paymentMethod: "cod",
  });
  const [addresses, setAddresses] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    state: user?.state || "",
  });

  // Load products from backend
  useEffect(() => {
    axios.get(`${BASE_URL}/products`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  // Load cart from backend
  useEffect(() => {
    if (user) {
      axios.get(`${BASE_URL}/api/cart/${user.id}`)
        .then(res => setCart(res.data))
        .catch(err => console.error("Failed to load cart:", err));
    }
  }, [user]);

  // Load wishlist from backend
  useEffect(() => {
    if (user) {
      axios.get(`${BASE_URL}/api/wishlist/${user.id}`)
        .then(res => setWishlist(res.data))
        .catch(err => console.error("Failed to load wishlist:", err));
    }
  }, [user]);

  // Load addresses from backend
  useEffect(() => {
    if (user) {
      axios.get(`${BASE_URL}/api/addresses/user/${user.id}`)
        .then(res => setAddresses(res.data))
        .catch(err => console.error("Failed to load addresses:", err));
    }
  }, [user]);

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const gst = subtotal * 0.07;
  const total = subtotal + gst;

  // Add to cart
  const addToCart = async (product) => {
    try {
      await axios.post(`${BASE_URL}/api/cart/add`, {
        userId: user.id,
        productId: product.id,
        quantity: 1,
      });

      const res = await axios.get(`${BASE_URL}/api/cart/${user.id}`);
      setCart(res.data);
    } catch (err) {
      alert("Failed to add to cart: " + err.message);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/remove`, {
        params: { userId: user.id, productId: productId },
      });

      const res = await axios.get(`${BASE_URL}/api/cart/${user.id}`);
      setCart(res.data);
    } catch (err) {
      alert("Failed to remove from cart: " + err.message);
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await axios.put(`${BASE_URL}/api/cart/${cartItemId}`, null, {
        params: { quantity: quantity },
      });

      const res = await axios.get(`${BASE_URL}/api/cart/${user.id}`);
      setCart(res.data);
    } catch (err) {
      alert("Failed to update quantity: " + err.message);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (product) => {
    try {
      const exists = wishlist.some(w => w.productId === product.id);

      if (exists) {
        await axios.delete(`${BASE_URL}/api/wishlist/remove`, {
          params: { userId: user.id, productId: product.id },
        });
      } else {
        await axios.post(`${BASE_URL}/api/wishlist/add`, {
          userId: user.id,
          productId: product.id,
        });
      }

      const res = await axios.get(`${BASE_URL}/api/wishlist/${user.id}`);
      setWishlist(res.data);
    } catch (err) {
      alert("Failed to update wishlist: " + err.message);
    }
  };

  // Copy from wishlist to cart
  const copyFromWishlistToCart = async (item) => {
    await addToCart({ id: item.productId, price: item.price, name: item.name });
  };

  // Place order
  const placeOrder = async () => {
    if (!checkoutData.addressId) {
      alert("Please select a delivery address!");
      return;
    }

    setCheckoutLoading(true);

    try {
      const orderData = {
        customerId: user.id,
        addressId: parseInt(checkoutData.addressId),
        paymentMethod: checkoutData.paymentMethod,
        items: cart.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await axios.post(`${BASE_URL}/api/orders`, orderData);

      alert("✅ Order placed successfully!");

      // Clear cart
      await axios.delete(`${BASE_URL}/api/cart/clear/${user.id}`);
      setCart([]);
      setShowCheckout(false);

    } catch (err) {
      alert("Failed to place order: " + err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Update profile
  const updateProfile = async () => {
    try {
      await axios.put(`${BASE_URL}/api/users/update/${user.id}`, profileData);
      alert("✅ Profile updated successfully!");
      localStorage.setItem("farmfusion_user", JSON.stringify(profileData));
      setShowProfile(false);
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/30 backdrop-blur-lg shadow-md p-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-green-700">FarmFusion</h1>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            <FaShoppingCart /> Cart
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowWishlist(true)}
            className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            <FaHeart /> Wishlist
          </button>

          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaUser /> Profile
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("farmfusion_user");
              navigate("/customer-login");
            }}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Products Grid */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-green-700 mb-6">All Products</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-green-900 text-sm">{product.name}</h3>
                  <p className="text-gray-600 text-xs mb-2">{product.description}</p>
                  <p className="text-lg font-bold text-green-700 mb-3">₹{product.price}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`flex-1 py-2 rounded text-sm ${
                        wishlist.some(w => w.productId === product.id)
                          ? "bg-pink-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
            <button className="absolute top-5 right-5 text-red-500 text-2xl font-bold" onClick={() => setShowProfile(false)}>✖</button>
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">My Profile</h2>

            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Name" className="border p-2 rounded"
                value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />

              <input type="email" placeholder="Email" className="border p-2 rounded"
                value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />

              <input type="text" placeholder="Phone" className="border p-2 rounded"
                value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />

              <input type="text" placeholder="City" className="border p-2 rounded"
                value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} />

              <input type="text" placeholder="State" className="border p-2 rounded"
                value={profileData.state} onChange={(e) => setProfileData({ ...profileData, state: e.target.value })} />

              <button onClick={updateProfile} className="bg-green-700 text-white py-2 rounded hover:bg-green-800 transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-3xl p-8 w-3/4 max-w-3xl relative shadow-2xl my-8">
            <button className="absolute top-5 right-5 text-red-500 text-2xl font-bold" onClick={() => setShowCart(false)}>✖</button>
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">My Cart</h2>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl shadow">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl || item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-semibold text-green-900">{item.name}</h3>
                        <p className="text-green-700">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))} className="px-3 py-1 bg-gray-200 rounded">−</button>
                      <span className="px-2">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                      <button onClick={() => removeFromCart(item.productId || item.id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mt-4 border-t pt-4">
                  <p className="text-lg font-semibold">Subtotal: ₹{subtotal.toFixed(2)}</p>
                  <p className="text-lg font-semibold">GST (7%): ₹{gst.toFixed(2)}</p>
                  <p className="text-xl font-bold text-green-700">Total: ₹{total.toFixed(2)}</p>
                  <button
                    className="mt-4 bg-green-700 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-800 transition w-full"
                    onClick={() => { setShowCart(false); setShowCheckout(true); }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {showWishlist && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-3xl p-8 w-3/4 max-w-3xl relative shadow-2xl my-8">
            <button className="absolute top-5 right-5 text-red-500 text-2xl font-bold" onClick={() => setShowWishlist(false)}>✖</button>
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">My Wishlist</h2>

            {wishlist.length === 0 ? (
              <p className="text-center text-gray-500">Your wishlist is empty</p>
            ) : (
              <div className="flex flex-col gap-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-pink-50 rounded-xl shadow">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-semibold text-pink-900">{item.name}</h3>
                        <p className="text-pink-700">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => copyFromWishlistToCart(item)} className="bg-green-700 text-white px-3 py-1 rounded-lg hover:bg-green-800 transition">
                        Add to Cart
                      </button>
                      <button onClick={() => toggleWishlist(item)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-2/3 max-w-lg relative shadow-2xl">
            <button className="absolute top-4 right-6 text-red-500 text-2xl font-bold" onClick={() => setShowCheckout(false)}>✖</button>
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">Checkout</h2>

            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-green-700 font-semibold mb-1">Select Delivery Address:</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={checkoutData.addressId}
                  onChange={(e) => setCheckoutData({ ...checkoutData, addressId: e.target.value })}
                >
                  <option value="">-- Select Address --</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-green-700 font-semibold mb-1">Payment Method:</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={checkoutData.paymentMethod}
                  onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                >
                  <option value="cod">Cash on Delivery (COD)</option>
                  <option value="upi">UPI</option>
                  <option value="card">Debit / Credit Card</option>
                </select>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="text-lg font-semibold">Subtotal: ₹{subtotal.toFixed(2)}</p>
                <p className="text-lg font-semibold">GST (7%): ₹{gst.toFixed(2)}</p>
                <p className="text-xl font-bold text-green-700">Total: ₹{total.toFixed(2)}</p>
              </div>

              <button
                type="button"
                disabled={checkoutLoading}
                className="mt-4 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                onClick={placeOrder}
              >
                {checkoutLoading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;