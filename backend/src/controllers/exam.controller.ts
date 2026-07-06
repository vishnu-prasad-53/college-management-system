import { Request, Response } from "express";
import { createExam, updateExam, deleteExam, getFacultyExams, getStudentExams, getAllExams } from "../services/exam.service.js";

export const createExamController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const exam = await createExam(userId, req.body);

        res.status(201).json({ success: true, message: "Exam created successfully", data: exam });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to create exam" });
    }
};

export const updateExamController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const examId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(examId) || examId <= 0) {
            res.status(400).json({ success: false, message: "Invalid exam ID" });
            return;
        }

        const exam = await updateExam(examId, userId, req.body);

        res.status(200).json({ success: true, message: "Exam updated successfully", data: exam });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update exam" });
    }
};

export const deleteExamController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const examId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(examId) || examId <= 0) {
            res.status(400).json({ success: false, message: "Invalid exam ID" });
            return;
        }

        const result = await deleteExam(examId, userId);

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to delete exam" });
    }
};

export const getFacultyExamsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const exams = await getFacultyExams(userId);

        res.status(200).json({ success: true, data: exams });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch exams" });
    }
};

export const getStudentExamsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const exams = await getStudentExams(userId);

        res.status(200).json({ success: true, data: exams });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch exams" });
    }
};

export const getAllExamsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const exams = await getAllExams();

        res.status(200).json({ success: true, data: exams });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch exams" });
    }
};