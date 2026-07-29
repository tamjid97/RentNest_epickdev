# RentNest 🏠

> **Find & List Rental Properties with Ease** > RentNest is a robust backend API built for a modern rental property marketplace. It empowers landlords to seamlessly list properties and manage rental lifecycle requests, enables tenants to discover homes and make secure payments, and provides admins with comprehensive platform moderation tools.

---

## 🚀 Live Links & Resources

* **Live API URL:** [https://rent-nest-nu-hazel.vercel.app](https://rent-nest-nu-hazel.vercel.app)
* **Postman API Documentation:** [View Postman Docs](https://documenter.getpostman.com/view/54839164/2sBY4LQ1fr)
* **Database Architecture:** [DrawSQL Diagram](https://drawsql.app/teams/epick/diagrams/rentnest)
* **Video Walkthrough / Demo:** [Watch Loom Video](https://www.loom.com/share/caba00bac7784959a6920e1723e90e7c)

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database & ORM:** PostgreSQL / Prisma ORM
* **Authentication:** JSON Web Tokens (JWT) & bcrypt securely hashing passwords
* **Payment Gateways:** Stripe & SSLCommerz Integration
* **Deployment:** Vercel

---

## 👥 Roles & Permissions

Users select their specific role during registration. The platform is architected around three distinct user archetypes:

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **Tenant** | Users looking for rental spaces | Browse listings, submit requests, make secure payments, leave reviews. |
| **Landlord** | Property owners listing real estate | Create/manage listings, approve/reject requests, track payment history. |
| **Admin** | Platform moderators | Manage all users (ban/unban), oversee listings, manage property categories. |

---

## ✨ Features

### 🌍 Public Features
* Explore all available property listings globally.
* Advanced search functionality using filters for **location**, **price range**, **property type**, and **amenities**.
* View detailed individual property pages.

### 🔑 Tenant Features
* Secure authentication (Register/Login).
* Submit rental requests for specific property availability timelines.
* Process secure automated payments via **Stripe** or **SSLCommerz** once a rental request is approved.
* Track rental request histories through live status states (`pending`, `approved`, `rejected`).
* Submit property reviews after rental completion.

### 🏡 Landlord Features
* Create, dynamically update, or delete property listings.
* Toggle immediate property availability status.
* Manage incoming tenant requests with single-click approval or rejection.
* Review tenant history metrics alongside incoming property feedback.

### 🛡️ Admin Features
* Full system user moderation management (Ban/Unban toggles).
* Universal view overrides across all global properties and rental transactions.
* Maintain and scale dynamic global property category types.

---

## 📊 Database Schema

The database relies on an optimized relational database schema maps entities seamlessly across workflows. 
* **Users Table:** Handles identification, authentication hashes, and system authorization roles.
* **Properties Table:** Hosts rental information, location attributes, pricing matrices, and links back to designated landlord hosts.
* **Categories Table:** Defines property classification boundaries (e.g., Apartment, Studio, House).
* **RentalRequests Table:** Acts as the central state machine handling negotiations between renters and owners.
* **Payments Table:** Tracks transactional histories tracking payment providers, statuses, and identifiers.
* **Reviews Table:** Tracks feedback score integrations.

---

## 🛣️ API Endpoints

### 🔐 Authentication
* `POST /api/auth/register` — Register a new account (Tenant/Landlord).
* `POST /api/auth/login` — Authenticate credentials and receive a bearer JWT token.
* `GET /api/auth/me` — Retrieve current identity payload metadata.

### 🏠 Properties (Public Access)
* `GET /api/properties` — Fetch properties alongside operational query filter strings.
* `GET /api/properties/:id` — Target specific property configuration profiles.
* `GET /api/categories` — Get a list of supported property categories.

### 🧑‍🌾 Landlord Operations
* `POST /api/landlord/properties` — Deploy a new property profile online.
* `PUT /api/landlord/properties/:id` — Perform field adjustments on active listings.
* `DELETE /api/landlord/properties/:id` — Remove an inactive property listing from the platform.
* `GET /api/landlord/requests` — View a comprehensive inbox of pending application inquiries.
* `PATCH /api/landlord/requests/:id` — Transition application request statuses (`Approve` / `Reject`).

### 📑 Rental Requests
* `POST /api/rentals` — Tenants launch a booking proposal.
* `GET /api/rentals` — Track your submission inbox history.
* `GET /api/rentals/:id` — Pull specific details for an individual rental request.

### 💳 Payments Integration
* `POST /api/payments/create` — Initialize session intents utilizing Stripe or SSLCommerz.
* `POST /api/payments/confirm` — Secure callback handler checking webhook payment verification.
* `GET /api/payments` — Query historically processed payment records.

### 📝 Reviews
* `POST /api/reviews` — Write feedback following an active rental completion.

### 🛡️ Administrative Controls
* `GET /api/admin/users` — Fetch comprehensive application system identities.
* `PATCH /api/admin/users/:id` — Enforce status access parameters (Ban/Unban accounts).
* `GET /api/admin/properties` — High-level review access over global properties.
* `GET /api/admin/rentals` — Direct oversight of system-wide transaction history.

---

## 🔐 Administrative Test Credentials

For evaluation and grading purposes, you can access the pre-configured admin account using the following credentials:

> **Email:** `admin@example.com`  
> **Password:** `password123`

---
