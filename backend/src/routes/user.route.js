import { Router } from "express";
import {
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
} from "../controllers/user.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/* ================= AUTH (PUBLIC) ================= */

router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);

router.post("/login", loginUser);

// IMPORTANT: refresh should NOT require auth middleware
router.post("/refresh-token", refreshAccessToken);

/* ================= PROTECTED ================= */

router.use(verifyJwt); // 👈 IMPORTANT: apply AFTER public routes

router.post("/logout", logoutUser);

router.post("/change-password", changeCurrentPassword);

router.get("/me", getCurrentUser);

router.put("/update", updateAccountDetails);

router.put(
  "/avatar",
  upload.single("avatar"),
  updateUserAvatar
);

router.delete("/delete", deleteUserAccount);

router.get("/:username/profile", getUserProfile);

export default router;