import "dotenv/config"

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET,
};