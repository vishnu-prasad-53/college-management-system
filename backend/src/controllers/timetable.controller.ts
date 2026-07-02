import { Request, Response } from "express";
import { createTimetable, updateTimetable, deleteTimetable, getStudentTimetable, getFacultyTimetable, getDepartmentTimetable } from "../services/timetable.service.js";

export const createTimetableController = async (req: Request,res: Response): Promise<void> => {
    try {
        const timetable = await createTimetable(req.body);

        res.status(201).json({ success: true, message: "Timetable created successfully", data: timetable });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message: "Failed to create timetable" });
    }
};

export const updateTimetableController = async (req: Request, res: Response): Promise<void> => {
    try {
        const timetableId = Number(req.params.id);

        if (isNaN(timetableId) || timetableId <= 0) {
            res.status(400).json({ success: false, message: "Invalid timetable ID" });
            return;
        }

        const timetable = await updateTimetable(timetableId, req.body);

        res.status(200).json({ success: true, message: "Timetable updated successfully", data: timetable });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update timetable" });
    }
};

export const deleteTimetableController = async (req: Request, res: Response): Promise<void> => {
    try {
        const timetableId = Number(req.params.id);

        if (isNaN(timetableId) || timetableId <= 0) {
            res.status(400).json({ success: false, message: "Invalid timetable ID" });
            return;
        }

        const result = await deleteTimetable(timetableId);

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to delete timetable" });
    }
};

export const getStudentTimetableController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const timetable = await getStudentTimetable(userId);

        res.status(200).json({ success: true, data: timetable });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch timetable" });
    }
};

export const getFacultyTimetableController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const timetable = await getFacultyTimetable(userId);

        res.status(200).json({ success: true, data: timetable,
        });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch timetable" });
    }
};

export const getDepartmentTimetableController = async (req: Request, res: Response): Promise<void> => {
    try {
        const departmentId = Number(req.params.departmentId);
        const semester = Number(req.params.semester);

        if (isNaN(departmentId) || departmentId <= 0 || isNaN(semester) || semester < 1 || semester > 8) {
            res.status(400).json({ success: false, message: "Invalid department ID or semester" });
            return;
        }

        const timetable = await getDepartmentTimetable(
            departmentId,
            semester
        );

        res.status(200).json({ success: true, data: timetable });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch timetable" });
    }
};