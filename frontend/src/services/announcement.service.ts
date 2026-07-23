import axiosInstance from "../api/axios";

import type { Announcement, CreateAnnouncementData, UpdateAnnouncementData } from "../types/announcement.types";

export const getAllAnnouncements = async (): Promise<Announcement[]> => {
    const { data } = await axiosInstance.get("/announcements");
    return data;
};

export const getAnnouncementById = async (id: number): Promise<Announcement> => {
    const { data } = await axiosInstance.get(`/announcements/${id}`);
    return data;
};

export const createAnnouncement = async (announcement: CreateAnnouncementData): Promise<Announcement> => {
    const { data } = await axiosInstance.post("/announcements", announcement);

    return data;
};

export const updateAnnouncement = async (id: number, announcement: UpdateAnnouncementData): Promise<Announcement> => {
    const { data } = await axiosInstance.put(`/announcements/${id}`, announcement);

    return data;
};

export const deleteAnnouncement = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/announcements/${id}`);
};