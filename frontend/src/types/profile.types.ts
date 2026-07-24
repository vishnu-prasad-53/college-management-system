export interface Department {
    id: number;
    name: string;
    code: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface StudentProfile {
    id: number;
    usn: string;
    semester: number;
    section: string;
    phone: string;
    address: string;
    user: User;
    department: Department;
}

export interface UpdateProfileData {
    name: string;
    phone: string;
    address: string;
}