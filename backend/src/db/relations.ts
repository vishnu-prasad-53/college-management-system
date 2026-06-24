import { relations } from "drizzle-orm";
import { departments, faculty, students, studentSubjects, subjects, users } from "./schema.js";

export const usersRelations = relations(users, ({ one }) => ({
        student: one(students),
        faculty: one(faculty),
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
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
    students: many(students),
    faculty: many(faculty),
    subjects: many(subjects),
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