import api from "../api/axios";
import type { Faculty, CreateFacultyData, UpdateFacultyData } from "../types/faculty.types";

export const getAllFaculty = async (): Promise<Faculty[]> => {
    const res = await api.get("/faculty");
    return res.data.faculties;
};

export const createFaculty = async (data: CreateFacultyData): Promise<Faculty> => {
    const res = await api.post("/faculty", data);
    return res.data.faculty;
};

export const updateFaculty = async (id: number, data: UpdateFacultyData): Promise<Faculty> => {
    const res = await api.put(`/faculty/${id}`, data);
    return res.data.faculty;
};

export const deleteFaculty = async (id: number): Promise<void> => {
    await api.delete(`/faculty/${id}`);
};