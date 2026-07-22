import axiosInstance from "../api/axios";

import type { Timetable, CreateTimetableData, UpdateTimetableData } from "../types/timetable.types";

export const getAllTimetable = async (): Promise<Timetable[]> => {
    const { data } = await axiosInstance.get("/timetable");
    return data;
};

export const getTimetableById = async (id: number): Promise<Timetable> => {
    const { data } = await axiosInstance.get(`/timetable/${id}`);
    return data;
};

export const createTimetable = async (timetable: CreateTimetableData): Promise<Timetable> => {
    const { data } = await axiosInstance.post("/timetable", timetable);

    return data;
};

export const updateTimetable = async (id: number, timetable: UpdateTimetableData): Promise<Timetable> => {
    const { data } = await axiosInstance.put(`/timetable/${id}`, timetable);

    return data;
};

export const deleteTimetable = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/timetable/${id}`);
};