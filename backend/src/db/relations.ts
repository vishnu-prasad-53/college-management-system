import { relations } from "drizzle-orm";
import { departments, faculty, students, studentSubjects, subjects, users, attendance, marks, timetable, leaveRequests, assignments, assignmentSubmissions, exams, results, announcements } from "./schema.js";
import { departments, faculty, students, studentSubjects, subjects, users, attendance, marks, timetable, leaveRequests, assignments, assignmentSubmissions, exams, results, borrowedBooks, books } from "./schema.js";

export const usersRelations = relations(users, ({ one, many }) => ({
    student: one(students, {
        fields: [users.id],
        references: [students.userId],
    }),
    faculty: one(faculty, {
        fields: [users.id],
        references: [faculty.userId],
    }),
    announcements: many(announcements),
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
    submissions: many(assignmentSubmissions),
    results: many(results),
    borrowedBooks: many(borrowedBooks),
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
    leaveRequests: many(leaveRequests),
    assignments: many(assignments),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
    students: many(students),
    faculty: many(faculty),
    subjects: many(subjects),
    timetable: many(timetable),
    announcements: many(announcements),
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
    assignments: many(assignments),
    exams: many(exams),
    results: many(results),
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

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
    faculty: one(faculty, {
        fields: [leaveRequests.facultyId],
        references: [faculty.id],
    }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
    subject: one(subjects, {
        fields: [assignments.subjectId],
        references: [subjects.id],
    }),
    faculty: one(faculty, {
        fields: [assignments.facultyId],
        references: [faculty.id],
    }),
    submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
    assignment: one(assignments, {
        fields: [assignmentSubmissions.assignmentId],
        references: [assignments.id],
    }),

    student: one(students, {
        fields: [assignmentSubmissions.studentId],
        references: [students.id],
    }),
}));

export const examsRelations = relations(exams, ({ one }) => ({
    subject: one(subjects, {
        fields: [exams.subjectId],
        references: [subjects.id],
    }),
}));

export const resultsRelations = relations(results, ({ one }) => ({
    student: one(students, {
        fields: [results.studentId],
        references: [students.id],
    }),

    subject: one(subjects, {
        fields: [results.subjectId],
        references: [subjects.id],
    }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
    user: one(users, {
        fields: [announcements.postedBy],
        references: [users.id],
    }),

    department: one(departments, {
        fields: [announcements.departmentId],
        references: [departments.id],
export const booksRelations = relations(books, ({ many }) => ({
    borrowedBooks: many(borrowedBooks),
}));

export const borrowedBooksRelations = relations(borrowedBooks, ({ one }) => ({
    student: one(students, {
        fields: [borrowedBooks.studentId],
        references: [students.id],
    }),

    book: one(books, {
        fields: [borrowedBooks.bookId],
        references: [books.id],
    }),
}));