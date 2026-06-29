import { db, attendance, students, subjects, studentSubjects } from "../db/index.js";
import { and, eq } from "drizzle-orm";

export const markAttendance = async (studentId: number, subjectId: number, date: string, status: "present" | "absent") => {
    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId)
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
            eq(studentSubjects.subjectId, subjectId)
        ),
    });

    if (!enrollment) {
        throw new Error("Student is not enrolled in this subject");
    }

    const existingAttendance = await db.query.attendance.findFirst({
        where: and(
            eq(attendance.studentId, studentId),
            eq(attendance.subjectId, subjectId),
            eq(attendance.date, date),
        )
    });

    if (existingAttendance) {
        throw new Error("Attendance already marked for this date");
    }

    const newAttendance = await db.insert(attendance).values({
        studentId,
        subjectId,
        date,
        status,
    }).returning();

    return newAttendance[0];
};

export const getMyAttendance = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student profile not found");
    }

    const attendanceList = await db.query.attendance.findMany({
        where: eq(attendance.studentId, student.id),
        orderBy: (attendance, { desc }) => [desc(attendance.date)],
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

    return attendanceList.map((record) => {
        if (!record.subject.faculty) {
            return record;
        }

        const { password, ...safeUser } = record.subject.faculty.user;

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

export const getAttendanceBySubject = async (subjectId: number) => {
    const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, subjectId),
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    const attendanceList = await db.query.attendance.findMany({
        where: eq(attendance.subjectId, subjectId),
        orderBy: (attendance, { desc }) => [desc(attendance.date)],
        with: {
            student: {
                with: {
                    user: true,
                    department: true,
                },
            },
        },
    });

    if (attendanceList.length === 0) {
        throw new Error("No attendance records found");
    }

    return attendanceList.map((record) => {
        const { password, ...safeUser } = record.student.user;

        return {
            ...record,
            student: {
                ...record.student,
                user: safeUser,
            },
        };
    });
};