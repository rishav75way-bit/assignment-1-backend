import { Router } from "express";
import {
  signup,
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
} from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  signupSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schemas";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.post("/change-password", authenticate, validate(changePasswordSchema), changePassword);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
