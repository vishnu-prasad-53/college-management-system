import { db } from "../db/index.js";
import { users } from "../db/index.js";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { UserRole } from "../types/user.types.js";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

type RegisterInput = {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
};

export const registerUser = async (data: RegisterInput) => {
    const user = await createUser(db, data);

    const { password, ...safeUser } = user;

    return safeUser;
};

export const loginUser = async (email: string, password: string) => {
    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length === 0) {
        throw new Error("Invalid credentials");
    }

    const isValid = await comparePassword(password, user[0].password);

    if (!isValid) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user[0].id, user[0].role);

    return {
        user: {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            role: user[0].role,
        }, token,
    };
};

export const getCurrentUser = async (id: number) => {
    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
    });

    if (!user) {
        throw new Error("User not found")
    }

    const { password, ...safeUser } = user;

    return safeUser;
};

export const createUser = async (
    database: NodePgDatabase | typeof db,
    data: RegisterInput
) => {
    const existingUser = await database
        .select()
        .from(users)
        .where(eq(users.email, data.email));

    if (existingUser.length > 0) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const created = await database.insert(users).values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role ?? "student",
    }).returning();

    return created[0];
};