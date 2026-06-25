import { Request, Response } from "express";
import { getStudentProfile, updateStudentProfile } from "../services/student.service.js";

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await getStudentProfile(req.user!.id);
        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message: "Student profile not found" });
    }
};

export const updateMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await updateStudentProfile(req.user!.id, req.body);

        res.status(200).json({ success: true, student, });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message: "Profile update failed", });
    }
};