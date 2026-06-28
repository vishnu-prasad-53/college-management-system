import { db, students, subjects, studentSubjects } from "../db/index.js";
import { and, eq } from "drizzle-orm";

export const enrollSubject = async (userId: number, subjectId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student profile not found");
    }

    const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, subjectId),
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    const enroll = await db.query.studentSubjects.findFirst({
        where: and(
            eq(studentSubjects.studentId, student.id),
            eq(studentSubjects.subjectId, subjectId)
        )
    });

    if (enroll) {
        throw new Error("Already enrolled in this subject");
    }

    if (subject.semester !== student.semester) {
        throw new Error("Subject is not available for your semester");
    }

    if (subject.departmentId !== student.departmentId) {
        throw new Error("Subject is not available for your department");
    }

    const newEnrollment = await db.insert(studentSubjects).values({
        studentId: student.id,
        subjectId,
    }).returning();

    return newEnrollment[0];
};

export const getMyEnrollments = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student profile not found");
    }
    const enrollmentsList = await db.query.studentSubjects.findMany({
        where: eq(studentSubjects.studentId, student.id),
        with: {
            subject: {
                with: {
                    department: true,
                    faculty: {
                        with: {
                            user: true,
                        },
                    },
                },
            }
        }
    });

    return enrollmentsList.map((enrollment) => {
        if (!enrollment.subject.faculty) {
            return enrollment;
        }

        const { password, ...safeUser } = enrollment.subject.faculty.user;

        return {
            ...enrollment,
            subject: {
                ...enrollment.subject,
                faculty: {
                    ...enrollment.subject.faculty,
                    user: safeUser,
                },
            },
        };
    });
};

export const dropEnrollment = async (userId: number, subjectId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student profile not found");
    }

    const enrollment = await db.query.studentSubjects.findFirst({
        where: and(
            eq(studentSubjects.studentId, student.id),
            eq(studentSubjects.subjectId, subjectId)
        ),
    });

    if (!enrollment) {
        throw new Error("Enrollment not found");
    }

    await db
        .delete(studentSubjects)
        .where(
            and(
                eq(studentSubjects.studentId, student.id),
                eq(studentSubjects.subjectId, subjectId)
            )
        );

    return {
        message: "Enrollment dropped successfully",
    };
};

export const getStudentsBySubject = async (subjectId: number) => {
    const enrollments = await db.query.studentSubjects.findMany({
        where: eq(studentSubjects.subjectId, subjectId),
        with: {
            student: {
                with: {
                    user: true,
                    department: true,
                },
            },
        },
    });

    if (enrollments.length === 0) {
        throw new Error("No students enrolled in this subject");
    }

    return enrollments.map((enroll) => {
        const { password, ...safeUser } = enroll.student.user;

        return {
            ...enroll,
            student: {
                ...enroll.student,
                user: safeUser,
            },
        };
    });
};