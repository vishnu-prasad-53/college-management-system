import { sql, eq } from "drizzle-orm";
import { db, students, faculty, departments, subjects, attendance, marks } from "../db/index.js";

export const getOverview = async () => {
    const [
        [{ totalStudents }],
        [{ totalFaculty }],
        [{ totalDepartments }],
        [{ totalSubjects }],
    ] = await Promise.all([
        db.select({
            totalStudents: sql<number>`count(*)`,
        }).from(students),
        db.select({
            totalFaculty: sql<number>`count(*)`,
        }).from(faculty),
        db.select({
            totalDepartments: sql<number>`count(*)`,
        }).from(departments),
        db.select({
            totalSubjects: sql<number>`count(*)`,
        }).from(subjects),
    ]);

    return {
        totalStudents: Number(totalStudents),
        totalFaculty: Number(totalFaculty),
        totalDepartments: Number(totalDepartments),
        totalSubjects: Number(totalSubjects),
    };
};

export const getStudentStatistics = async () => {
    const studentsByDepartment = await db.select({
        departmentId: departments.id,
        department: departments.name,
        totalStudents: sql<number>`count(${students.id})`,
    }).from(departments).leftJoin(students, eq(students.departmentId, departments.id)).groupBy(departments.id, departments.name);

    const studentsBySemester = await db.select({
        semester: students.semester,
        totalStudents: sql<number>`count(*)`,
    }).from(students).groupBy(students.semester).orderBy(students.semester);

    return {
        studentsByDepartment: studentsByDepartment.map((item) => ({
            ...item,
            totalStudents: Number(item.totalStudents),
        })),
        studentsBySemester: studentsBySemester.map((item) => ({
            ...item,
            totalStudents: Number(item.totalStudents),
        })),
    };
};

export const getFacultyStatistics = async () => {
    const facultyByDepartment = await db.select({
        departmentId: departments.id,
        department: departments.name,
        totalFaculty: sql<number>`count(${faculty.id})`,
    }).from(departments).leftJoin(faculty, eq(faculty.departmentId, departments.id)).groupBy(departments.id, departments.name);

    return {
        facultyByDepartment: facultyByDepartment.map((item) => ({
            ...item,
            totalFaculty: Number(item.totalFaculty),
        })),
    };
};

export const getAttendanceStatistics = async () => {
    const [{ presentCount }] = await db.select({
        presentCount: sql<number>`count(*)`,
    }).from(attendance).where(sql`${attendance.status} = 'present'`);

    const [{ absentCount }] = await db.select({
        absentCount: sql<number>`count(*)`,
    }).from(attendance).where(sql`${attendance.status} = 'absent'`);

    const present = Number(presentCount);
    const absent = Number(absentCount);

    const total = present + absent;

    return {
        presentCount: present,
        absentCount: absent,
        overallAttendance:
            total === 0 ? 0 : Number(((present / total) * 100).toFixed(2)),
    };
};

export const getMarksStatistics = async () => {
    const [stats] = await db.select({
        averageMarks: sql<number>`avg(${marks.totalMarks})`,
        highestMarks: sql<number>`max(${marks.totalMarks})`,
        lowestMarks: sql<number>`min(${marks.totalMarks})`,
    }).from(marks);

    return {
        averageMarks: Number(Number(stats.averageMarks ?? 0).toFixed(2)),
        highestMarks: Number(stats.highestMarks ?? 0),
        lowestMarks: Number(stats.lowestMarks ?? 0),
    };
};

export const getRecentActivity = async () => {
    const [recentStudents, recentAttendance, recentMarks] = await Promise.all([
        db.query.students.findMany({
            orderBy: (students, { desc }) => [desc(students.createdAt)],
            limit: 5,
            with: {
                user: true,
                department: true,
            },
        }),

        db.query.attendance.findMany({
            orderBy: (attendance, { desc }) => [desc(attendance.createdAt)],
            limit: 5,
            with: {
                student: {
                    with: {
                        user: true,
                    },
                },
                subject: true,
            },
        }),

        db.query.marks.findMany({
            orderBy: (marks, { desc }) => [desc(marks.createdAt)],
            limit: 5,
            with: {
                student: {
                    with: {
                        user: true,
                    },
                },
                subject: true,
            },
        }),
    ]);

    const safeStudents = recentStudents.map((student) => {
        const { password, ...safeUser } = student.user;

        return {
            ...student,
            user: safeUser,
        };
    });

    const safeAttendance = recentAttendance.map((record) => {
        const { password, ...safeUser } = record.student.user;

        return {
            ...record,
            student: {
                ...record.student,
                user: safeUser,
            },
        };
    });

    const safeMarks = recentMarks.map((record) => {
        const { password, ...safeUser } = record.student.user;

        return {
            ...record,
            student: {
                ...record.student,
                user: safeUser,
            },
        };
    });

    return {
        recentStudents: safeStudents,
        recentAttendance: safeAttendance,
        recentMarks: safeMarks,
    };
};