// javascript
import React, { useState , useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Reviews from "./Reviews";

import FarmerLogin from "./FarmerLogin";
import FarmerRegister from "./FarmerRegister";
import FarmerDashboard from "./Farmerdashboard";

import CustomerLogin from "./CustomerLogin";
import CustomerRegister from "./CustomerRegister";
import CustomerDashboard from "./CustomerDashboard";

import "./App.css";
import LeafImage from "./assets/img.png";
import product from "./assets/product1-removebg-preview.png";
import Rightleaf from "./assets/RL3-removebg-preview.png";
import AloeVera from "./assets/aloevera.png";
import HolyBasil from "./assets/basil.png";
import Spinach from "./assets/organicspinach.jpg";

function Home() {
  const [farmerExpanded, setFarmerExpanded] = useState(false);
  const [consumerExpanded, setConsumerExpanded] = useState(false);

  const navigate = useNavigate();

  const farmerCartoonURL =
    "https://img.freepik.com/premium-vector/indian-farmer-orange-clothes-works-hoe-vector-illustration-white-background_223337-15464.jpg?w=996";
  const consumerCartoonURL =
    "https://tse3.mm.bing.net/th/id/OIP.EmKIQRb7GYLvQZbY8CBG9AHaGx?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden scroll-smooth">
      {/* main content grows and allows footer to stay at page bottom without overlapping */}
      <main className="flex-1">
        {/* Hero Section */}
        <div id="home" className="relative min-h-screen bg-green-700 overflow-hidden flex flex-col snap-start">
          <div className="absolute inset-0 bg-green-900 bg-opacity-40 backdrop-blur-sm z-10 flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto w-full">
            {/* Navbar */}
            <div className="flex justify-between items-center px-10 py-5">
              <div
                className="flex items-center relative text-white font-bold text-2xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span className="relative">
                  F
                  <svg
                    className="absolute -top-1 left-3 w-4 h-4 text-green-300 rotate-12"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C12 2 7 7 12 12 17 17 22 12 22 12S17 7 12 2z" />
                  </svg>
                </span>
                <span className="ml-1 italic">armFusion</span>
              </div>

              <nav className="flex space-x-4">
                {[
                  { name: "Home", id: "home" },
                  { name: "About Us", id: "about us" },
                  { name: "Bestseller", id: "bestseller" },
                  { name: "Contact", id: "contact" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const section = document.getElementById(item.id);
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-yellow-600 hover:scale-105 transition transform"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Leaf */}
            <img
              src={Rightleaf}
              alt="Areca Palm Leaf Right"
              className="absolute top-16 right-[-60px] md:right-[-120px] max-w-[220px] md:max-w-[380px] h-auto opacity-90 brightness-125 contrast-125 drop-shadow-2xl pointer-events-none z-0 rotate-[15deg]"
            />

            {/* Hero Content */}
            <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-12 flex-1 -mt-20 md:-mt-32">
              <div className="md:w-1/2 text-center md:text-left pr-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 italic">
                  Pure from nature, crafted for you
                </h1>
                <p className="text-base md:text-lg text-white max-w-xl">
                  Discover the pure essence of nature with our carefully curated
                  collection of certified organic products. From farm-fresh to make
                  your lifestyle healthy, we bring you the finest quality items that
                  nourish your body and respect the earth.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-start -ml-8">
                <img
                  src={product}
                  alt="Product"
                  className="w-72 md:w-96 h-auto -mt-8 md:-mt-0 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Bottom-Left Leaf */}
          <img
            src={LeafImage}
            alt="Areca Palm Leaf"
            className="absolute bottom-0 left-0 w-44 md:w-80 h-auto -mb-12 -ml-4 z-20 pointer-events-none"
          />

          {/* Wavy Divider */}
          <div className="absolute bottom-0 w-full overflow-visible z-0">
            <svg
              className="relative block w-full h-[200px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 200"
              preserveAspectRatio="none"
            >
              <path
                d="M0,100 C300,20 900,180 1200,60 L1200,200 L0,200 Z"
                fill="#ffffff"
              ></path>
            </svg>
          </div>
        </div>

        {/* White Section */}
        <div id="our promise" className="bg-white min-h-screen flex flex-col items-center justify-center px-4 md:px-12 space-y-12 snap-start">
          <div className="flex flex-col items-center space-y-1">
            <h2 className="text-3xl font-bold text-green-700">Our Promise</h2>
            <p className="text-center text-gray-600 max-w-2xl">
              We are dedicated to bringing you products that are natural, organic, and
              sustainably sourced.
            </p>
          </div>

          {/* Farmer & Consumer Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-20 mt-8 w-full max-w-6xl">
            {/* Farmer Card */}
            <div className="bg-white bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 shadow-lg md:w-1/2 flex flex-col relative">
              <img
                src={farmerCartoonURL}
                alt="Farmer"
                className="absolute -top-10 right-6 w-12 h-12 md:w-14 md:h-14 rotate-[-10deg]"
              />
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Farmer's Role
              </h3>
              <p
                className={`text-gray-700 transition-all duration-300 ${
                  farmerExpanded ? "line-clamp-none" : "line-clamp-3"
                }`}
              >
                Our farmers play a vital role in cultivating fresh pure and organic
                crops with years of dedication and traditional farming methods
                combined with sustainable practices. They ensure every harvest is
                filled with nutrients, authenticity, and respect for nature. This
                effort brings you food that is not only healthier but also grown with
                love for Earth.
              </p>
              <button
                onClick={() => setFarmerExpanded(!farmerExpanded)}
                className="mt-4 text-green-700 font-semibold hover:underline relative z-20"
              >
                {farmerExpanded ? "Show Less ↑" : "Read More →"}
              </button>
            </div>

            {/* Consumer Card */}
            <div className="bg-white bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 shadow-lg md:w-1/2 flex flex-col relative">
              <img
                src={consumerCartoonURL}
                alt="Consumer"
                className="absolute -top-10 left-6 w-12 h-16 md:w-14 md:h-14 rotate-[10deg]"
              />
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Consumer's Role
              </h3>
              <p
                className={`text-gray-700 transition-all duration-300 ${
                  consumerExpanded ? "line-clamp-none" : "line-clamp-3"
                }`}
              >
                Our consumers are the heart of this journey. By choosing organic
                products, they support sustainable farming and promote a healthy
                lifestyle. Their happiness and trust in our products motivate us to
                continue building a bridge between farms and families, delivering
                pure, authentic, and organic products every day.
              </p>
              <button
                onClick={() => setConsumerExpanded(!consumerExpanded)}
                className="mt-4 text-green-700 font-semibold hover:underline relative z-20"
              >
                {consumerExpanded ? "Show Less ↑" : "Read More →"}
              </button>
            </div>
          </div>

          {/* Login Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12 w-full max-w-6xl z-10 relative">
            <button
              onClick={() => navigate("/farmer-login")}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-600 hover:scale-105 transition transform"
            >
              Login as Farmer
            </button>
            <button
              onClick={() => navigate("/customer-login")}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-600 hover:scale-105 transition transform"
            >
              Login as Consumer
            </button>
          </div>
        </div>


        {/* About Us Section */}
<div id="about us" className="bg-white min-h-screen flex flex-col items-center justify-center px-4 md:px-12 relative z-10 snap-start">
  <div className="flex flex-col items-center space-y-2 -mt-6">
    <h2 className="text-3xl font-bold text-green-700">About Us</h2>
    <p className="text-center text-gray-600 max-w-2xl">
      We bridge the gap between farmers and consumers by delivering pure, organic, and sustainably sourced products straight from farms to your home.
    </p>
  </div>

  <div className="flex flex-col w-full max-w-6xl space-y-20 mt-12">
    {/* first - left */}
    <div className="flex justify-start">
      <div className="bg-green-700 text-white p-6 shadow-lg w-full md:w-2/3 flex flex-col items-center rounded-l-2xl rounded-r-full relative">
        <img
          src="https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsb2ZmaWNlMTJfcGhvdG9fb2ZfYW5faW5kaWFuX2Zhcm1lcl9kb2luZ19hZ3JpY3VsdHVyZV9zbV84M2Y5ODI4MC05MGFlLTRmZTEtOWQ3NS0xMjM4MWI5MTMxZjZfMS5qcGc.jpg"
          alt="Farmer"
          className="w-24 h-24 rounded-full border-4 border-white -mt-12 mb-3 object-cover"
        />
        <h3 className="text-xl font-semibold mb-2">Farm Fresh</h3>
        <p className="text-center">
          Every product is carefully harvested and delivered fresh from the farm.
          Our farmers carefully harvest every crop with dedication and care.
          Each product is grown naturally, without harmful chemicals.
          Every harvest begins with dedication and care from our local farmers. We believe that freshness is the essence of good health, which is why our products are picked at their natural peak and delivered directly from the fields to your table. No middlemen, no preservatives—just pure, nutrient-rich goodness straight from the farm.
        </p>
      </div>
    </div>

    {/* second - right */}
    <div className="flex justify-end">
      <div className="bg-green-700 text-white p-6 shadow-lg w-full md:w-2/3 flex flex-col items-center rounded-r-2xl rounded-l-full relative">
        <img
          src="https://tse2.mm.bing.net/th/id/OIP.JnYwWLVzp6t0DwMm9G8NZQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
          alt="Customer"
          className="w-24 h-24 rounded-full border-4 border-white -mt-12 mb-3 object-cover"
        />
        <h3 className="text-xl font-semibold mb-2">Organic & Safe</h3>
        <p className="text-center">
          Your family’s health is our top priority. Each product is grown using sustainable organic methods, free from harmful pesticides or synthetic chemicals. We work with certified organic farms to ensure complete safety, purity, and transparency—so you can trust that every product you receive is truly good for you and the planet.
        </p>
      </div>
    </div>

    {/* third - now left (zig-zag) */}
    <div className="flex justify-start">
      <div className="bg-green-700 text-white p-6 shadow-lg w-full md:w-2/3 flex flex-col items-center rounded-l-2xl rounded-r-full relative">
        <img
          src="https://www.sciencefriday.com/wp-content/uploads/2022/04/earth-day-illustration.png"
          alt="Earth Icon"
          className="w-24 h-24 rounded-full border-4 border-white -mt-12 mb-3 object-cover"
        />
        <h3 className="text-xl font-semibold mb-2">Sustainable</h3>
        <p className="text-center">
          Supporting farmers and sustainable practices for a healthier planet.
          Sustainability is at the heart of everything we do. From eco-friendly farming to minimal packaging, we are committed to protecting nature while feeding communities. By supporting local farmers and reducing waste, we create a cycle of growth that nurtures both people and the planet—today and for generations to come.
        </p>
      </div>
    </div>
  </div>
</div>

        {/* Bestseller Section */}
        <div id="bestseller" className="bg-white pt-40 pb-24 flex flex-col items-center px-4 md:px-12 relative z-10 snap-start">
          <div className="text-center mb-12 -mt-12">
            <h2 className="text-4xl font-bold text-green-700 mb-4">Bestsellers</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our most popular products loved by our customers. Fresh, organic, and delivered with care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mb-16">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.8)]">
              <img src={AloeVera} alt="Aloe Vera" className="w-4/5 mx-auto h-44 md:h-48 object-cover mt-4" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-green-900">Aloe Vera</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.8)]">
              <img src={HolyBasil} alt="Holy Basil" className="w-4/5 mx-auto h-44 md:h-48 object-cover mt-4" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-green-900">Holy Basil</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.8)]">
              <img src={Spinach} alt="Spinach" className="w-4/5 mx-auto h-44 md:h-48 object-cover mt-4" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-green-900">Spinach</h3>
              </div>
            </div>
          </div>

          <Reviews />
        </div>
      </main>

      {/* Footer (normal flow) */}
      <footer id="contact" className="bg-green-700 text-white flex flex-col justify-center items-center w-full overflow-visible z-20">
        {/* White Wave Divider inside footer */}
        <svg className="w-full h-[180px] -mt-[160px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d="M0,100 C300,180 900,20 1200,140 L1200,0 L0,0 Z" fill="#ffffff"></path>
        </svg>

        <div className="w-full px-6 md:px-24 py-12 flex flex-col md:flex-row justify-between items-start gap-12 max-w-none">
          <div>
            <h2 className="text-2xl font-bold mb-3">FarmFusion : Farm to families</h2>
            <p className="text-gray-200 max-w-sm">
              Connecting farms to families with fresh, organic, and sustainably sourced products.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-200">
              <li>📞 +91 98765 43210</li>
              <li>📧 support@farmfusion.com</li>
              <li>🏠 123 Green Lane, Organic City, India</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-yellow-400 transition">🌐</a>
              <a href="#" className="hover:text-yellow-400 transition">📘</a>
              <a href="#" className="hover:text-yellow-400 transition">🐦</a>
            </div>
          </div>
        </div>

        <div className="bg-green-900 text-center text-gray-300 py-3 w-full">
          © 2025 FarmFusion. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/farmer-login" element={<FarmerLogin />} />
      <Route path="/farmer-register" element={<FarmerRegister />} />
      <Route path="/farmer-dashboard" element={<FarmerDashboard />} />

      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/customer-register" element={<CustomerRegister />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
    </Routes>
  );
}

export default App;
