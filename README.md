# 🔐 Role-Based File Upload Backend (RBAC)

A secure REST API implementing **Role-Based Access Control (RBAC)** for file upload and access management using **Node.js, Express, MongoDB, and TypeScript**.

This backend handles authentication, authorization, file storage, and role enforcement.

---

## ✨ Features

### Authentication & Security
- JWT-based authentication (Access + Refresh tokens)
- Refresh tokens stored securely in **httpOnly cookies**
- Password hashing using bcrypt
- Forgot / Reset password flow with expiring tokens
- Protected routes with middleware

### Role-Based Access Control (RBAC)
- Supported roles:
  - `user`
  - `admin`
- **Users**
  - Upload files
  - View & download only their own files
- **Admin**
  - View all uploaded files
  - Delete any file
- All permissions enforced on the backend

### File Management
- Local file storage
- File metadata stored in MongoDB
- File type & size validation
- Secure downloads (Authorization required)

---

## 🛠 Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcrypt
- Zod (request validation)
- Multer (file uploads)
- Cookie-parser
- CORS

---

# 🔐 Role-Based File Upload Backend (RBAC)

A secure REST API implementing **Role-Based Access Control (RBAC)** for file upload and access management using **Node.js, Express, MongoDB, and TypeScript**.

This backend handles authentication, authorization, file storage, and role enforcement.

---

## ✨ Features

### Authentication & Security
- JWT-based authentication (Access + Refresh tokens)
- Refresh tokens stored securely in **httpOnly cookies**
- Password hashing using bcrypt
- Forgot / Reset password flow with expiring tokens
- Protected routes with middleware

### Role-Based Access Control (RBAC)
- Supported roles:
  - `user`
  - `admin`
- **Users**
  - Upload files
  - View & download only their own files
- **Admin**
  - View all uploaded files
  - Delete any file
- All permissions enforced on the backend

### File Management
- Local file storage
- File metadata stored in MongoDB
- File type & size validation
- Secure downloads (Authorization required)

---

## 🛠 Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcrypt
- Zod (request validation)
- Multer (file uploads)
- Cookie-parser
- CORS


## 🔑 Environment Variables

Create a `.env` file in the backend root:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

ADMIN_EMAIL=admin-id
ADMIN_PASSWORD=admin-password
