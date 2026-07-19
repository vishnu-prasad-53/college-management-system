export type AttendanceStatus = "present" | "absent";

export interface Student {
    id: number;
    usn: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export interface Subject {
    id: number;
    name: string;
    code: string;
}

export interface Attendance {
    id: number;
    studentId: number;
    subjectId: number;
    date: string;
    status: AttendanceStatus;
    createdAt: string;
    updatedAt: string;
    student: Student;
    subject: Subject;
}

export interface CreateAttendanceData {
    studentId: number;
    subjectId: number;
    date: string;
    status: AttendanceStatus;
}

export interface UpdateAttendanceData {
    date: string;
    status: AttendanceStatus;
}