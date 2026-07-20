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

export interface Marks {
    id: number;

    studentId: number;
    subjectId: number;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: string;
    createdAt: string;
    updatedAt: string;
    student: Student;
    subject: Subject;
}

export interface CreateMarksData {
    studentId: number;
    subjectId: number;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: string;
}

export interface UpdateMarksData {
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: string;
}