import api from "../api/axios";
import type { Department, CreateDepartmentData, UpdateDepartmentData } from "../types/department.types";

export const getDepartments = async (): Promise<Department[]> => {
    const response = await api.get("/departments");
    return response.data.departments;
};

export const getDepartmentById = async (id: number): Promise<Department> => {
    const response = await api.get(`/departments/${id}`);
    return response.data.department;
};

export const createDepartment = async ( data: CreateDepartmentData): Promise<Department> => {
    const response = await api.post("/departments", data);
    return response.data.department;
};

export const updateDepartment = async (id: number, data: UpdateDepartmentData): Promise<Department> => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data.department;
};

export const deleteDepartment = async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
};