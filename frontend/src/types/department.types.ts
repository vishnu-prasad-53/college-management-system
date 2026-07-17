export interface Department {
    id: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDepartmentData {
    name: string;
    code: string;
}

export interface UpdateDepartmentData {
    name?: string;
    code?: string;
}