import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/user.types.js";

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if(!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if(!roles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: "Forbidden" });
            return
        }
        next();
    };
};