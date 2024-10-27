import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { registerValidator, verifyEmailValidator, loginValidator, googleLoginValidator, forgotPasswordValidator, resetPasswordValidator } from "../utils/validators";

const router = Router();

router.post("/register", registerValidator, authController.register);

router.post("/verify-email", verifyEmailValidator, authController.verifyEmail);

router.post("/login", loginValidator, authController.login);

router.post("/google-login", googleLoginValidator, authController.googleLogin);

router.post("/forgot-password", forgotPasswordValidator, authController.forgotPassword);

router.post("/reset-password", resetPasswordValidator, authController.resetPassword);

router.post("/logout", authenticate, authController.logout);

// Protected routes examples
// router.get("/profile", authenticate, (req, res) => {
//   res.json({ user: req.user });
// });

// router.get("/admin", authenticate, isAdmin, (req, res) => {
//   res.json({ message: "Admin access granted" });
// });

// router.get("/super-admin", authenticate, isSuperAdmin, (req, res) => {
//   res.json({ message: "Super admin access granted" });
// });

export default router;
