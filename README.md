<!--
## E-Commerce Project

#### Status: 🚧 In Progress
-->
### A fully-featured and scalable e-commerce backend built with **Node.js**, **Express.js**, and **MongoDB**. This RESTful API supports managing products, users, orders, authentication, payments, and more — following clean code principles, modular architecture, and secure design patterns.

---

## 📦 Features

- ✅ **User Authentication & Authorization**
  - Register, login, password reset (with email support)
  - Role-based access control using JWT
- 🛍️ **Product & Category Management**
  - CRUD operations for categories, subcategories, brands, and products
  - Image uploads (with Sharp) and filtering by price, rating, etc.
- ⭐ **Product Reviews & Wishlist**
  - Add/edit product reviews and manage wishlist items
- 🛒 **Cart & Coupons**
  - Add to cart, apply discount coupons, calculate totals
- 📦 **Orders & Checkout**
  - Cash on delivery (COD) & Stripe payment integration
- 🔐 **Security**
  - Helmet, rate limiting, input sanitization, and HPP protection
- 🧪 **Testing**
  - All endpoints tested with Postman

---

## 🧱 Tech Stack

- **Node.js** / **Express.js**
- **MongoDB** / **Mongoose**
- **JWT** – Authentication
- **Multer** – File uploads
- **Sharp** – Image processing
- **Stripe** – Online payments
- **Nodemailer** – Email notifications
- **dotenv**, **express-rate-limit**, **helmet**, **hpp**, and more

---

## 🗂️ Project Structure

📁 config/ # DB and environment setup

📁 controllers/ # Route logic handlers

📁 middlewares/ # Custom middleware (auth, error, validation)

📁 models/ # Mongoose models

📁 routes/ # Express routers

📁 utils/ # Helper functions (email, error handlers, etc.)

📁 services/ # Business logic layer

.env # Environment variables

server.js # Entry point

---
