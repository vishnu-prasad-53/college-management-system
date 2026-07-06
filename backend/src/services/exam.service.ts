import { eq } from "drizzle-orm";
import { db, exams, subjects, faculty, students, studentSubjects } from "../db/index.js";

import type { CreateExamInput, UpdateExamInput } from "../validators/exam.validator.js";

export const createExam = async (userId: number, data: CreateExamInput) => {
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

    const [exam] = await db.insert(exams).values({
        subjectId: data.subjectId,
        examType: data.examType,
        examDate: data.examDate instanceof Date ? data.examDate.toISOString().split("T")[0] : data.examDate,
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room,
        totalMarks: data.totalMarks,
    }).returning();

    return exam;
};

export const updateExam = async (examId: number, userId: number, data: UpdateExamInput) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const existing = await db.query.exams.findFirst({
        where: eq(exams.id, examId),
        with: {
            subject: true,
        },
    });

    if (!existing) {
        throw new Error("Exam not found");
    }

    if (existing.subject.facultyId !== facultyMember.id) {
        throw new Error("You can update only your exams");
    }

    const [updated] = await db.update(exams).set({
        ...(data.subjectId && { subjectId: data.subjectId }),
        ...(data.examType && { examType: data.examType }),
        ...(data.examDate && {
            examDate: data.examDate instanceof Date ? data.examDate.toISOString().split("T")[0] : data.examDate,
        }),
        ...(data.startTime && { startTime: data.startTime }),
        ...(data.endTime && { endTime: data.endTime }),
        ...(data.room && { room: data.room }),
        ...(data.totalMarks && { totalMarks: data.totalMarks }),
    }).where(eq(exams.id, examId)).returning();

    return updated;
};

export const deleteExam = async (examId: number, userId: number) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const existing = await db.query.exams.findFirst({
        where: eq(exams.id, examId),
        with: {
            subject: true,
        },
    });

    if (!existing) {
        throw new Error("Exam not found");
    }

    if (existing.subject.facultyId !== facultyMember.id) {
        throw new Error("You can delete only your exams");
    }

    await db.delete(exams).where(eq(exams.id, examId));

    return { message: "Exam deleted successfully" };
};

export const getFacultyExams = async (userId: number) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const examsList = await db.query.exams.findMany({
        with: {
            subject: true,
        },
        orderBy: (exams, { asc }) => [
            asc(exams.examDate),
            asc(exams.startTime),
        ],
    });

    return examsList.filter(
        (exam) => exam.subject.facultyId === facultyMember.id
    );
};

export const getStudentExams = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const enrolled = await db.query.studentSubjects.findMany({
        where: eq(studentSubjects.studentId, student.id),
    });

    const subjectIds = enrolled.map((e) => e.subjectId);

    return await db.query.exams.findMany({
        with: {
            subject: true,
        },
        where: (exams, { inArray }) => inArray(exams.subjectId, subjectIds),
        orderBy: (exams, { asc }) => [
            asc(exams.examDate),
            asc(exams.startTime),
        ],
    });
};

export const getAllExams = async () => {
    return await db.query.exams.findMany({
        with: {
            subject: {
                with: {
                    faculty: {
                        with: {
                            user: true,
                        },
                    },
                    department: true,
                },
            },
        },
        orderBy: (exams, { asc }) => [
            asc(exams.examDate),
            asc(exams.startTime),
        ],
    });
};