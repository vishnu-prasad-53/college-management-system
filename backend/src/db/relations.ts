import { relations } from "drizzle-orm";
import { departments, faculty, students, studentSubjects, subjects, users, attendance, marks, timetable } from "./schema.js";

export const usersRelations = relations(users, ({ one }) => ({
    student: one(students, {
        fields: [users.id],
        references: [students.userId],
    }),
    faculty: one(faculty, {
        fields: [users.id],
        references: [faculty.userId],
    }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
    user: one(users, {
        fields: [students.userId],
        references: [users.id],
    }),
    department: one(departments, {
        fields: [students.departmentId],
        references: [departments.id],
    }),
    studentSubjects: many(studentSubjects),
    attendance: many(attendance),
    marks: many(marks),
}));

export const facultyRelations = relations(faculty, ({ one, many }) => ({
    user: one(users, {
        fields: [faculty.userId],
        references: [users.id],
    }),
    department: one(departments, {
        fields: [faculty.departmentId],
        references: [departments.id],
    }),
    subjects: many(subjects),
    timetable: many(timetable),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
    students: many(students),
    faculty: many(faculty),
    subjects: many(subjects),
    timetable: many(timetable),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
    department: one(departments, {
        fields: [subjects.departmentId],
        references: [departments.id],
    }),
    faculty: one(faculty, {
        fields: [subjects.facultyId],
        references: [faculty.id],
    }),
    studentSubjects: many(studentSubjects),
    attendance: many(attendance),
    marks: many(marks),
    timetable: many(timetable),
}));

export const studentSubjectsRelations = relations(studentSubjects, ({ one }) => ({
    student: one(students, {
        fields: [studentSubjects.studentId],
        references: [students.id],
    }),
    subject: one(subjects, {
        fields: [studentSubjects.subjectId],
        references: [subjects.id],
    }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    student: one(students, {
        fields: [attendance.studentId],
        references: [students.id],
    }),
    subject: one(subjects, {
        fields: [attendance.subjectId],
        references: [subjects.id],
    }),
}));

export const marksRelations = relations(marks, ({ one }) => ({
    student: one(students, {
        fields: [marks.studentId],
        references: [students.id],
    }),
    subject: one(subjects, {
        fields: [marks.subjectId],
        references: [subjects.id],
    }),
}));

export const timetableRelations = relations(timetable, ({ one }) => ({
    department: one(departments, {
        fields: [timetable.departmentId],
        references: [departments.id],
    }),
    subject: one(subjects, {
        fields: [timetable.subjectId],
        references: [subjects.id],
    }),
    faculty: one(faculty, {
        fields: [timetable.facultyId],
        references: [faculty.id],
    }),
}));