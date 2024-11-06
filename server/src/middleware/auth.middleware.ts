import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log("??????????????????????????????????????", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error authenticating user", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.roles[0]) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.roles[1]) {
    return res.status(403).json({ message: "Super admin access required" });
  }
  next();
};

export { authenticate, isAdmin, isSuperAdmin };
