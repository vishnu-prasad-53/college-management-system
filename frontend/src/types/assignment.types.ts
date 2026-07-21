export interface Subject {
    id: number;
    name: string;
    code: string;
}

export interface Faculty {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export interface Assignment {
    id: number;
    subjectId: number;
    facultyId: number;
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number;
    createdAt: string;
    updatedAt: string;
    subject: Subject;
    faculty: Faculty;
}

export interface CreateAssignmentData {
    subjectId: number;
    facultyId: number;
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number;
}

export interface UpdateAssignmentData {
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number;
}