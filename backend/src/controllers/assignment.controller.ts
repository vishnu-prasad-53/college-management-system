import { Request, Response } from "express";
import { createAssignment, updateAssignment, deleteAssignment, getFacultyAssignments, getStudentAssignments, getAllAssignments } from "../services/assignment.service.js";

export const createAssignmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const assignment = await createAssignment(userId, req.body);

        res.status(201).json({ success: true, message: "Assignment created successfully", data: assignment });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to create assignment" });
    }
};

export const updateAssignmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const assignmentId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(assignmentId) || assignmentId <= 0) {
            res.status(400).json({ success: false, message: "Invalid assignment ID" });
            return;
        }

        const assignment = await updateAssignment(assignmentId, userId, req.body);

        res.status(200).json({ success: true, message: "Assignment updated successfully", data: assignment });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update assignment" });
    }
};

export const deleteAssignmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const assignmentId = Number(req.params.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(assignmentId) || assignmentId <= 0) {
            res.status(400).json({ success: false, message: "Invalid assignment ID" });
            return;
        }

        const result = await deleteAssignment(assignmentId, userId);

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to delete assignment" });
    }
};

export const getFacultyAssignmentsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const assignments = await getFacultyAssignments(userId);

        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch assignments" });
    }
};

export const getStudentAssignmentsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const assignments = await getStudentAssignments(userId);

        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch assignments" });
    }
};

export const getAllAssignmentsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const assignments = await getAllAssignments();

        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch assignments" });
    }
};