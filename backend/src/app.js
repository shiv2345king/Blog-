import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./configure/passport-config.js";

// routes 
import userRoutes from "./routes/user.route.js";
import blogRoutes from "./routes/blog.route.js";
import likeRoutes from "./routes/like.route.js";
import commentRoutes from "./routes/comment.route.js";
import aiRoutes from "./routes/ai.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

const app = express();
//middlewares

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(passport.initialize());
//cors configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-git-main-shivam-guptas-projects-cd5190e3.vercel.app",
  "https://blog-anhqu613z-shivam-guptas-projects-cd5190e3.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

//routes
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export { app };