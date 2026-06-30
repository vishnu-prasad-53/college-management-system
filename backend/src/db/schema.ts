import { pgTable, serial, integer, text, varchar, timestamp, real, primaryKey, date, pgEnum, unique } from "drizzle-orm/pg-core";
import { UserRole } from "../types/user.types.js";

const timestamps = () => ({
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role").$type<UserRole>().notNull().default("student"),
    ...timestamps(),
});

export const departments = pgTable("departments", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull().unique(),
    ...timestamps(),
});

export const students = pgTable("students", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade"}).notNull().unique(),
    departmentId: integer("department_id").references(() => departments.id, { onDelete: "cascade"}).notNull(),
    usn: varchar("usn", { length: 10 }).notNull().unique(),
    semester: integer("semester").notNull(),
    cgpa: real("cgpa").notNull(),
    ...timestamps(),
});

export const faculty = pgTable("faculty", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade"}).notNull().unique(),
    departmentId: integer("department_id").references(() => departments.id, { onDelete: "cascade"}).notNull(),
    designation: varchar("designation", { length: 30 }).notNull(),
    ...timestamps(),
});

export const subjects = pgTable("subjects", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull().unique(),
    semester: integer("semester").notNull(),
    credits: integer("credits").notNull(),
    departmentId: integer("department_id").references(() => departments.id, { onDelete: "cascade"}).notNull(),
    facultyId: integer("faculty_id").references(() => faculty.id, { onDelete: "set null" }),
    ...timestamps(),
});

export const studentSubjects = pgTable("student_subjects", {
    studentId: integer("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
    subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "cascade" }).notNull(),
}, (table) => ({
    pk: primaryKey({
        columns: [table.studentId, table.subjectId],
    }),
}));

export const attendanceStatusEnum = pgEnum("attendance_status", [
    "present",
    "absent",
]);

export const attendance = pgTable("attendance", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
    subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    status: attendanceStatusEnum("status").notNull(),
    ...timestamps(),
});

export const gradeEnum = pgEnum("grade", [
    "A+",
    "A",
    "B+",
    "B",
    "C",
    "D",
    "F",
]);

export const marks = pgTable("marks",{
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
    subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    internalMarks: integer("internal_marks").notNull(),
    externalMarks: integer("external_marks").notNull(),
    totalMarks: integer("total_marks").notNull(),
    grade: gradeEnum("grade").notNull(),
    ...timestamps(),
}, (table) => ({
    studentSubjectUnique: unique().on(table.studentId, table.subjectId),
}));