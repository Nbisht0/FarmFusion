// CustomerDashboard.js
import React, { useState , useEffect } from "react";


import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaTrash } from "react-icons/fa";

import LeafTopRight from "./assets/RL3-removebg-preview.png";
import LeafBottomLeft from "./assets/img.png";
import BgImage from "./assets/background.jpg";

// Product images
import TomatoImg from "./assets/organictomatoes.jpg";
import faceserumImg from "./assets/faceserum.jpg";
import OatsImg from "./assets/oats.jpg";
import RosemaryshampooImg from "./assets/rosemaryshampoo.jpg";
import gheeImg from "./assets/ghee.jpg";
import corianderpowderImg from "./assets/corianderpowder.jpg";
import haldiImg from "./assets/haldi.jpg";
import spiceImg from "./assets/spice.jpg";
import saltImg from "./assets/salt.jpg";
import onionshampooImg from "./assets/onionshampoo.jpg";
import jaggeryImg from "./assets/jaggery.jpg";
import peanutbImg from "./assets/peanutbutter.jpg";
import cashewsImg from "./assets/cashews.jpg";
import almondsImg from "./assets/almonds.jpg";
import mixedjamImg from "./assets/mixedfruitjam.jpg";
import strawberryjamImg from "./assets/strawberryjam.jpg";
import jasminesoapImg from "./assets/jasminesaop.jpg";
import rosesoapImg from "./assets/rosesoap.jpg";
import turmericsoapImg from "./assets/turmericsandalwoodsoap.jpg";
import brinjalImg from "./assets/brinjal.jpg";
import cauliflowerImg from "./assets/cauliflower.jpg";
import honeyImg from "./assets/honey.jpg";
import appleImg from "./assets/apple.jpg";
import mangoImg from "./assets/mango.jpg";
import carrotImg from "./assets/carrot.jpg";
import SpinachImg from "./assets/organicspinach.jpg";
import WheatImg from "./assets/organicwheat.jpg";
import RiceImg from "./assets/rice.jpg";
import PotatoImg from "./assets/potatoes.jpg";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]); // each item: { id, name, image, price, quantity }
  const [wishlist, setWishlist] = useState([]); // items: { id, name, image, price }
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const [backendProducts, setBackendProducts] = useState([]);
  const [loading, setLoading] = useState(true);



useEffect(() => {
  fetch("http://localhost:8080/api/products")
    .then((res) => res.json())
    .then((data) => {
      setBackendProducts(data);
      setLoading(false);  // stop loading when data is fetched
    })
    .catch((err) => {
      console.error("Failed to fetch products:", err);
      setLoading(false);  // stop loading even if fetch fails
    });
}, []);

  // Product data (id + numeric price)
  const products = [
         { id:1, name: "Fresh Tomatoes", image: TomatoImg, price: 50 },
         { id:2 ,  name: "Green Leafy Spinach", image: SpinachImg, price:40 },
         { id:3, name: "Nature's Harvest Whole Grain Rolled OATS", image: OatsImg, price:60 },
         {id:4,  name: "Herbal Essence Rosemary Shampoo", image: RosemaryshampooImg, price:80 },
         { id:5, name: "Farm Potatoes", image: PotatoImg, price:30 },

         { id:6,name: "Terra Botanicals Revitalizing face serum", image: faceserumImg , price: 120 },
         { id:7, name: "Organic Cow Ghee", image: gheeImg , price: 160 },
         { id:8, name: "Organic Harvet's Wheat", image: WheatImg, price: 40 },
         { id:9, name: "Terra Grain Basmati Rice", image: RiceImg, price: 50 },
         { id:10, name: "Coriander powder", image: corianderpowderImg, price: 35 },

         { id:11, name: "Mr.Gulati's farm haldi powder", image: haldiImg , price: 49 },
         {id:12, name: "Mr.Gulati's farm haldi powder ", image: saltImg , price: 28 },
         {id:13, name: "Botanicare Naturals Onion shampoo", image: onionshampooImg, price: 238 },
         {id:14, name: "Terra soul organic Jaggery ", image: jaggeryImg, price:129 },
         {id:15, name: "Nature's Harvest Peanut butter ", image: peanutbImg , price: 168 },

         { id:16, name: "Nature's Harvest Cashews", image: cashewsImg , price: 259 },
         { id:17, name: "Mr.Gulati's farm's Red chilli powder", image: spiceImg, price: 39 },
         { id:18, name: "Nature's Harvest Almonds ", image: almondsImg , price: 239 },
         { id:19, name: "Berry Bliss mixed fruit jam", image: mixedjamImg , price: 89 },
         { id:20, name: "Flaura & Fauna jasmine soap", image: jasminesoapImg , price: 69 },

         { id:21, name: "Berry Bliss strawberry fruit jam", image: strawberryjamImg , price: 89 },
         { id:22, name: "Flaura & Fauna Rose soap", image: rosesoapImg, price: 49 },
         { id:23, name: "Golden ROOTS turmeric and sandalwood soap", image: turmericsoapImg, price: 79 },
         { id:24, name: "Farm fresh Brinjals", image: brinjalImg , price: 50 },
         { id:25, name: "Farm fresh Cauliflower", image: cauliflowerImg, price: 20 },

         {id:26, name: "Honey Bliss Raw Honey ", image: honeyImg , price: 110 },
         {id:27, name: "Apples Farm Fresh ", image: appleImg , price: 70 },
         {id:28, name: "Farm Fresh Mangoes", image: mangoImg, price:  40 },
         {id:29, name: " Fresh and healthy Carrots ", image: carrotImg, price: 30 },
         {id:30, name: "Every vegetable favourite Potatoes", image: PotatoImg, price: 60 },
  ];

  // helper: add product to cart (increments quantity if exists)
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // toggle from product grid: if in cart remove, else add one
  const toggleCart = (productId) => {
    // Find product from backend first, fallback to static products
    const product = backendProducts.find(p => p.id === productId) || products.find(p => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const exists = prev.find((p) => p.id === productId);
      if (exists) {
        return prev.filter((p) => p.id !== productId);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };


  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  // wishlist toggles presence (no quantity)
  const toggleWishlist = (productId) => {
    const product = backendProducts.length > 0 ? backendProducts.find(p => p.id === productId) : products.find(p => p.id === productId);
    if (!product) return;
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === productId);
      if (exists) return prev.filter((p) => p.id !== productId);
      return [...prev, { id: product.id, name: product.name, image: product.image, price: product.price }];
    });
  };


  // copy from wishlist to cart (duplicate not move). increments quantity if already in cart.
  const copyFromWishlistToCart = (item) => {
    addToCart(item);

    // toast
    const toast = document.createElement("div");
    toast.innerText = `${item.name} added to cart!`;
    toast.className = "fixed bottom-10 right-10 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // Billing
  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const gst = subtotal * 0.07;
  const total = subtotal + gst;

  // helpers to check presence for button colors
  const inCart = (productId) => cart.some((p) => p.id === productId);
  const inWishlist = (productId) => wishlist.some((p) => p.id === productId);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${BgImage})` }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm"></div>

      {/* Leaves */}
      <img src={LeafTopRight} alt="Top Right Leaf" className="absolute top-0 right-0 w-44 h-auto opacity-90 pointer-events-none rotate-[15deg] z-10" />
      <img src={LeafBottomLeft} alt="Bottom Left Leaf" className="absolute bottom-0 left-0 w-44 h-auto opacity-90 pointer-events-none -rotate-6 z-10" />

      {/* Header */}
      <div className="relative z-20 flex justify-center mt-16">
        <div className="bg-white/20 backdrop-blur-lg px-14 py-10 rounded-3xl text-center shadow-2xl">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg tracking-wide">FROM FARM TO YOU</h1>
          <p className="text-lg text-white/80 mt-2 font-light">Fresh • Organic • Healthy</p>
        </div>
      </div>

     {/* Product Grid */}
     <div className="relative z-20 mt-16 px-10 pb-24">
       <div className="grid grid-cols-5 gap-8">
         {loading ? (
           <p className="text-white text-center col-span-5 text-xl font-semibold">
             Loading products...
           </p>
         ) : (backendProducts.length > 0 ? backendProducts : products).map((product) => (
           <div key={product.id} className="relative bg-white/95 rounded-2xl shadow-md p-5 flex flex-col items-center hover:scale-105 transition-transform duration-300 hover:shadow-2xl border border-green-100">
             {/* Cart Icon */}
             <button
               className="absolute top-2 left-2 transition-transform hover:scale-110"
               onClick={() => toggleCart(product.id)}
               style={{ color: inCart(product.id) ? "green" : "gray" }}
               aria-label={`toggle cart ${product.name}`}
             >
               <FaShoppingCart size={20} />
             </button>

             {/* Wishlist Icon */}
             <button
               className="absolute top-2 right-2 transition-transform hover:scale-110"
               onClick={() => toggleWishlist(product.id)}
               style={{ color: inWishlist(product.id) ? "red" : "gold" }}
               aria-label={`toggle wishlist ${product.name}`}
             >
               <FaHeart size={20} />
             </button>

             <img src={product.image} alt={product.name} className="w-36 h-36 object-cover rounded-xl mb-4 shadow-sm" />
             <h2 className="text-lg font-semibold text-green-900 text-center">{product.name}</h2>
             <p className="text-green-700 font-medium text-center mt-1">₹{product.price}</p>
           </div>
         ))}
       </div>
     </div>



      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-md shadow-xl transform transition-transform duration-300 z-50 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button className="absolute top-4 right-4 text-green-700 font-bold text-xl" onClick={() => setMenuOpen(false)}>✖</button>
        <div className="flex flex-col mt-20 space-y-8 px-6">
          <button className="text-green-700 font-semibold text-lg hover:underline flex items-center gap-2" onClick={() => { setShowProfile(true); setMenuOpen(false); }}>
            <FaUser /> Profile
          </button>
          <button className="text-green-700 font-semibold text-lg hover:underline flex items-center gap-2" onClick={() => { setShowCart(true); setMenuOpen(false); }}>
            <FaShoppingCart /> Cart ({cart.reduce((a, b) => a + (b.quantity || 1), 0)})
          </button>
          <button className="text-green-700 font-semibold text-lg hover:underline flex items-center gap-2" onClick={() => { setShowWishlist(true); setMenuOpen(false); }}>
            <FaHeart /> Wishlist ({wishlist.length})
          </button>
          <button
            className="text-red-500 font-semibold text-lg hover:underline flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </div>

      {/* Open Menu Button */}
      <button
        className="fixed top-8 left-8 bg-green-700 text-white px-5 py-3 rounded-full shadow-lg z-40 text-lg font-bold hover:bg-green-800 transition flex items-center gap-2"
        onClick={() => setMenuOpen(true)}
      >
        ☰ Menu
      </button>

      {/* Profile Overlay */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-2/3 max-w-2xl relative shadow-2xl">
            <button className="absolute top-5 right-5 text-red-500 text-2xl font-bold" onClick={() => setShowProfile(false)}>✖</button>
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">My Profile</h2>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-40 h-40 bg-green-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-green-300">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-green-500 text-xl font-semibold">Upload</span>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-green-700" />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <label className="block text-green-700 font-semibold mb-1">Name:</label>
                  <input type="text" defaultValue="John Doe" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                </div>
                <div>
                  <label className="block text-green-700 font-semibold mb-1">Email:</label>
                  <input type="email" defaultValue="johndoe@example.com" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                </div>
                <div>
                  <label className="block text-green-700 font-semibold mb-1">Phone:</label>
                  <input type="text" defaultValue="+91 12345 67890" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                </div>
                <div>
                  <label className="block text-green-700 font-semibold mb-1">Address:</label>
                  <input type="text" defaultValue="123 Green Street, FarmVille, India" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                </div>
                <button className="mt-4 bg-green-700 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-800 transition">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Overlay */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-3xl p-8 w-3/4 max-w-3xl relative shadow-2xl">
            <button className="absolute top-5 right-5 text-red-500 text-2xl font-bold" onClick={() => setShowCart(false)}>✖</button>
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">My Cart</h2>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl shadow">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-semibold text-green-900">{item.name} {item.quantity > 1 && <span className="text-sm text-gray-600">× {item.quantity}</span>}</h3>
                        <p className="text-green-700">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setCart((prev) => prev.map(p => p.id === item.id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))} className="px-3 py-1 bg-gray-200 rounded">−</button>
                      <button onClick={() => setCart((prev) => prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p))} className="px-3 py-1 bg-gray-200 rounded">+</button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
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

      {/* Wishlist Overlay */}
      {showWishlist && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-3xl p-8 w-3/4 max-w-3xl relative shadow-2xl">
            <button className="absolute top-5 right-5 text-red-500 text-2xl font-bold" onClick={() => setShowWishlist(false)}>✖</button>
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">My Wishlist</h2>

            {wishlist.length === 0 ? (
              <p className="text-center text-gray-500">Your wishlist is empty</p>
            ) : (
              <div className="flex flex-col gap-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-pink-50 rounded-xl shadow">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-semibold text-pink-900">{item.name}</h3>
                        <p className="text-pink-700">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyFromWishlistToCart(item)}
                        className="bg-green-700 text-white px-3 py-1 rounded-lg hover:bg-green-800 transition"
                      >
                        Add to Cart
                      </button>
                      <button onClick={() => toggleWishlist(item.id)} className="text-red-500 hover:text-red-700">
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

      {/* Checkout Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-2/3 max-w-lg relative shadow-2xl">
            <button className="absolute top-4 right-6 text-red-500 text-2xl font-bold" onClick={() => setShowCheckout(false)}>✖</button>
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">Checkout</h2>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-green-700 font-semibold mb-1">Contact Number:</label>
                <input type="text" placeholder="+91 98765 43210" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>
              <div>
                <label className="block text-green-700 font-semibold mb-1">Delivery Address:</label>
                <textarea placeholder="Enter your complete address..." className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-300" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-green-700 font-semibold mb-1">Payment Method:</label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-300" defaultValue="">
                  <option value="" disabled>-- Select Payment Method --</option>
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
                className="mt-4 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                onClick={() => {
                  alert("✅ Order placed successfully!");
                  setCart([]); // clear cart but keep checkout open if wanted — currently we keep closing per original
                  setShowCheckout(false);
                }}
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
