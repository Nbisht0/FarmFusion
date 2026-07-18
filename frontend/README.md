# FarmFusion — Agricultural Marketplace Platform

> A full-stack web application that directly connects farmers with customers — eliminating middlemen and bringing fresh, organic produce straight from farm to doorstep.

<br/>

## 📌 About the Project

FarmFusion is a role-based agricultural marketplace where **farmers** can list and manage their products, and **customers** can browse, wishlist, and order fresh organic produce. Built as a production-grade full-stack project using Spring Boot and React.

<br/>

## 🚀 Live Demo

> 🔗 *Deployment coming soon — August 2025*

<br/>

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Core language |
| Spring Boot 3.5.5 | REST API framework |
| Spring Data JPA | ORM & database layer |
| MySQL | Relational database |
| Cloudinary | Product image hosting |
| Lombok | Boilerplate reduction |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| React Router DOM | Client-side routing |
| Axios | HTTP client |
| CSS-in-JS (inline styles) | Styling |

<br/>

## Features

### Farmer Side
- Register & login as a farmer (with Aadhaar & address validation)
- Add products with **Cloudinary image upload**
- Edit product details (name, price, quantity, category, image) via modal
- Toggle product availability (In Stock / Out of Stock)
- View and manage customer orders — update status (PENDING → CONFIRMED → SHIPPED → DELIVERED → CANCELLED)
- Edit profile and change password

### Customer Side
- Register & login as a customer
- Browse all available products with **search** and **category filters**
- Add/remove products to/from **Cart** with real-time updates
- **Wishlist** management — save products for later
- View cart with subtotal, GST (7%) and total calculation
- Tabbed **Profile Modal** with 5 sections:
  - Overview
  - Edit Profile
  - Address Management
  - Change Password
  - Order History

### Landing Page
- Hero section with role selector (Customer / Farmer)
- Why Choose Us section
- Bestsellers showcase
- Customer Reviews section
- Contact form
- Smooth scroll navigation

<br/>

## Database Schema

```
users
├── id, name, email, password, role (FARMER / CUSTOMER)
├── age, gender, phone, city, state
└── address, aadhaar (farmer fields)

products
├── id, name, description, price, quantity
├── imageUrl, category
└── added_by_user_id (FK → users)

cart
├── id, quantity
├── user_id (FK → users)
└── product_id (FK → products)

wishlist
├── id
├── user_id (FK → users)
└── product_id (FK → products)

orders
├── id, orderDate, totalAmount, status
├── user_id (FK → users)
└── address_id (FK → addresses)

order_items
├── id, quantity, price
├── order_id (FK → orders)
└── product_id (FK → products)

addresses
└── id, street, city, state, pincode, country, user_id
```

<br/>

##  Project Structure

```
FarmFusion/
├── src/
│   ├── main/java/com/FarmFusion/
│   │   ├── controller/        # REST API endpoints
│   │   │   ├── UserController.java
│   │   │   ├── ProductController.java
│   │   │   ├── OrdersController.java
│   │   │   ├── AddressController.java
│   │   │   └── ImageController.java
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Spring Data JPA repos
│   │   ├── entity/            # JPA entities
│   │   ├── config/            # CORS, Cloudinary config
│   │   └── exception/         # Global exception handling
│   │
│   └── (React frontend — root level)
│       ├── App.js             # Routes + Landing page
│       ├── CustomerDashboard.js
│       ├── CustomerLogin.js / CustomerRegister.js
│       ├── Farmerdashboard.js
│       └── FarmerLogin.js / FarmerRegister.js
│
├── Database/                  # SQL scripts
├── pom.xml                    # Maven dependencies
└── package.json               # React dependencies
```

<br/>

##  Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8+
- Maven

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Nbisht0/FarmFusion.git
cd FarmFusion

# 2. Set up MySQL database
# Run the SQL scripts from /Database folder

# 3. Configure application.properties
# src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/farmfusion
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

# Cloudinary (for image uploads)
cloudinary.cloud_name=YOUR_CLOUD_NAME
cloudinary.api_key=YOUR_API_KEY
cloudinary.api_secret=YOUR_API_SECRET

# 4. Run Spring Boot
./mvnw spring-boot:run
# Backend runs on http://localhost:8080
```

### Frontend Setup

```bash
# In the root directory (where package.json is)
npm install
npm start
# Frontend runs on http://localhost:3000
```

<br/>

##  API Endpoints

### Users
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register customer or farmer |
| POST | `/api/users/login` | Login |
| GET | `/api/users/{id}` | Get user profile |
| PUT | `/api/users/update/{id}` | Update profile |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | Get all products |
| GET | `/products/farmer/{id}` | Get farmer's products |
| POST | `/products/add` | Add new product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart/{userId}` | Get cart items |
| POST | `/api/cart/add` | Add to cart |
| DELETE | `/api/cart/remove` | Remove from cart |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders/customer/{id}` | Get customer orders |
| POST | `/api/orders` | Place order |
| PATCH | `/api/orders/{id}/status` | Update order status |

### Wishlist
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wishlist/{userId}` | Get wishlist |
| POST | `/api/wishlist/add` | Add to wishlist |
| DELETE | `/api/wishlist/remove` | Remove from wishlist |

<br/>

##  Developer

**Nidhi Bisht**
- B.Tech Computer Science Engineering
- Women's Institute of Technology, Dehradun
- Java Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-Nbisht0-181717?style=flat&logo=github)](https://github.com/Nbisht0)

<br/>

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ for farmers and food lovers who believe in honest, sustainable commerce.</p>
