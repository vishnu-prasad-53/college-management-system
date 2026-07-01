import { Request, Response } from "express";
import { getOverview, getStudentStatistics, getFacultyStatistics, getAttendanceStatistics, getMarksStatistics, getRecentActivity } from "../services/dashboard.service.js";

export const getOverviewController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const overview = await getOverview();

        res.status(200).json({ success: true, data: overview });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch overview" });
    }
};

export const getStudentStatisticsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const statistics = await getStudentStatistics();

        res.status(200).json({ success: true, data: statistics });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch student statistics" });
    }
};

export const getFacultyStatisticsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const statistics = await getFacultyStatistics();

        res.status(200).json({ success: true, data: statistics });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch faculty statistics" });
    }
};

export const getAttendanceStatisticsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const statistics = await getAttendanceStatistics();

        res.status(200).json({ success: true, data: statistics });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch attendance statistics" });
    }
};

export const getMarksStatisticsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const statistics = await getMarksStatistics();

        res.status(200).json({ success: true, data: statistics });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch marks statistics" });
    }
};

export const getRecentActivityController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const activity = await getRecentActivity();

        res.status(200).json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch recent activity" });
    }
};