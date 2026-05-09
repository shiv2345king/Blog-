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
        getUserProfile
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);
router.post("/login", loginUser);
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJwt, changeCurrentPassword);
router.get("/me", verifyJwt, getCurrentUser);
router.put("/update", verifyJwt, updateAccountDetails);
router.put("/avatar", verifyJwt, upload.single("avatar"), updateUserAvatar);
router.delete("/delete", verifyJwt, deleteUserAccount);
router.get("/:username/profile", verifyJwt, getUserProfile);
export default router;