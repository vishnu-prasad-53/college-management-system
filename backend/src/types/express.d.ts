import { UserRole } from "./user.types.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: UserRole;
            };
        }
    }
}

export {};