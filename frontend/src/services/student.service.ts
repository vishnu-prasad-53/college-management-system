import api from "../api/axios";

import type { Student, CreateStudentData, UpdateStudentData } from "../types/student.types";

export const getStudents = async () => {
    const response = await api.get("/students");

    return response.data.students as Student[];
};

export const getStudent = async (id: number) => {
    const response = await api.get(`/students/${id}`);

    return response.data.student as Student;
};

export const createStudent = async (data: CreateStudentData) => {
    const response = await api.post("/students", data);

    return response.data.student as Student;
};

export const updateStudent = async (id: number, data: UpdateStudentData) => {
    const response = await api.put(`/students/${id}`, data);

    return response.data.student as Student;
};

export const deleteStudent = async (id: number) => {
    await api.delete(`/students/${id}`);
};