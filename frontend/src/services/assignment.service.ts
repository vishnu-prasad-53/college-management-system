import api from "../api/axios";

import type { Assignment, CreateAssignmentData, UpdateAssignmentData } from "../types/assignment.types";

export const getAllAssignments = async (): Promise<Assignment[]> => {
    const { data } = await api.get("/assignments");
    return data;
};

export const getAssignmentById = async (id: number): Promise<Assignment> => {
    const { data } = await api.get(`/assignments/${id}`);
    return data;
};

export const createAssignment = async (assignment: CreateAssignmentData): Promise<Assignment> => {
    const { data } = await api.post("/assignments", assignment);

    return data;
};

export const updateAssignment = async (id: number, assignment: UpdateAssignmentData): Promise<Assignment> => {
    const { data } = await api.put(`/assignments/${id}`, assignment);

    return data;
};

export const deleteAssignment = async (id: number): Promise<void> => {
    await api.delete(`/assignments/${id}`);
};