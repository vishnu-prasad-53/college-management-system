import { db, departments } from "../db/index.js";
import { eq } from "drizzle-orm";

export const getAllDepartments = async () => {
    return await db.select().from(departments);
};

export const getDepartmentById = async (id: number) => {
    const department = await db.query.departments.findFirst({
        where: eq(departments.id, id),
    });

    if (!department) {
        throw new Error("Department not found");
    }

    return department;
};

export const createDepartment = async (data: {
    name: string;
    code: string;
}) => {
    const existingDepartment = await db.query.departments.findFirst({
        where: eq(departments.code, data.code),
    });

    if (existingDepartment) {
        throw new Error("Department code already exists");
    }

    const createdDepartment = await db.insert(departments).values({
        name: data.name,
        code: data.code,
    }).returning();

    return createdDepartment[0];
};

export const updateDepartment = async (
    id: number,
    data: {
        name?: string;
        code?: string;
    }
) => {
    const department = await db.query.departments.findFirst({
        where: eq(departments.id, id),
    });

    if (!department) {
        throw new Error("Department not found");
    }

    await db.update(departments).set({
        ...data,
        updatedAt: new Date(),
    }).where(eq(departments.id, id));

    return getDepartmentById(id);
};

export const deleteDepartment = async (id: number) => {
    const department = await db.query.departments.findFirst({
        where: eq(departments.id, id),
    });

    if (!department) {
        throw new Error("Department not found");
    }

    await db.delete(departments).where(eq(departments.id, id));
};