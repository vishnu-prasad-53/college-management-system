import { Request, Response } from "express";
import { enrollSubject, getMyEnrollments, dropEnrollment, getStudentsBySubject } from "../services/enrollment.service.js";

export const enroll = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollment = await enrollSubject(req.user!.id, req.body.subjectId);

        res.status(201).json({ success: true, enrollment });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Enrollment failed" });
    }
};

export const getMySubjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollments = await getMyEnrollments(req.user!.id);
        res.status(200).json({ success: true, enrollments });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Enrollments not found", });
    }
};

export const removeEnrollment = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjectId = Number(req.params.subjectId);

        if(isNaN(subjectId)) {
            res.status(400).json({ success: false, message: "Invalid subject ID" });
            return;
        }

        const result = await dropEnrollment(req.user!.id, subjectId);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to drop enrollment", });
    }
};

export const getStudents = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjectId = Number(req.params.subjectId);

        if(isNaN(subjectId)) {
            res.status(400).json({ success: false, message: "Invalid subject ID" });
            return;
        }

        const students = await getStudentsBySubject(subjectId);
        res.status(200).json({ success: true, students });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Students not found" });
    }
};