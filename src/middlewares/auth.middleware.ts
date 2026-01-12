import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    res.locals.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
