import { Request, Response } from "express";

import { createAnnouncement, updateAnnouncement, deleteAnnouncement, getMyAnnouncements, getAllAnnouncements, getAnnouncementById } from "../services/announcement.service.js";

export const createAnnouncementController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const announcement = await createAnnouncement(userId, req.body);

        res.status(201).json({ success: true, message: "Announcement created successfully", data: announcement });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to create announcement" });
    }
};

export const updateAnnouncementController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const announcementId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(announcementId) || announcementId <= 0) {
            res.status(400).json({ success: false, message: "Invalid announcement ID" });
            return;
        }

        const announcement = await updateAnnouncement(announcementId, userId, req.body);

        res.status(200).json({ success: true, message: "Announcement updated successfully", data: announcement });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update announcement" });
    }
};

export const deleteAnnouncementController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const announcementId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(announcementId) || announcementId <= 0) {
            res.status(400).json({ success: false, message: "Invalid announcement ID" });
            return;
        }

        const result = await deleteAnnouncement( announcementId, userId);

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to delete announcement" });
    }
};

export const getMyAnnouncementsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const announcements = await getMyAnnouncements(userId);

        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch announcements" });
    }
};

export const getAllAnnouncementsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const announcements = await getAllAnnouncements();

        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch announcements" });
    }
};

export const getAnnouncementByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const announcementId = Number(req.params.id);

        if (isNaN(announcementId) || announcementId <= 0) {
            res.status(400).json({ success: false, message: "Invalid announcement ID", });
            return;
        }

        const announcement = await getAnnouncementById(announcementId);

        res.status(200).json({ success: true, data: announcement });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch announcement" });
    }
};