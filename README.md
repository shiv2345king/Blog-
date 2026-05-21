# 🚀 Full Stack Blog Platform

> A modern full-stack blogging platform with authentication, dashboard, and real-time content management.

🌐 **Live Demo:**  
👉 https://blog-git-main-shivam-guptas-projects-cd5190e3.vercel.app/

---

## 🧠 Overview

This is a **full-stack MERN-style blog application** featuring secure authentication, dynamic blog creation, user dashboard, and protected routes.

Built with a focus on:
- 🔐 Secure authentication (JWT + HTTP-only cookies)
- ⚡ Scalable backend architecture
- 🎯 Clean UI & responsive UX
- 🌍 Production-ready deployment

---

## 🛠️ Tech Stack

### Frontend
- React.js ⚛️
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS 💨

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication 🔐
- Cloudinary (Image Uploads ☁️)

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## ✨ Features

🔥 User Authentication (Register / Login / Logout)  
🔐 JWT-based secure cookie authentication  
📝 Create, edit, delete blog posts  
📄 View all posts & single post pages  
📊 Personalized user dashboard  
🖼️ Image upload via Cloudinary  
🚪 Secure session handling  
⚡ Protected frontend & backend routes  
🌐 Fully deployed full-stack architecture  

---

## 🔐 Authentication System

- Uses **JWT tokens stored in HTTP-only cookies**
- Secure cross-origin authentication setup
- Middleware-based route protection
- Auto session validation on refresh

---

## 📡 API Endpoints

### 👤 Auth Routes

POST /api/users/register
POST /api/users/login
POST /api/users/logout
GET /api/users/me


### 📝 Blog Routes

GET /api/blogs
POST /api/blogs
GET /api/blogs/:id
PUT /api/blogs/:id
DELETE /api/blogs/:id


### 📊 Dashboard

GET /api/dashboard


---

## 🧱 Project Architecture


frontend/
├── components/
├── pages/
├── api/
├── store/
└── App.jsx

backend/
├── controllers/
├── routes/
├── middlewares/
├── models/
└── index.js


---

## ⚠️ Production Notes

To run this project correctly in production:

- CORS must include frontend domain
- Cookies must use:

sameSite: "none"
secure: true

- Frontend API requests must include:

withCredentials: true

- SPA routing requires Vercel rewrite config

---

## 📸 Screenshots

> Add screenshots here to make repo more attractive

- Home Page
- Dashboard
- Blog Page
- Login / Signup

---

## 🚀 What Makes This Project Special

- Real-world authentication flow (not dummy JWT storage)
- Production deployment on Vercel + Render
- Cross-origin cookie handling solved
- Full CRUD blog system
- Scalable folder structure

---

## 📈 Future Improvements

- 🔔 Notifications system
- 💬 Comments & likes
- 👥 User profiles
- 🔎 Search & filtering
- 📱 Mobile app version

---

## 👨‍💻 Author

**Shivam Gupta**

---

## ⭐ Show Your Support

If you like this project:
- ⭐ Star the repository
- 🍴 Fork it
- 🛠️ Improve it

---

> Built with 💙 using MERN stack + real-world deployment practices
