import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

interface JwtPayload {
  userId: number;
  email: string;
  roles: boolean[];
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const trackUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  console.log("?????????????????????//", token);
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
