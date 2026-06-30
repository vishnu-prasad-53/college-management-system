import { and, eq, desc } from "drizzle-orm";
import { db, marks, students, subjects, studentSubjects, gradeEnum } from "../db/index.js";

type Grade = (typeof gradeEnum.enumValues)[number];

const calculateGrade = (totalMarks: number): Grade => {
    if (totalMarks >= 90) return "A+";
    if (totalMarks >= 80) return "A";
    if (totalMarks >= 70) return "B+";
    if (totalMarks >= 60) return "B";
    if (totalMarks >= 50) return "C";
    if (totalMarks >= 40) return "D";
    return "F";
};

const validateMarks = (internal: number, external: number) => {
    if (internal < 0 || internal > 40) {
        throw new Error("Internal marks must be between 0 and 40");
    }

    if (external < 0 || external > 60) {
        throw new Error("External marks must be between 0 and 60");
    }
};

export const addMarks = async (studentId: number, subjectId: number, internalMarks: number, externalMarks: number) => {
    validateMarks(internalMarks, externalMarks);

    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, subjectId),
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    const enrollment = await db.query.studentSubjects.findFirst({
        where: and(
            eq(studentSubjects.studentId, studentId),
            eq(studentSubjects.subjectId, subjectId),
        ),
    });

    if (!enrollment) {
        throw new Error("Student is not enrolled in this subject");
    }

    const existingMarks = await db.query.marks.findFirst({
        where: and(
            eq(marks.studentId, studentId),
            eq(marks.subjectId, subjectId),
        ),
    });

    if (existingMarks) {
        throw new Error("Marks already added for this subject");
    }

    const totalMarks = internalMarks + externalMarks;

    if (totalMarks > 100) {
        throw new Error("Total marks cannot exceed 100");
    }

    const grade = calculateGrade(totalMarks);

    const [newMarks] = await db
        .insert(marks)
        .values({
            studentId,
            subjectId,
            internalMarks,
            externalMarks,
            totalMarks,
            grade,
        })
        .returning();

    return newMarks;
};

export const getMyMarks = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student profile not found");
    }

    const marksList = await db.query.marks.findMany({
        where: eq(marks.studentId, student.id),
        orderBy: (marks, { desc }) => [desc(marks.totalMarks)],
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
            },
        },
    });

    return marksList.map((record) => {
        if (!record.subject.faculty) {
            return record;
        }

        const { password: _password, ...safeUser } = record.subject.faculty.user;

        return {
            ...record,
            subject: {
                ...record.subject,
                faculty: {
                    ...record.subject.faculty,
                    user: safeUser,
                },
            },
        };
    });
};

export const getMarksBySubject = async (subjectId: number) => {
    const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, subjectId),
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    const marksList = await db.query.marks.findMany({
        where: eq(marks.subjectId, subjectId),
        orderBy: (marks, { desc }) => [desc(marks.totalMarks)],
        with: {
            student: {
                with: {
                    user: true,
                    department: true,
                },
            },
        },
    });

    if (marksList.length === 0) {
        throw new Error("No marks found for this subject");
    }

    return marksList.map((record) => {
        const { password: _, ...safeUser } = record.student.user;

        return {
            ...record,
            student: {
                ...record.student,
                user: safeUser,
            },
        };
    });
};