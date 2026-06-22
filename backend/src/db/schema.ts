import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type UserRole = "student" | "faculty" | "hod" | "admin";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role").$type<UserRole>().notNull().default("student"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});