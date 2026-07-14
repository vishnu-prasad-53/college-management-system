import { db, users } from "../db/index.js";
import { students } from "../db/index.js";
import { eq } from "drizzle-orm";
import { hashPassword } from "../utils/hash.js";

export const getAllStudents = async () => {
    const studentsList = await db.query.students.findMany({
        with: {
            user: true,
            department: true,
        },
    });

    return studentsList.map((student) => {
        const { password, ...safeUser } = student.user;

        return {
            ...student,
            user: safeUser,
        };
    });
};

export const getStudentById = async (studentId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId),
        with: {
            user: true,
            department: true,
        },
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const { password, ...safeUser } = student.user;

    return {
        ...student,
        user: safeUser,
    };
};

export const createStudent = async (data: {
    name: string;
    email: string;
    departmentId: number;
    usn: string;
    semester: number;
    cgpa: number;
}) => {
    const tempPassword = "Student@123";

    const student = await db.transaction(async (tx) => {
        const existingUser = await tx.select().from(users).where(eq(users.email, data.email));

        if (existingUser.length > 0) {
            throw new Error("User already exists");
        }

        const hashedPassword = await hashPassword(tempPassword);

        const createdUsers = await tx.insert(users).values({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "student",
        }).returning();

        const user = createdUsers[0];

        const createdStudents = await tx.insert(students).values({
            userId: user.id,
            departmentId: data.departmentId,
            usn: data.usn,
            semester: data.semester,
            cgpa: data.cgpa,
        }).returning();

        return createdStudents[0];
    });

    return await getStudentById(student.id);
};

export const updateStudent = async (studentId: number, data: {
    departmentId?: number;
    usn?: string;
    semester?: number;
    cgpa?: number;
}) => {
    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    await db.update(students).set({
        ...data,
        updatedAt: new Date(),
    }).where(eq(students.id, studentId));

    return getStudentById(studentId);
};

export const deleteStudent = async (studentId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    await db.transaction(async (tx) => {
        await tx.delete(students).where(eq(students.id, studentId));

        await tx.delete(users).where(eq(users.id, student.userId));
    });
};

export const getStudentProfile = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
        with: {
            user: true,
            department: true,
        },
    });

    if (!student) {
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

    if (!student) {
        throw new Error("Student profile not found");
    }

    await db.update(students).set({
        ...data,
        updatedAt: new Date(),
    }).where(eq(students.id, student.id));

    return getStudentProfile(userId);
};