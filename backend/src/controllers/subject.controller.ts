import { Request, Response } from "express";
import { getAllSubjects, getSubjectById } from "../services/subject.service.js";

export const getSubjects = async (_req: Request, res: Response): Promise<void> => {
    try {
        const subjects = await getAllSubjects();
        res.status(200).json({ success: true, subjects });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Subjects not found" });
    }
};

export const getSubject = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid subject ID" });
            return;
        }

        const subject = await getSubjectById(id);
        res.status(200).json({ success: true, subject });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Subjects not found" });
    }
};