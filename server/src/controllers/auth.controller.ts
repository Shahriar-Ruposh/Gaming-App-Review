import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User, UserAttributes } from "../models/user.model";
import { generateOTP, sendEmail } from "../utils/email.helper";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      // otp,
      // otpExpiry,
      isVerified: true,
      isActive: true,
    } as UserAttributes);
    const token = jwt.sign({ userId: user.id, email: user.email, roles: [user.isAdmin, user.isSuperAdmin] }, JWT_SECRET, { expiresIn: "20d" });
    // await sendEmail(email, "Email Verification", `Your OTP is: ${otp}`);
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ message: "Registration successful. Please verify your email.", token, user: { userId: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.isActive = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    // console.log(">>>>>>>>>>>>>>>>>>>>", user);
    console.log("1");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("2");

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }
    console.log("3");
    const token = jwt.sign({ userId: user.id, email: user.email, roles: [user.isAdmin, user.isSuperAdmin] }, JWT_SECRET, { expiresIn: "20d" });
    console.log("4");
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
    });
    console.log("5");

    res.json({ message: "Login successful", token, user: { userId: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid token" });
    }

    let user = await User.findOne({ where: { googleId: payload.sub } });
    if (!user) {
      user = await User.create({
        name: payload.name || "",
        email: payload.email || "",
        googleId: payload.sub,
        password: Math.random().toString(36),
        isVerified: true,
      } as UserAttributes);
    }

    const jwtToken = jwt.sign({ userId: user.id, email: user.email, name: user.name, roles: [user.isAdmin, user.isSuperAdmin] }, JWT_SECRET, { expiresIn: "24h" });

    res.cookie("token", jwtToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Google login successful", token: jwtToken, user: { userId: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail(email, "Password Reset", `Your OTP for password reset is: ${otp}`);

    res.json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const logout = (req: Request, res: Response) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  res.clearCookie(token);
  res.json({ message: "Logout successful" });
};
