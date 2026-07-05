import { and, eq } from "drizzle-orm";
import { db, assignments, assignmentSubmissions, faculty, students, studentSubjects } from "../db/index.js";

import type { CreateAssignmentSubmissionInput, GradeAssignmentInput } from "../validators/assignmentSubmission.validator.js";

export const submitAssignment = async (userId: number, data: CreateAssignmentSubmissionInput) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const assignment = await db.query.assignments.findFirst({
        where: eq(assignments.id, data.assignmentId),
    });

    if (!assignment) {
        throw new Error("Assignment not found");
    }

    const enrolled = await db.query.studentSubjects.findFirst({
        where: and(
            eq(studentSubjects.studentId, student.id),
            eq(studentSubjects.subjectId, assignment.subjectId)
        ),
    });

    if (!enrolled) {
        throw new Error("You are not enrolled for this subject");
    }

    const alreadySubmitted = await db.query.assignmentSubmissions.findFirst({
        where: and(
            eq(
                assignmentSubmissions.assignmentId,
                assignment.id
            ),
            eq(
                assignmentSubmissions.studentId,
                student.id
            )
        ),
    });

    if (alreadySubmitted) {
        throw new Error("Assignment already submitted");
    }

    const today = new Date().toISOString().split("T")[0];

    if (today > assignment.dueDate) {
        throw new Error("Assignment submission deadline has passed");
    }

    const [submission] = await db.insert(assignmentSubmissions).values({
        assignmentId: assignment.id,
        studentId: student.id,
        submissionText: data.submissionText,
        submissionLink: data.submissionLink,
    }).returning();

    return submission;
};

export const getMySubmissions = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    return await db.query.assignmentSubmissions.findMany({
        where: eq(
            assignmentSubmissions.studentId,
            student.id
        ),
        with: {
            assignment: {
                with: {
                    subject: true,
                },
            },
        },
    });
};

export const getAssignmentSubmissions = async (assignmentId: number, userId: number) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const assignment = await db.query.assignments.findFirst({
        where: eq(assignments.id, assignmentId),
    });

    if (!assignment) {
        throw new Error("Assignment not found");
    }

    if (assignment.facultyId !== facultyMember.id) {
        throw new Error("You can only view submissions of your assignments");
    }

    const submissions = await db.query.assignmentSubmissions.findMany({
        where: eq(assignmentSubmissions.assignmentId, assignmentId),
        with: {
            student: {
                with: {
                    user: true,
                },
            },
        },
    });

    return submissions.map((submission) => {
        const { password, ...safeUser } = submission.student.user;

        return {
            ...submission,
            student: {
                ...submission.student,
                user: safeUser,
            },
        };
    });
};

export const gradeSubmission = async (submissionId: number, userId: number, data: GradeAssignmentInput) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const submission = await db.query.assignmentSubmissions.findFirst({
        where: eq(
            assignmentSubmissions.id,
            submissionId
        ),
        with: {
            assignment: true,
        },
    });

    if (!submission) {
        throw new Error("Submission not found");
    }

    if (submission.assignment.facultyId !== facultyMember.id) {
        throw new Error("You can only grade your own assignments");
    }

    if (data.marksObtained > submission.assignment.maxMarks) {
        throw new Error(`Maximum marks allowed is ${submission.assignment.maxMarks}`);
    }

    const [updated] = await db.update(assignmentSubmissions).set({
        marksObtained: data.marksObtained,
        feedback: data.feedback,
        status: "graded",
    }).where(eq(assignmentSubmissions.id, submissionId)).returning();

    return updated;
};

export const getAllSubmissions = async () => {
    const submissions = await db.query.assignmentSubmissions.findMany({
        with: {
            assignment: {
                with: {
                    subject: true,
                },
            },
            student: {
                with: {
                    user: true,
                },
            },
        },
    });

    return submissions.map((submission) => {
        const { password, ...safeUser } = submission.student.user;

        return {
            ...submission,
            student: {
                ...submission.student,
                user: safeUser,
            },
        };
    });
};