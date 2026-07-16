export interface Faculty {
    id: number;
    userId: number;
    departmentId: number;
    designation: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    department: {
        id: number;
        name: string;
        code: string;
    };
}

export interface CreateFacultyData {
    name: string;
    email: string;
    departmentId: number;
    designation: string;
}

export interface UpdateFacultyData {
    departmentId: number;
    designation: string;
}