import { Request, Response } from "express";
import { createLeaveSchema, updateLeaveStatusSchema } from "../validators/leave.validator.js"
import { createLeaveRequest, getMyLeaveRequests, getAllLeaveRequests, updateLeaveStatus, deleteLeaveRequest } from "../services/leave.service.js";

export const createLeaveRequestController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const validatedData = createLeaveSchema.parse(req.body);

const leave = await createLeaveRequest(userId, validatedData);

        res.status(201).json({ success: true, message: "Leave request submitted successfully", data: leave });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to create leave request" });
    }
};

export const getMyLeaveRequestsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const leaves = await getMyLeaveRequests(userId);

        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch leave requests" });
    }
};

export const getAllLeaveRequestsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const leaves = await getAllLeaveRequests();

        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch leave requests" });
    }
};

export const updateLeaveStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const leaveId = Number(req.params.id);

        if (isNaN(leaveId) || leaveId <= 0) {
            res.status(400).json({ success: false, message: "Invalid leave request ID" });
            return;
        }

        const validatedData = updateLeaveStatusSchema.parse(req.body);

const leave = await updateLeaveStatus(leaveId, validatedData);

        res.status(200).json({ success: true, message: "Leave request updated successfully", data: leave });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update leave request" });
    }
};

export const deleteLeaveRequestController = async (req: Request, res: Response): Promise<void> => {
    try {
        const leaveId = Number(req.params.id);

        if (isNaN(leaveId) || leaveId <= 0) {
            res.status(400).json({ success: false, message: "Invalid leave request ID" });
            return;
        }

        const result = await deleteLeaveRequest(leaveId);

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to delete leave request" });
    }
};