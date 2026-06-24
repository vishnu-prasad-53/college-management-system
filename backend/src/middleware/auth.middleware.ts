import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt.js";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token) as JwtPayload;

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: error instanceof Error ? error.message: "Invalid or expired token" });
    }
};