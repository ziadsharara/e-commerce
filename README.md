<!--
## E-Commerce Project

#### Status: 🚧 In Progress
-->
A fully-featured and scalable e-commerce backend built with **Node.js**, **Express.js**, and **MongoDB**. This RESTful API supports managing products, users, orders, authentication, payments, and more — following clean code principles, modular architecture, and secure design patterns.

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

yaml
Copy
Edit

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/shoply-api.git
cd shoply-api
2. Install dependencies
bash
Copy
Edit
npm install
3. Create .env file
env
Copy
Edit
PORT=5000
DB_URI=mongodb+srv://your-db-uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
STRIPE_SECRET_KEY=your_stripe_secret
4. Run the app
bash
Copy
Edit
npm run dev
📬 API Documentation
All endpoints are documented and tested using Postman. You can import the collection from the provided file in the docs/ folder (if included).

📌 Acknowledgement
This project was inspired by and follows the learning path of the Udemy Course: Node.js – Build E-Commerce RESTful APIs by Boghdady.

🧑‍💻 Author
Your Name – @yourGitHub

Add your LinkedIn / Portfolio if you'd like

📝 License
This project is open source and available under the MIT License.

yaml
Copy
Edit
