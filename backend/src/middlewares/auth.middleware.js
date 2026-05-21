import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";

export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiErrors(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiErrors(401, "Invalid user");
    }

    req.user = user; // 🔥 THIS IS CRITICAL

    next();
  } catch (err) {
    throw new ApiErrors(401, err?.message || "Invalid token");
  }
};