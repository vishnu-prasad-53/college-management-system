import { and, eq } from "drizzle-orm";
import { db, results, students, subjects, faculty, studentSubjects } from "../db/index.js";

import type { CreateResultInput, UpdateResultInput } from "../validators/result.validator.js";

const calculateGrade = (total: number) => {
    if (total >= 90)
        return {
            grade: "O",
            gradePoint: 10,
            status: "Pass",
        };

    if (total >= 80)
        return {
            grade: "A+",
            gradePoint: 9,
            status: "Pass",
        };

    if (total >= 70)
        return {
            grade: "A",
            gradePoint: 8,
            status: "Pass",
        };

    if (total >= 60)
        return {
            grade: "B+",
            gradePoint: 7,
            status: "Pass",
        };

    if (total >= 50)
        return {
            grade: "B",
            gradePoint: 6,
            status: "Pass",
        };

    if (total >= 40)
        return {
            grade: "C",
            gradePoint: 5,
            status: "Pass",
        };

    return {
        grade: "F",
        gradePoint: 0,
        status: "Fail",
    };
};

export const publishResult = async (userId: number, data: CreateResultInput) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, data.subjectId),
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    if (subject.facultyId !== facultyMember.id) {
        throw new Error("You are not assigned to this subject");
    }

    const student = await db.query.students.findFirst({
        where: eq(students.id, data.studentId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const enrolled = await db.query.studentSubjects.findFirst({
        where: and(
            eq(studentSubjects.studentId, student.id),
            eq(studentSubjects.subjectId, subject.id)
        ),
    });

    if (!enrolled) {
        throw new Error("Student is not enrolled for this subject");
    }

    const existing = await db.query.results.findFirst({
        where: and(
            eq(results.studentId, student.id),
            eq(results.subjectId, subject.id)
        ),
    });

    if (existing) {
        throw new Error("Result already published");
    }

    const totalMarks = data.internalMarks + data.examMarks;
    const gradeData = calculateGrade(totalMarks);

    const [result] = await db.insert(results).values({
        studentId: data.studentId,
        subjectId: data.subjectId,
        semester: data.semester,
        internalMarks: data.internalMarks,
        examMarks: data.examMarks,
        totalMarks,
        grade: gradeData.grade,
        gradePoint: gradeData.gradePoint,
        status: gradeData.status,
    }).returning();

    return result;
};

export const updateResult = async (resultId: number, userId: number, data: UpdateResultInput) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const existing = await db.query.results.findFirst({
        where: eq(results.id, resultId),
        with: {
            subject: true,
        },
    });

    if (!existing) {
        throw new Error("Result not found");
    }

    if (existing.subject.facultyId !== facultyMember.id) {
        throw new Error("You can update only your subject results");
    }

    const internalMarks = data.internalMarks ?? existing.internalMarks;
    const examMarks = data.examMarks ?? existing.examMarks;
    const totalMarks = internalMarks + examMarks;
    const gradeData = calculateGrade(totalMarks);

    const [updated] = await db.update(results).set({
        ...(data.studentId && {
            studentId: data.studentId,
        }),
        ...(data.subjectId && {
            subjectId: data.subjectId,
        }),
        ...(data.semester && {
            semester: data.semester,
        }),
        ...(data.internalMarks !== undefined && {
            internalMarks: data.internalMarks,
        }),
        ...(data.examMarks !== undefined && {
            examMarks: data.examMarks,
        }),
        totalMarks,
        grade: gradeData.grade,
        gradePoint: gradeData.gradePoint,
        status: gradeData.status,
    }).where(eq(results.id, resultId)).returning();

    return updated;
};

export const getStudentResults = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    return await db.query.results.findMany({
        where: eq(results.studentId, student.id),
        with: {
            subject: true,
        },
        orderBy: (results, { asc }) => [
            asc(results.semester),
        ],
    });
};

export const getFacultyResults = async (userId: number) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const allResults = await db.query.results.findMany({
        with: {
            subject: true,
            student: {
                with: {
                    user: true,
                },
            },
        },
    });

    return allResults.filter((r) => r.subject.facultyId === facultyMember.id).map((result) => {
        const { password, ...safeUser } = result.student.user;

        return {
            ...result,
            student: {
                ...result.student,
                user: safeUser,
            },
        };
    });
};

export const getAllResults = async () => {
    const allResults = await db.query.results.findMany({
        with: {
            subject: {
                with: { department: true },
            },
            student: {
                with: { user: true },
            },
        },
    });

    return allResults.map((result) => {
        const { password, ...safeUser } = result.student.user;

        return {
            ...result,
            student: {
                ...result.student,
                user: safeUser,
            },
        };
    });
};

export const deleteResult = async (resultId: number, userId: number) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const existing = await db.query.results.findFirst({
        where: eq(results.id, resultId),
        with: { subject: true },
    });

    if (!existing) {
        throw new Error("Result not found");
    }

    if (existing.subject.facultyId !== facultyMember.id) {
        throw new Error("You can delete only your subject results");
    }

    await db.delete(results).where(eq(results.id, resultId));

    return { message: "Result deleted successfully" };
};