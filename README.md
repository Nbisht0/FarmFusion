<div align="center">

# 🌾 FarmFusion

### Connecting Farmers Directly to Customers — A Full-Stack Agricultural E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-3d9e60?style=for-the-badge)](https://farm-fusion-khaki.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://farmfusion-production.up.railway.app)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://farm-fusion-khaki.vercel.app)

</div>

---

## 📖 About the Project

**FarmFusion** is a full-stack e-commerce platform built to eliminate middlemen in agricultural trade, letting farmers list and sell their produce directly to customers. The platform supports **three distinct user roles** (Customer, Farmer, Admin), each with tailored dashboards and permissions, backed by secure JWT authentication and role-based access control (RBAC).

This isn't a tutorial clone, every feature below (search, wishlist, cart, admin RBAC, image handling, deployment) was built and debugged from scratch, including real production issues like CORS configuration, environment-variable secret management, and cross-platform case-sensitivity bugs.

🔗 **[Live Demo →](https://farm-fusion-khaki.vercel.app)**

---

## ✨ Features

### 👤 Customer
- Browse products with **dynamic search & filter** (name, category, price range) using JPA Specifications
- Sort products (price, newest, etc.) with paginated **"Load More"** browsing
- Add products to **Wishlist** and **Cart**
- Secure signup/login with JWT-based authentication
- Place orders and view order history

### 🌱 Farmer
- Register and manage a personal product catalog
- Upload product images (stored via **Cloudinary**, not bloating the database)
- View and manage orders for their listed products

### 🛡️ Admin
- Dedicated **Admin Dashboard** (protected via Spring Security RBAC — not just hidden in the UI)
- Manage farmer accounts (activate/block)
- Monitor products across the platform
- View orders & revenue overview

### ⚙️ Platform-wide
- **JWT authentication** with BCrypt password hashing
- **Role-Based Access Control** enforced at the backend (`/api/admin/**` is genuinely protected, not just hidden)
- Custom **Toast notification system** built with React Context API (no external library)
- Fully **responsive design** — mobile hamburger nav, responsive product grid
- Deployed to production with environment-based secrets (no hardcoded credentials)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Axios, React Router, Context API |
| **Backend** | Java, Spring Boot, Spring Security, Spring Data JPA (Hibernate) |
| **Database** | MySQL |
| **Auth** | JWT (JSON Web Tokens), BCrypt |
| **Media Storage** | Cloudinary |
| **Deployment** | Railway (Backend + MySQL), Vercel (Frontend) |
| **Version Control** | Git & GitHub |

---

## 🏗️ Architecture

```
┌─────────────────────┐         HTTPS + JWT          ┌──────────────────────────┐
│   React Frontend     │ ────────────────────────────▶│   Spring Boot Backend    │
│   (Vercel)            │◀──────────────────────────── │   (Railway)              │
└─────────────────────┘                                └───────────┬──────────────┘
                                                                     │
                                                          Spring Data JPA
                                                                     │
                                                                     ▼
                                                        ┌──────────────────────────┐
                                                        │      MySQL Database      │
                                                        │        (Railway)         │
                                                        └──────────────────────────┘

                            ┌──────────────────────────┐
                            │        Cloudinary         │ ◀── Product & profile images
                            └──────────────────────────┘
```

- **Stateless authentication** — no server-side sessions; every request is authorized via a JWT sent in the `Authorization` header.
- **CORS** explicitly configured to allow the deployed frontend origin to call the backend API.
- **RBAC enforced server-side** — role checks happen in Spring Security's filter chain, not just in the frontend UI.

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Java 17+
- Node.js & npm
- MySQL running locally

### Backend
```bash
cd FarmFusion
# Set your local DB credentials as environment variables, or in application.properties
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

The app expects the backend URL in `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8080
```

---

## 📦 Deployment

| Service | Platform |
|---|---|
| Backend API | [Railway](https://railway.app) |
| Database | Railway (Managed MySQL) |
| Frontend | [Vercel](https://vercel.com) |

Secrets (DB credentials, JWT secret, Cloudinary keys) are injected via environment variables on each platform — never committed to source control.

---

## 🔗 Links

- 🌐 **Live Site:** [farm-fusion-khaki.vercel.app](https://farm-fusion-khaki.vercel.app)
- 🔌 **Backend API:** [farmfusion-production.up.railway.app](https://farmfusion-production.up.railway.app)
- 💻 **Author:** [Nbisht0](https://github.com/Nbisht0)

---

<div align="center">

Made with 🌱 by Nidhi

</div>
