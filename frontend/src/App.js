import React, { useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import jarImage from "./assets/jar.png";
import honeyImg from "./assets/honey.png";
import milkImg from "./assets/milk.png";
import wheatFlourImg from "./assets/wheat-flour.png";
import mixedGreensImg from "./assets/mixed-greens.png";
import mustardOilImg from "./assets/mustard-oil.png";
import appleImg from "./assets/apple.png";
import CustomerLogin from "./CustomerLogin";
import CustomerRegister from "./CustomerRegister";
import CustomerDashboard from "./CustomerDashboard";
import FarmerLogin from "./FarmerLogin";
import FarmerRegister from "./FarmerRegister";
import Farmerdashboard from "./Farmerdashboard";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/farmer-login" element={<FarmerLogin />} />
          <Route path="/farmer-register" element={<FarmerRegister />} />
          <Route path="/farmer-dashboard" element={<Farmerdashboard />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

// Navbar responsive rules — !important needed because inline styles
// on the elements below otherwise always win over CSS, media queries included.
const navResponsiveStyles = `
  .ff-hamburger { display: none; }
  @media (max-width: 768px) {
    .ff-nav-links {
      display: none !important;
    }
    .ff-nav-links.ff-open {
      display: flex !important;
      flex-direction: column !important;
      position: absolute !important;
      top: 100% !important;
      right: 1.5rem !important;
      background: #1a3d2b !important;
      padding: 1rem !important;
      border-radius: 0 0 12px 12px !important;
      margin-right: 0 !important;
      width: 180px !important;
      box-shadow: 0 10px 24px rgba(0,0,0,0.25) !important;
      z-index: 20 !important;
    }
    .ff-hamburger { display: flex !important; }
  }
`;

function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Section refs for nav scrolling
  const whyChooseUsRef = useRef(null);
  const bestsellerRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = {
    "About Us": whyChooseUsRef,
    "Bestseller": bestsellerRef,
    "Contact": contactRef,
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f5f5f0" }}>

      {/* ── HERO SECTION — UNTOUCHED ─────────────────────────── */}
      <div style={{ background: "#3d9e60", position: "relative", overflow: "hidden", minHeight: "60vh", fontFamily: "Inter, sans-serif" }}>

        {/* Navbar */}
        <style>{navResponsiveStyles}</style>
        <nav style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.4rem 2.5rem" }}>
          <div style={{ color: "white", fontSize: "2.2rem", fontWeight: "700" }}>
            <span style={{ fontStyle: "italic", color: "#fde68a" }}>F</span>armFusion
          </div>
          <div className={`ff-nav-links${menuOpen ? " ff-open" : ""}`} style={{ display: "flex", gap: "0.6rem", marginRight: "4rem" }}>
            {["Home", "About Us", "Bestseller", "Contact"].map(item => (
              <button
                key={item}
                onClick={() => {
                  if (item === "Home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else if (navLinks[item]) {
                    scrollToSection(navLinks[item]);
                  }
                  setMenuOpen(false);
                }}
                style={{ background: "#facc15", color: "white", padding: "0.6rem 1.6rem", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", border: "none", cursor: "pointer" }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Hamburger — hidden on desktop via .ff-hamburger CSS rule above */}
          <button
            className="ff-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: "transparent", border: "none", cursor: "pointer", flexDirection: "column", gap: "5px", padding: "0.5rem", marginRight: "1rem" }}
          >
            <span style={{ width: "24px", height: "3px", background: "white", borderRadius: "2px", display: "block" }} />
            <span style={{ width: "24px", height: "3px", background: "white", borderRadius: "2px", display: "block" }} />
            <span style={{ width: "24px", height: "3px", background: "white", borderRadius: "2px", display: "block" }} />
          </button>
        </nav>

        {/* Glass layer */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: "0 4rem", background: "rgba(255,255,255,0.09)", backdropFilter: "blur(3px)", zIndex: 0, borderRadius: "1rem" }}></div>

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", padding: "1rem 2.5rem 5rem", gap: "0" }}>

            {/* Left 50% — text */}
            <div style={{ flex: "0 0 50%", paddingLeft: "3rem" }}>
              <h1 style={{ fontStyle: "italic", fontSize: "4rem", fontWeight: "700", color: "white", lineHeight: "1.2", marginBottom: "1.2rem" }}>
                Pure from nature,<br />crafted for you
              </h1>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1.25rem", lineHeight: "1.75", maxWidth: "420px" }}>
                Discover the pure essence of nature with our carefully curated
                collection of certified organic products. From farm-fresh to make
                your lifestyle healthy, we bring you the finest quality items that
                nourish your body and respect the earth.
              </p>
            </div>

            {/* Right 50% — image */}
            <div style={{ flex: "0 0 50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={jarImage}
                alt="organic product jar"
                style={{ width: "600px", maxHeight: "640px", objectFit: "contain", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.25))" }}
              />
            </div>

          </div>
        </div>

        {/* Snake Wave */}
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block", zIndex: 5 }} xmlns="http://www.w3.org/2000/svg">
          <path d="M0,120 C400,60 900,160 1440,100 L1440,200 L0,200 Z" fill="#f5f5f0" />
        </svg>
      </div>

      {/* ── 1. WELCOME TO FARMFUSION — Role Selector ─────────── */}
      <div style={{ background: "#f5f5f0", padding: "4rem 2rem 3rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#1a3d2b", marginBottom: "0.5rem", textAlign: "center" }}>Welcome to FarmFusion</h2>
        <p style={{ color: "#5a7a68", fontSize: "1rem", marginBottom: "2.5rem", textAlign: "center" }}>Who are you shopping or selling as today?</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", maxWidth: "900px", width: "100%" }}>

          {/* Customer Card */}
          <div style={{ background: "white", borderRadius: "16px", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", border: "1.5px solid #e2ede8", borderTop: "4px solid #3d9e60" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>🛒</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#1a3d2b", marginBottom: "0.4rem" }}>Customer</h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7f73", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Browse fresh organic produce and artisan goods, straight from local farms to your doorstep.
            </p>
            <div style={{ display: "flex", gap: "0.6rem", width: "100%" }}>
              <button onClick={() => navigate("/customer-login")} style={{ flex: 1, background: "#3d9e60", color: "white", padding: "0.6rem 0", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", border: "none", cursor: "pointer" }}>
                Login
              </button>
              <button onClick={() => navigate("/customer-register")} style={{ flex: 1, background: "white", color: "#3d9e60", padding: "0.6rem 0", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", border: "1.5px solid #3d9e60", cursor: "pointer" }}>
                Register
              </button>
            </div>
          </div>

          {/* Farmer Card */}
          <div style={{ background: "white", borderRadius: "16px", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", border: "1.5px solid #e2ede8", borderTop: "4px solid #ca8a04" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>👨‍🌾</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#1a3d2b", marginBottom: "0.4rem" }}>Farmer</h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7f73", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              List your harvest, manage your store, and connect directly with customers who value quality.
            </p>
            <div style={{ display: "flex", gap: "0.6rem", width: "100%" }}>
              <button onClick={() => navigate("/farmer-login")} style={{ flex: 1, background: "#ca8a04", color: "white", padding: "0.6rem 0", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", border: "none", cursor: "pointer" }}>
                Login
              </button>
              <button onClick={() => navigate("/farmer-register")} style={{ flex: 1, background: "white", color: "#ca8a04", padding: "0.6rem 0", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", border: "1.5px solid #ca8a04", cursor: "pointer" }}>
                Register
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. WHY CHOOSE US ──────────────────────────────────── */}
      <div ref={whyChooseUsRef} style={{ background: "#1a3d2b", padding: "6rem 3rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.4rem", fontWeight: "700", color: "white", marginBottom: "0.6rem" }}>Why Choose Us?</h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", marginBottom: "3.5rem" }}>
            Built for farmers and food lovers who believe in honest, sustainable commerce.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
            {[
              { icon: "🌿", title: "Certified Organic", desc: "Every product is verified organic, sourced directly from registered farms — no middlemen, no compromises. We work with certified farmers who follow strict organic standards so you always get the real thing." },
              { icon: "🚚", title: "Farm-to-Door Delivery", desc: "We cut the supply chain short. Your order goes from the field to your front door with full traceability — you know exactly which farm your food comes from, and when it was harvested." },
              { icon: "🤝", title: "Fair to Farmers", desc: "Farmers set their own prices and keep more of what they earn — supporting livelihoods, not just sales. We believe the people who grow your food deserve to be compensated fairly." },
              { icon: "🔒", title: "Secure & Simple", desc: "Role-based access for farmers and customers, with a clean dashboard to track orders and inventory. Your data is safe and your experience is designed to be effortless from login to delivery." },
            ].map(({ icon, title, desc }, i) => (
              <div key={title} style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: i % 2 === 0 ? "0 80px 0 0" : "80px 0 0 0",
                padding: "2.5rem 3rem",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex",
                gap: "2rem",
                alignItems: "center",
                width: "85%",
                marginLeft: i % 2 === 0 ? "0" : "15%",
                marginRight: i % 2 === 0 ? "15%" : "0",
              }}>
                <div style={{ fontSize: "2.8rem", flexShrink: 0, width: "60px", textAlign: "center" }}>{icon}</div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "white", marginBottom: "0.6rem" }}>{title}</h3>
                  <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.65)", lineHeight: "1.75", margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. BESTSELLER ─────────────────────────────────────── */}

      <div ref={bestsellerRef} style={{ background: "#f5f5f0", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "700", color: "#1a3d2b", marginBottom: "0.5rem" }}>Bestsellers</h2>
          <p style={{ textAlign: "center", color: "#5a7a68", fontSize: "1rem", marginBottom: "2.5rem" }}>
            Top picks loved by our customers — fresh, certified, and delivered fast.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", columnGap: "2.5rem", rowGap: "4rem" }}>
            {[
              { image: honeyImg, name: "Wild Forest Honey", farmer: "Ramesh Farms, Uttarakhand", price: "₹320", badge: "⭐ Bestseller" },
              { image: milkImg, name: "A2 Desi Cow Milk", farmer: "Gir Organics, Gujarat", price: "₹85 / L", badge: "🔥 Top Rated" },
              { image: wheatFlourImg, name: "Organic Wheat Flour", farmer: "Sundar Agro, Punjab", price: "₹140 / kg", badge: "✅ Certified" },
              { image: mixedGreensImg, name: "Mixed Greens Box", farmer: "Green Valley, HP", price: "₹199", badge: "🌿 Fresh" },
              { image: mustardOilImg, name: "Cold Press Mustard Oil", farmer: "Kisan Pure, Rajasthan", price: "₹260 / L", badge: "⭐ Bestseller" },
              { image: appleImg, name: "Himalayan Red Apple", farmer: "Orchards of Kinnaur", price: "₹180 / kg", badge: "🔥 Top Rated" },
            ].map(({ image, name, farmer, price, badge }) => (
              <div key={name} style={{ background: "white", borderRadius: "14px", border: "1px solid #e5ede9", overflow: "hidden" }}>
                <div style={{ background: "#edf6f0", height: "140px", overflow: "hidden" }}>
                  <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "1rem 1rem 1.2rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1a3d2b", marginBottom: "0.2rem" }}>{name}</h3>
                  <p style={{ fontSize: "0.78rem", color: "#7a9486", marginBottom: "0.6rem" }}>by {farmer}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#3d9e60" }}>{price}</span>
                    <span style={{ fontSize: "0.7rem", background: "#fef9c3", color: "#854d0e", padding: "2px 8px", borderRadius: "20px", fontWeight: "600" }}>{badge}</span>
                  </div>
                  <button style={{ width: "100%", background: "#3d9e60", color: "white", border: "none", borderRadius: "8px", padding: "0.55rem 0", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. CUSTOMER REVIEWS ──────────────────────────────── */}
      <div style={{ background: "white", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "700", color: "#1a3d2b", marginBottom: "0.5rem" }}>What Our Customers Say</h2>
          <p style={{ textAlign: "center", color: "#5a7a68", fontSize: "1rem", marginBottom: "2.5rem" }}>
            Real experiences from people who shop and grow with FarmFusion.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { name: "Ananya Sharma", location: "Dehradun, Uttarakhand", rating: 5, review: "The honey and mustard oil tasted just like what I remember from my grandmother's village. Quality is unmatched!" },
              { name: "Rohit Verma", location: "Delhi", rating: 5, review: "Delivery was super quick and the produce was incredibly fresh. Love that I can support local farmers directly." },
              { name: "Priya Nair", location: "Bengaluru", rating: 4, review: "Great variety of organic products. The site makes it so easy to browse and reorder my favorites." },
              { name: "Karan Mehta", location: "Mumbai", rating: 5, review: "As someone who cares about where my food comes from, FarmFusion gives me complete peace of mind." },
            ].map(({ name, location, rating, review }) => (
              <div key={name} style={{ background: "#f5f5f0", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e5ede9", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div style={{ color: "#facc15", fontSize: "1.1rem", letterSpacing: "2px" }}>
                  {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                </div>
                <p style={{ fontSize: "0.88rem", color: "#445d52", lineHeight: "1.6", flex: 1, margin: 0 }}>
                  "{review}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginTop: "0.5rem" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#3d9e60", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "0.9rem", flexShrink: 0 }}>
                    {name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1a3d2b", margin: 0 }}>{name}</p>
                    <span style={{ fontSize: "0.75rem", color: "#7a9486" }}>{location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. CONTACT ────────────────────────────────────────── */}
      <div ref={contactRef} style={{ background: "white", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "700", color: "#1a3d2b", marginBottom: "0.5rem" }}>Contact Us</h2>
          <p style={{ textAlign: "center", color: "#5a7a68", fontSize: "1rem", marginBottom: "2.5rem" }}>
            Have a question or want to partner with us? We'd love to hear from you.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>

            {/* Left — contact info */}
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#1a3d2b", marginBottom: "1.2rem" }}>Get in touch</h3>
              {[
                { icon: "📍", label: "Our Office", value: "12, Organic Nagar, Dehradun, Uttarakhand 248001" },
                { icon: "📞", label: "Call Us", value: "+91 98765 43210" },
                { icon: "✉️", label: "Email", value: "support@farmfusion.in" },
                { icon: "🕐", label: "Working Hours", value: "Mon–Sat, 9 AM – 6 PM" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem", marginBottom: "1.1rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#edf6f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", flexShrink: 0, marginTop: "2px" }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1a3d2b", margin: 0 }}>{label}</p>
                    <span style={{ fontSize: "0.82rem", color: "#7a9486" }}>{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {["Your name", "Email address", "Subject"].map(ph => (
                <input key={ph} type="text" placeholder={ph} style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: "1px solid #d4e8dc", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", color: "#1a3d2b", background: "#f9fbfa", outline: "none", boxSizing: "border-box" }} />
              ))}
              <textarea placeholder="Your message..." style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: "1px solid #d4e8dc", fontSize: "0.88rem", fontFamily: "Inter, sans-serif", color: "#1a3d2b", background: "#f9fbfa", outline: "none", height: "100px", resize: "vertical", boxSizing: "border-box" }} />
              <button style={{ background: "#3d9e60", color: "white", border: "none", borderRadius: "8px", padding: "0.7rem 0", fontWeight: "700", fontSize: "0.95rem", cursor: "pointer" }}>
                Send Message
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── FOOTER STRIP ──────────────────────────────────────── */}
      <div style={{ background: "#1a3d2b", padding: "1.2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "white", fontSize: "1.1rem", fontWeight: "700" }}>
          <span style={{ fontStyle: "italic", color: "#fde68a" }}>F</span>armFusion
        </div>
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", margin: 0 }}>© 2025 FarmFusion. All rights reserved.</p>
      </div>

    </div>
  );
}

export default App;