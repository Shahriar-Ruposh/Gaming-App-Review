// validators.ts
import { body } from "express-validator";

export const registerValidator = [body("name").trim().notEmpty().withMessage("Name is required"), body("email").isEmail().withMessage("Valid email is required"), body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")];

export const verifyEmailValidator = [body("email").isEmail().withMessage("Valid email is required"), body("otp").notEmpty().withMessage("OTP is required")];

export const loginValidator = [body("email").isEmail().withMessage("Valid email is required"), body("password").notEmpty().withMessage("Password is required")];

export const googleLoginValidator = [body("token").notEmpty().withMessage("Google token is required")];

export const forgotPasswordValidator = [body("email").isEmail().withMessage("Valid email is required")];

export const resetPasswordValidator = [body("email").isEmail().withMessage("Valid email is required"), body("otp").notEmpty().withMessage("OTP is required"), body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")];
