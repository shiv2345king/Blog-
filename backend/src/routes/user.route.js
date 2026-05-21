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

/* ================= PUBLIC ROUTES ================= */

router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);

router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

/* ================= PROTECTED ROUTES ================= */

router.use(verifyJwt);

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