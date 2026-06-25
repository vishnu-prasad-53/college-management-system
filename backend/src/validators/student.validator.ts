import { z } from "zod";

export const updateStudentSchema = z.object({
    semester: z.number().int().min(1).max(8).optional(),
    cgpa: z.number().min(0).max(10).optional(),
});