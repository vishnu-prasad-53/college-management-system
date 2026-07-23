export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Department {
    id: number;
    name: string;
    code: string;
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    postedBy: number;
    departmentId: number | null;
    audience: string;
    priority: string;
    expiryDate: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
    department: Department | null;
}

export interface CreateAnnouncementData {
    title: string;
    content: string;
    postedBy: number;
    departmentId: number | null;
    audience: string;
    priority: string;
    expiryDate: string | null;
}

export interface UpdateAnnouncementData {
    title: string;
    content: string;
    departmentId: number | null;
    audience: string;
    priority: string;
    expiryDate: string | null;
}