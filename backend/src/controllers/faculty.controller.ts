import { Request, Response } from "express";
import { getFacultyProfile, updateFacultyProfile } from "../services/faculty.service.js";

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const faculty = await getFacultyProfile(req.user!.id);
        res.status(200).json({ success: true, faculty });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message: "Faculty profile not found" });
    }
};

export const updateMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const faculty = await updateFacultyProfile(req.user!.id, req.body);
        res.status(200).json({ success: true, faculty });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message: "Profile update failed" });
    }
}