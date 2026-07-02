import { and, eq, or } from "drizzle-orm";
import { db, timetable, departments, subjects, faculty, students } from "../db/index.js";
import type { CreateTimetableInput, UpdateTimetableInput } from "../validators/timetable.validator.js";

const checkConflict = async (data: CreateTimetableInput, excludeId?: number) => {
    const conflicts = await db.query.timetable.findMany({
        where: and(
            eq(timetable.dayOfWeek, data.dayOfWeek),
            or(
                eq(timetable.facultyId, data.facultyId),
                and(
                    eq(timetable.departmentId, data.departmentId),
                    eq(timetable.semester, data.semester)
                ),
                eq(timetable.roomNumber, data.roomNumber)
            )
        ),
    });

    const filtered = excludeId ? conflicts.filter((item) => item.id !== excludeId) : conflicts;

    for (const item of filtered) {
        const overlap = data.startTime < item.endTime && data.endTime > item.startTime;

        if (overlap) {
            throw new Error("Timetable conflict detected (Faculty / Semester / Room)");
        }
    }
};

export const createTimetable = async (data: CreateTimetableInput) => {
    const department = await db.query.departments.findFirst({
        where: eq(departments.id, data.departmentId),
    });

    if (!department) {
        throw new Error("Department not found");
    }

    const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, data.subjectId),
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    if (subject.departmentId !== data.departmentId) {
        throw new Error("Subject does not belong to the selected department");
    }

    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.id, data.facultyId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    if (facultyMember.departmentId !== data.departmentId) {
        throw new Error("Faculty does not belong to the selected department");
    }

    if (subject.facultyId !== data.facultyId) {
        throw new Error("Selected faculty is not assigned to this subject");
    }

    await checkConflict(data);

    const [record] = await db.insert(timetable).values(data).returning();

    return record;
};

export const updateTimetable = async (timetableId: number, data: UpdateTimetableInput) => {
    const existing = await db.query.timetable.findFirst({
        where: eq(timetable.id, timetableId),
    });

    if (!existing) {
        throw new Error("Timetable entry not found");
    }

    const updatedData: CreateTimetableInput = {
        departmentId: data.departmentId ?? existing.departmentId,
        subjectId: data.subjectId ?? existing.subjectId,
        facultyId: data.facultyId ?? existing.facultyId,
        semester: data.semester ?? existing.semester,
        dayOfWeek: data.dayOfWeek ?? (existing.dayOfWeek as CreateTimetableInput["dayOfWeek"]),
        startTime: data.startTime ?? existing.startTime,
        endTime: data.endTime ?? existing.endTime,
        roomNumber: data.roomNumber ?? existing.roomNumber,
    };

    const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, updatedData.subjectId),
    });

    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.id, updatedData.facultyId),
    });

    if (!subject) throw new Error("Subject not found");
    if (!facultyMember) throw new Error("Faculty not found");

    if (subject.departmentId !== updatedData.departmentId) {
        throw new Error("Subject does not belong to the selected department");
    }

    if (facultyMember.departmentId !== updatedData.departmentId) {
        throw new Error("Faculty does not belong to the selected department");
    }

    if (subject.facultyId !== updatedData.facultyId) {
        throw new Error("Selected faculty is not assigned to this subject");
    }

    await checkConflict(updatedData, timetableId);

    const [updated] = await db.update(timetable).set(data).where(eq(timetable.id, timetableId)).returning();

    return updated;
};

export const deleteTimetable = async (timetableId: number) => {
    const existing = await db.query.timetable.findFirst({
        where: eq(timetable.id, timetableId),
    });

    if (!existing) {
        throw new Error("Timetable entry not found");
    }

    await db.delete(timetable).where(eq(timetable.id, timetableId));

    return { message: "Timetable deleted successfully" };
};

export const getStudentTimetable = async (userId: number) => {
    const student = await db.query.students.findFirst({
        where: eq(students.userId, userId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const timetableList = await db.query.timetable.findMany({
        where: and(
            eq(timetable.departmentId, student.departmentId),
            eq(timetable.semester, student.semester)
        ),
        with: {
            subject: true,
            faculty: {
                with: {
                    user: true,
                },
            },
            department: true,
        },
        orderBy: (timetable, { asc }) => [
            asc(timetable.dayOfWeek),
            asc(timetable.startTime),
        ],
    });

    return timetableList.map((record) => {
        const { password, ...safeUser } = record.faculty.user;

        return {
            ...record,
            faculty: {
                ...record.faculty,
                user: safeUser,
            },
        };
    });
};

export const getFacultyTimetable = async (userId: number) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    return await db.query.timetable.findMany({
        where: eq(timetable.facultyId, facultyMember.id),
        with: {
            subject: true,
            department: true,
        },
        orderBy: (timetable, { asc }) => [
            asc(timetable.dayOfWeek),
            asc(timetable.startTime),
        ],
    });
};

export const getDepartmentTimetable = async (
    departmentId: number,
    semester: number
) => {
    const timetableList = await db.query.timetable.findMany({
        where: and(
            eq(timetable.departmentId, departmentId),
            eq(timetable.semester, semester)
        ),
        with: {
            subject: true,
            faculty: {
                with: {
                    user: true,
                },
            },
            department: true,
        },
        orderBy: (timetable, { asc }) => [
            asc(timetable.dayOfWeek),
            asc(timetable.startTime),
        ],
    });

    return timetableList.map((record) => {
        const { password, ...safeUser } = record.faculty.user;

        return {
            ...record,
            faculty: {
                ...record.faculty,
                user: safeUser,
            },
        };
    });
};