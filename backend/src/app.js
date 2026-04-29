// backend/src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Simplified CORS for development
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import aiRoutes from "./routes/ai.route.js";

app.use("/api/ai", aiRoutes);
import userRoutes from "./routes/user.route.js";
app.use("/api/users", userRoutes);
import blogRoutes from "./routes/blog.route.js";
app.use("/api/blogs", blogRoutes);
import commentRoutes from "./routes/comment.route.js";
app.use("/api/comments", commentRoutes);
import likeRoutes from "./routes/like.route.js";
app.use("/api/likes", likeRoutes);
// Health check
app.get("/", (req, res) => {
  res.json({ message: "Blog Backend API is running!" });
});

export { app };