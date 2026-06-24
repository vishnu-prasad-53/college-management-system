import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserRole } from "../types/user.types.js";


export const generateToken = (id: number, role: UserRole) => {
    if (!env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing");
    }

    return jwt.sign({
        id,
        role,
    },
    env.JWT_SECRET,
    {
        expiresIn: "7d",
    });
};

export const verifyToken = (token: string) => {
    if(!env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing");
    }

    return jwt.verify(token, env.JWT_SECRET);
};

export type JwtPayload = {
    id: number;
    role: UserRole;
}