import { pgTable, serial, integer, text, varchar, timestamp, real, primaryKey, date, pgEnum, unique, time } from "drizzle-orm/pg-core";
import { UserRole } from "../types/user.types.js";

const timestamps = () => ({
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
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
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
    departmentId: integer("department_id").references(() => departments.id, { onDelete: "cascade" }).notNull(),
    usn: varchar("usn", { length: 10 }).notNull().unique(),
    semester: integer("semester").notNull(),
    cgpa: real("cgpa").notNull(),
    ...timestamps(),
});

export const faculty = pgTable("faculty", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
    departmentId: integer("department_id").references(() => departments.id, { onDelete: "cascade" }).notNull(),
    designation: varchar("designation", { length: 30 }).notNull(),
    ...timestamps(),
});

export const subjects = pgTable("subjects", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull().unique(),
    semester: integer("semester").notNull(),
    credits: integer("credits").notNull(),
    departmentId: integer("department_id").references(() => departments.id, { onDelete: "cascade" }).notNull(),
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

export const marks = pgTable("marks", {
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

export const timetable = pgTable("timetable", {
    id: serial("id").primaryKey(),
    departmentId: integer("department_id").notNull().references(() => departments.id, { onDelete: "cascade" }),
    subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    facultyId: integer("faculty_id").notNull().references(() => faculty.id, { onDelete: "cascade" }),
    semester: integer("semester").notNull(),
    dayOfWeek: varchar("day_of_week", { length: 20 }).notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    roomNumber: varchar("room_number", { length: 20 }).notNull(),
    ...timestamps(),
});

export const leaveStatusEnum = pgEnum("leave_status", [
    "pending",
    "approved",
    "rejected",
]);

export const leaveRequests = pgTable("leave_requests", {
    id: serial("id").primaryKey(),
    facultyId: integer("faculty_id").notNull().references(() => faculty.id, { onDelete: "cascade" }),
    leaveType: varchar("leave_type", { length: 30 }).notNull(),
    reason: text("reason").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    status: leaveStatusEnum("status").notNull().default("pending"),
    adminRemarks: text("admin_remarks"),
    ...timestamps(),
});

export const noticeTargetRoleEnum = pgEnum("notice_target_role", [
    "all",
    "student",
    "faculty",
]);

export const notices = pgTable("notices", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 150 }).notNull(),
    content: text("content").notNull(),
    targetRole: noticeTargetRoleEnum("target_role").notNull().default("all"),
    publishedAt: timestamp("published_at").defaultNow().notNull(),
    expiryDate: date("expiry_date"),
    ...timestamps(),
});

export const assignments = pgTable("assignments", {
    id: serial("id").primaryKey(),
    subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    facultyId: integer("faculty_id").notNull().references(() => faculty.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 150 }).notNull(),
    description: text("description").notNull(),
    dueDate: date("due_date").notNull(),
    maxMarks: integer("max_marks").notNull(),
    ...timestamps(),
});

export const submissionStatusEnum = pgEnum("submission_status", [
    "submitted",
    "graded",
]);

export const assignmentSubmissions = pgTable("assignment_submissions", {
    id: serial("id").primaryKey(),
    assignmentId: integer("assignment_id").notNull().references(() => assignments.id, { onDelete: "cascade" }),
    studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
    submissionText: text("submission_text"),
    submissionLink: text("submission_link"),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    marksObtained: integer("marks_obtained"),
    feedback: text("feedback"),
    status: submissionStatusEnum("status").default("submitted").notNull(),
    ...timestamps(),
}, (table) => ({
    assignmentStudentUnique: unique().on(
        table.assignmentId,
        table.studentId
    ),
}));

export const examTypeEnum = pgEnum("exam_type", [
    "internal",
    "midterm",
    "end_semester",
    "practical",
    "viva",
]);

export const exams = pgTable("exams", {
    id: serial("id").primaryKey(),
    subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    examType: examTypeEnum("exam_type").notNull(),
    examDate: date("exam_date").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    room: varchar("room", { length: 30 }).notNull(),
    totalMarks: integer("total_marks").notNull(),
    ...timestamps(),
});

export const results = pgTable("results", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
    subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    semester: integer("semester").notNull(),
    internalMarks: integer("internal_marks").notNull(),
    examMarks: integer("exam_marks").notNull(),
    totalMarks: integer("total_marks").notNull(),
    grade: varchar("grade", { length: 5 }).notNull(),
    gradePoint: real("grade_point").notNull(),
    status: varchar("status", { length: 10 }).notNull(),
    ...timestamps(),
});

export const announcements = pgTable("announcements", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    postedBy: integer("posted_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    departmentId: integer("department_id").references(() => departments.id, { onDelete: "set null" }),
    audience: varchar("audience", { length: 20 }).notNull(),
    priority: varchar("priority", { length: 20 }).notNull(),
    expiryDate: date("expiry_date"),
    ...timestamps(),
});