import express from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js"
import studentRoutes from "./routes/student.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";

const app = express();

app.use(express.json());

const PORT = Number(env.PORT) || 3000

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "College Management API Running",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});