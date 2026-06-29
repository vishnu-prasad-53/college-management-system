import { Request, Response } from "express";
import { markAttendance, getMyAttendance, getAttendanceBySubject } from "../services/attendance.service.js";

export const markStudentAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        const attendance = await markAttendance(req.body.studentId, req.body.subjectId, req.body.date,req.body.status);

        res.status(201).json({ success: true, attendance });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message: "Failed to mark attendance" });
    }
};

export const getMyAttendanceRecords = async (req: Request, res: Response): Promise<void> => {
    try {
        const attendance = await getMyAttendance(req.user!.id);

        res.status(200).json({ success: true, attendance });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message: "Attendance not found" });
    }
};

export const getSubjectAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjectId = Number(req.params.subjectId);

        if (isNaN(subjectId)) {
            res.status(400).json({ success: false, message: "Invalid subject ID" });
            return;
        }

        const attendance = await getAttendanceBySubject(subjectId);

        res.status(200).json({ success: true, attendance });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message: "Attendance not found" });
    }
};