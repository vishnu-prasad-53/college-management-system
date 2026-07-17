import { z } from "zod";

export const createDepartmentSchema = z.object({
    name: z.string().min(2, "Department name must be at least 2 characters").max(100, "Department name must be less than 100 characters"),
    code: z.string().min(2, "Department code must be at least 2 characters").max(10, "Department code must be less than 10 characters").transform((value) => value.toUpperCase()),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();