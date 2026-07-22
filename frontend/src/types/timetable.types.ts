export interface Department {
    id: number;
    name: string;
    code: string;
}

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

export interface Timetable {
    id: number;
    departmentId: number;
    subjectId: number;
    facultyId: number;
    semester: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    roomNumber: string;
    createdAt: string;
    updatedAt: string;
    department: Department;
    subject: Subject;
    faculty: Faculty;
}

export interface CreateTimetableData {
    departmentId: number;
    subjectId: number;
    facultyId: number;
    semester: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    roomNumber: string;
}

export interface UpdateTimetableData {
    semester: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    roomNumber: string;
}