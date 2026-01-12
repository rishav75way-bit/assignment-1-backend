import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export const authorizeRoles =
  (...allowedRoles: Array<"admin" | "user">) =>
  async (_req: Request, res: Response, next: NextFunction) => {
    const userId: string | undefined = res.locals.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("role");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.locals.role = user.role;

    return next();
  };
