import { Request, Response } from "express";
import { createStudent, deleteStudent, getAllStudents, getStudentById, getStudentProfile, updateStudent, updateStudentProfile } from "../services/student.service.js";

export const getStudents = async (_req: Request, res: Response): Promise<void> => {
    try {
        const students = await getAllStudents();

        res.status(200).json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch students" });
    }
};

export const getStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await getStudentById(Number(req.params.id));

        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Student not found" });
    }
};

export const createStudentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await createStudent(req.body);

        res.status(201).json({ success: true, student });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Student creation failed" });
    }
};

export const updateStudentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await updateStudent(Number(req.params.id), req.body);

        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Student update failed" });
    }
};

export const deleteStudentController = async (req: Request, res: Response): Promise<void> => {
    try {
        await deleteStudent(Number(req.params.id));

        res.status(200).json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Delete failed" });
    }
};

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