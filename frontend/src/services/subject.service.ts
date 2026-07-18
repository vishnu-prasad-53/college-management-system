import api from "../api/axios";
import type { Subject, CreateSubjectData, UpdateSubjectData } from "../types/subject.types";

export const getSubjects = async (): Promise<Subject[]> => {
    const response = await api.get("/subjects");
    return response.data.subjects;
};

export const getSubjectById = async (id: number): Promise<Subject> => {
    const response = await api.get(`/subjects/${id}`);
    return response.data.subject;
};

export const createSubject = async (data: CreateSubjectData): Promise<Subject> => {
    const response = await api.post("/subjects", data);
    return response.data.subject;
};

export const updateSubject = async (id: number, data: UpdateSubjectData): Promise<Subject> => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data.subject;
};

export const deleteSubject = async (id: number): Promise<void> => {
    await api.delete(`/subjects/${id}`);
};