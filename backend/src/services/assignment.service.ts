import { eq } from "drizzle-orm";
import { db, assignments, subjects, faculty, students, studentSubjects } from "../db/index.js";
import type { CreateAssignmentInput, UpdateAssignmentInput } from "../validators/assignment.validator.js";

export const createAssignment = async (userId: number, data: CreateAssignmentInput) => {
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

    const [assignment] = await db.insert(assignments).values({
        facultyId: facultyMember.id,
        subjectId: data.subjectId,
        title: data.title,
        description: data.description,
        dueDate:
            data.dueDate instanceof Date
                ? data.dueDate.toISOString().split("T")[0]
                : data.dueDate,
        maxMarks: data.maxMarks,
    }).returning();

    return assignment;
};

export const updateAssignment = async (assignmentId: number, userId: number, data: UpdateAssignmentInput) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const existing = await db.query.assignments.findFirst({
        where: eq(assignments.id, assignmentId),
        with: {
            subject: true,
        },
    });

    if (!existing) {
        throw new Error("Assignment not found");
    }

    if (existing.subject.facultyId !== facultyMember.id) {
        throw new Error("You can update only your assignments");
    }

    const [updated] = await db.update(assignments).set({
        ...(data.subjectId && { subjectId: data.subjectId }),
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.maxMarks && { maxMarks: data.maxMarks }),
        ...(data.dueDate && {
            dueDate:
                data.dueDate instanceof Date
                    ? data.dueDate.toISOString().split("T")[0]
                    : data.dueDate,
        }),
    }).where(eq(assignments.id, assignmentId)).returning();

    return updated;
};

export const deleteAssignment = async (assignmentId: number, userId: number) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const existing = await db.query.assignments.findFirst({
        where: eq(assignments.id, assignmentId),
        with: {
            subject: true,
        },
    });

    if (!existing) {
        throw new Error("Assignment not found");
    }

    if (existing.subject.facultyId !== facultyMember.id) {
        throw new Error("You can delete only your assignments");
    }

    await db.delete(assignments).where(eq(assignments.id, assignmentId));

    return {
        message: "Assignment deleted successfully",
    };
};

export const getFacultyAssignments = async (userId: number) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    return await db.query.assignments.findMany({
        with: {
            subject: true,
        },
        where: eq(subjects.facultyId, facultyMember.id),
        orderBy: (assignments, { desc }) => [
            desc(assignments.createdAt),
        ],
    });
};

export const getStudentAssignments = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const enrolledSubjects = await db.query.studentSubjects.findMany({
        where: eq(studentSubjects.studentId, student.id),
    });

    const subjectIds = enrolledSubjects.map((s) => s.subjectId);

    return await db.query.assignments.findMany({
        with: {
            subject: true,
        },
        where: (assignments, { inArray }) =>
            inArray(assignments.subjectId, subjectIds),
        orderBy: (assignments, { asc }) => [
            asc(assignments.dueDate),
        ],
    });
};

export const getAllAssignments = async () => {
    return await db.query.assignments.findMany({
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
        orderBy: (assignments, { desc }) => [
            desc(assignments.createdAt),
        ],
    });
};