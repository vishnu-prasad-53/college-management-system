export type Student = {
    id: number;
    userId: number;
    departmentId: number;
    usn: string;
    semester: number;
    cgpa: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: "student";
        createdAt: string;
        updatedAt: string;
    };
    department: {
        id: number;
        name: string;
        code: string;
        createdAt: string;
        updatedAt: string;
    };
};

export type CreateStudentData = {
    name: string;
    email: string;
    departmentId: number;
    usn: string;
    semester: number;
    cgpa: number;
};

export type UpdateStudentData = {
    departmentId?: number;
    usn?: string;
    semester?: number;
    cgpa?: number;
};