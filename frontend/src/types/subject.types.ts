export interface Department {
    id: number;
    name: string;
    code: string;
}

export interface FacultyUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface Faculty {
    id: number;
    designation: string;
    user: FacultyUser;
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    semester: number;
    credits: number;
    departmentId: number;
    facultyId: number | null;
    createdAt: string;
    updatedAt: string;
    department: Department;
    faculty: Faculty | null;
}

export interface CreateSubjectData {
    name: string;
    code: string;
    semester: number;
    credits: number;
    departmentId: number;
    facultyId: number | null;
}

export interface UpdateSubjectData extends CreateSubjectData {}