import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

/* ================= COOKIE OPTIONS ================= */
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

/* ================= TOKEN GENERATION ================= */
const generateAccessAndRefereshTokens = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new ApiErrors(404, "User not found");

  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

/* ================= REGISTER ================= */
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some((f) => !f?.trim())) {
    throw new ApiErrors(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiErrors(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  // 🔥 FIX: allow missing avatar instead of breaking (IMPORTANT)
  let avatarUrl = "";

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (avatar?.url) avatarUrl = avatar.url;
  }

  const user = await User.create({
    fullName,
    avatar: avatarUrl || "https://default-avatar.com/avatar.png",
    email,
    password,
    username: username.toLowerCase(),
  });

  const { accessToken, refreshToken } =
    await generateAccessAndRefereshTokens(user._id);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, { user: createdUser }, "User registered"));
});

/* ================= LOGIN ================= */
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    throw new ApiErrors(400, "Credentials required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new ApiErrors(404, "User not found");

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) throw new ApiErrors(401, "Invalid credentials");

  const { accessToken, refreshToken } =
    await generateAccessAndRefereshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser }, "Login successful"));
});

/* ================= LOGOUT ================= */
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out"));
});

/* ================= REFRESH TOKEN ================= */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiErrors(401, "Refresh token required");
  }

  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch {
    throw new ApiErrors(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded._id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiErrors(401, "Refresh token mismatch");
  }

  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const newRefreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new ApiResponse(200, {}, "Token refreshed"));
});

/* ================= OTHER ROUTES (UNCHANGED) ================= */

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiErrors(404, "User not found");

  const isValid = await user.isPasswordCorrect(oldPassword);
  if (!isValid) throw new ApiErrors(400, "Incorrect old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.json(new ApiResponse(200, {}, "Password changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.json(new ApiResponse(200, req.user, "User fetched"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullName, email },
    { new: true }
  ).select("-password");

  return res.json(new ApiResponse(200, user, "Updated"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocal = req.file?.path;

  if (!avatarLocal) throw new ApiErrors(400, "Avatar file missing");

  const avatar = await uploadOnCloudinary(avatarLocal);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar?.url || "" },
    { new: true }
  ).select("-password");

  return res.json(new ApiResponse(200, user, "Avatar updated"));
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  return res.json(new ApiResponse(200, {}, "Account deleted"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  if (!user) throw new ApiErrors(404, "User not found");

  return res.json(new ApiResponse(200, user, "Profile fetched"));
});

/* ================= EXPORTS ================= */
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  deleteUserAccount,
  getUserProfile,
};