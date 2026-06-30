import { Request, Response } from "express";
import { addMarks, getMyMarks, getMarksBySubject } from "../services/marks.service.js";

export const createMarksController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId, subjectId, internalMarks, externalMarks } = req.body;

        const marks = await addMarks(
            Number(studentId),
            Number(subjectId),
            Number(internalMarks),
            Number(externalMarks)
        );

        res.status(201).json({ success: true, message: "Marks added successfully", data: marks });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to add marks" });
    }
};

export const getMyMarksController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const marks = await getMyMarks(userId);

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Marks not found" });
    }
};

export const getMarksBySubjectController = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjectId = Number(req.params.subjectId);

        if (isNaN(subjectId) || subjectId <= 0) {
            res.status(400).json({ success: false, message: "Invalid subject ID" });
            return;
        }

        const marks = await getMarksBySubject(subjectId);

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Marks not found" });
    }
};