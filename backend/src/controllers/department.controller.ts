import { Request, Response } from "express";
import { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } from "../services/department.service.js";

export const getDepartments = async (_req: Request, res: Response): Promise<void> => {
    try {
        const departments = await getAllDepartments();

        res.status(200).json({ success: true, departments, });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch departments" });
    }
};

export const getDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const department = await getDepartmentById(id);

        res.status(200).json({ success: true, department });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Department not found" });
    }
};

export const createDepartmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const department = await createDepartment(req.body);

        res.status(201).json({ success: true, department });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Department creation failed" });
    }
};

export const updateDepartmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        const department = await updateDepartment(id, req.body);

        res.status(200).json({ success: true, department });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Department update failed" });
    }
};

export const deleteDepartmentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        await deleteDepartment(id);

        res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Department deletion failed" });
    }
};