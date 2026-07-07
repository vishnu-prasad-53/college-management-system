import { Request, Response } from "express";

import { publishResult, updateResult, deleteResult, getStudentResults, getFacultyResults, getAllResults } from "../services/result.service.js";

export const publishResultController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const result = await publishResult(userId, req.body);

        res.status(201).json({ success: true, message: "Result published successfully", data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to publish result" });
    }
};

export const updateResultController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const resultId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(resultId) || resultId <= 0) {
            res.status(400).json({ success: false, message: "Invalid result ID" });
            return;
        }

        const result = await updateResult(resultId, userId, req.body);

        res.status(200).json({ success: true, message: "Result updated successfully", data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update result" });
    }
};

export const deleteResultController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const resultId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(resultId) || resultId <= 0) {
            res.status(400).json({ success: false, message: "Invalid result ID" });
            return;
        }

        const response = await deleteResult(resultId, userId);

        res.status(200).json({ success: true, message: response.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to delete result" });
    }
};

export const getStudentResultsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const results = await getStudentResults(userId);

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch results" });
    }
};

export const getFacultyResultsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const results = await getFacultyResults(userId);

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch results" });
    }
};

export const getAllResultsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const results = await getAllResults();

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch results" });
    }
};