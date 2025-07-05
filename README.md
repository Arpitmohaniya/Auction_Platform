# 🏷️ Auction Platform

An online auction platform built with **MERN Stack** — allowing users to create auctions, place bids, manage items, and handle payments securely.

---

## 📌 Features

- 🔐 **Authentication & Authorization**
  - User registration & login with JWT.
  - Role-based access: `admin` and `user`.

- 🏷️ **Auction Management**
  - Create auctions with title, description, starting bid, and images.
  - View all auctions in a responsive dashboard.
  - Admin can **delete** auctions.

- 🗂️ **Dashboard**
  - Responsive sidebar (drawer) with navigation.
  - See auctions and actions in a clean grid.
  - Only admins see delete controls.

- 💸 **Payment (Coming Soon)**
  - Secure payment flow for winning bids.
  - Integration with a payment gateway.

---

## ⚙️ Tech Stack

| Tech     | Description               |
| -------- | ------------------------- |
| **Frontend** | React.js, React Router, CSS Modules |
| **Backend**  | Node.js, Express.js, JWT Authentication |
| **Database** | MongoDB with Mongoose ODM |
| **File Uploads** | Multer for handling auction images |
| **Authentication** | JSON Web Token (JWT) based auth |
| **Payment** | Planned: Stripe, Razorpay, or PayPal |

---
