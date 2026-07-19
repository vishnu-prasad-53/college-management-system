import api from "../api/axios";

import type { Attendance, CreateAttendanceData, UpdateAttendanceData } from "../types/attendance.types";

export const getAllAttendance = async (): Promise<Attendance[]> => {
    const { data } = await api.get("/attendance");
    return data;
};

export const getAttendanceById = async (id: number): Promise<Attendance> => {
    const { data } = await api.get(`/attendance/${id}`);
    return data;
};

export const createAttendance = async (attendance: CreateAttendanceData): Promise<Attendance> => {
    const { data } = await api.post("/attendance", attendance);

    return data;
};

export const updateAttendance = async (id: number, attendance: UpdateAttendanceData): Promise<Attendance> => {
    const { data } = await api.put(`/attendance/${id}`, attendance);

    return data;
};

export const deleteAttendance = async (id: number): Promise<void> => {
    await api.delete(`/attendance/${id}`);
};