import { Request, Response } from "express";
import { createNotice, updateNotice, deleteNotice, getAllNoticesForAdmin, getActiveNotices } from "../services/notice.service.js";

export const createNoticeController = async (req: Request, res: Response): Promise<void> => {
    try {
        const notice = await createNotice(req.body);

        res.status(201).json({ success: true, message: "Notice created successfully", data: notice });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to create notice" });
    }
};

export const updateNoticeController = async (req: Request, res: Response): Promise<void> => {
    try {
        const noticeId = Number(req.params.id);

        if (isNaN(noticeId) || noticeId <= 0) {
            res.status(400).json({ success: false, message: "Invalid notice ID" });
            return;
        }

        const notice = await updateNotice(noticeId, req.body);

        res.status(200).json({ success: true, message: "Notice updated successfully", data: notice });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update notice" });
    }
};

export const deleteNoticeController = async (req: Request, res: Response): Promise<void> => {
    try {
        const noticeId = Number(req.params.id);

        if (isNaN(noticeId) || noticeId <= 0) {
            res.status(400).json({ success: false, message: "Invalid notice ID" });
            return;
        }

        const result = await deleteNotice(noticeId);

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to delete notice" });
    }
};

export const getAllNoticesForAdminController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const notices = await getAllNoticesForAdmin();

        res.status(200).json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch notices" });
    }
};

export const getActiveNoticesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const role = req.user?.role;

        if (role !== "student" && role !== "faculty") {
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }

        const notices = await getActiveNotices(role);

        res.status(200).json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch notices" });
    }
};