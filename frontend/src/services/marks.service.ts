import axiosInstance from "../api/axios";

import type { Marks, CreateMarksData, UpdateMarksData } from "../types/marks.types";

export const getAllMarks = async (): Promise<Marks[]> => {
    const { data } = await axiosInstance.get("/marks");
    return data;
};

export const getMarksById = async (id: number): Promise<Marks> => {
    const { data } = await axiosInstance.get(`/marks/${id}`);
    return data;
};

export const createMarks = async (marks: CreateMarksData): Promise<Marks> => {
    const { data } = await axiosInstance.post("/marks", marks);

    return data;
};

export const updateMarks = async (id: number, marks: UpdateMarksData): Promise<Marks> => {
    const { data } = await axiosInstance.put(`/marks/${id}`, marks);

    return data;
};

export const deleteMarks = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/marks/${id}`);
};