import { db } from "../db/index.js";
import { students } from "../db/index.js";
import { eq } from "drizzle-orm";

export const getStudentProfile = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
        with: {
            user: true,
            department: true,
        },
    });

    if(!student) {
        throw new Error("Student profile not found");
    }

    const { password, ...safeUser } = student.user;

    return {
        ...student,
        user: safeUser,
    };
};

export const updateStudentProfile = async (userId: number, data: {
    semester?: number;
    cgpa?: number;
}) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if(!student) {
        throw new Error("Student profile not found");
    }

    await db.update(students).set({
        ...data,
        updatedAt: new Date(),
    }).where(eq(students.id, student.id));

    return getStudentProfile(userId);
};