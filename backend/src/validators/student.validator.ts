import { z } from "zod";

export const createStudentSchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    departmentId: z.number().positive(),
    usn: z.string().min(5),
    semester: z.number().min(1).max(8),
    cgpa: z.number().min(0).max(10),
});

export const updateStudentSchema = z.object({
    semester: z.number().int().min(1).max(8).optional(),
    cgpa: z.number().min(0).max(10).optional(),
});