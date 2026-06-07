import { Router } from "express";
import passport from "passport";

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
  generateAccessAndRefereshTokens,
  cookieOptions,
} from "../controllers/user.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//google auth routes

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  async (req, res) => {
    const { accessToken, refreshToken } =
      await generateAccessAndRefereshTokens(req.user._id);

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .redirect(process.env.FRONTEND_URL);
  }
);

//public routes
router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);

router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

router.get("/auth/google-test", (req, res) => {
  res.json({
    routeWorking: true,
    scope: ["profile", "email"],
  });
});
//protected routes
router.use(verifyJwt);

router.post("/logout", logoutUser);
router.post("/change-password", changeCurrentPassword);
router.get("/me", getCurrentUser);
router.put("/update", updateAccountDetails);
router.put("/avatar", upload.single("avatar"), updateUserAvatar);
router.delete("/delete", deleteUserAccount);
router.get("/:username/profile", getUserProfile);

export default router;