import { relations } from "drizzle-orm";
import { pgTable, serial, integer, text, varchar, timestamp, real, primaryKey } from "drizzle-orm/pg-core";

export type UserRole = "student" | "faculty" | "hod" | "admin";

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