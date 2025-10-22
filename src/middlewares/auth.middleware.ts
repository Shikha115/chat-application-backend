import { NextFunction, Request, Response } from "express";
import { verifyToken } from "@/helpers/jwt";
import User from "@/models/user.model";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface JwtPayload {
  id: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized: No token");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token) as JwtPayload | null;
    if (!decoded) {
      res.status(401);
      throw new Error("Not authorized: Invalid token");
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not authorized: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
