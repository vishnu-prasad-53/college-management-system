import { Request, Response } from "express";
import { submitAssignment, getMySubmissions, getAssignmentSubmissions, gradeSubmission, getAllSubmissions } from "../services/assignmentSubmission.service.js";

export const submitAssignmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const submission = await submitAssignment(userId, req.body);

        res.status(201).json({ success: true, message: "Assignment submitted successfully", data: submission });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to submit assignment" });
    }
};

export const getMySubmissionsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const submissions = await getMySubmissions(userId);

        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch submissions" });
    }
};

export const getAssignmentSubmissionsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const assignmentId = Number(req.params.assignmentId);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(assignmentId) || assignmentId <= 0) {
            res.status(400).json({ success: false, message: "Invalid assignment ID" });
            return;
        }

        const submissions = await getAssignmentSubmissions(assignmentId, userId);

        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch submissions" });
    }
};

export const gradeSubmissionController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const submissionId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(submissionId) || submissionId <= 0) {
            res.status(400).json({ success: false, message: "Invalid submission ID" });
            return;
        }

        const submission = await gradeSubmission(submissionId, userId, req.body);

        res.status(200).json({ success: true, message: "Submission graded successfully", data: submission });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to grade submission" });
    }
};

export const getAllSubmissionsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const submissions = await getAllSubmissions();

        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch submissions" });
    }
};