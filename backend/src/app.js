import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ================= ROUTES =================
import userRoutes from "./routes/user.route.js";
import blogRoutes from "./routes/blog.route.js";
import likeRoutes from "./routes/like.route.js";
import commentRoutes from "./routes/comment.route.js";
import aiRoutes from "./routes/ai.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

const app = express();

/* ================= CORE MIDDLEWARE ================= */

// JSON parser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookies (IMPORTANT for auth refresh system)
app.use(cookieParser());

/* ================= CORS CONFIG ================= */

app.use(
  cors({
    origin: "http://localhost:5173", // frontend (Vite)
    credentials: true, // 🔥 REQUIRED for cookies auth
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ================= ROUTES ================= */

// Users (auth, profile, refresh token, etc.)
app.use("/api/users", userRoutes);

// Blogs (posts CRUD)
app.use("/api/blogs", blogRoutes);

// Likes (like/unlike blogs)
app.use("/api/likes", likeRoutes);

// Comments (add/delete/list comments)
app.use("/api/comments", commentRoutes);

// AI (review, suggestions, etc.)
app.use("/api/ai", aiRoutes);

// Dashboard (user's personal data and stats)
app.use("/api/dashboard", dashboardRoutes);

/* ================= 404 HANDLER ================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export { app };