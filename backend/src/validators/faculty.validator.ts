import { z } from "zod";

export const updateFacultySchema = z.object({
    designation: z.string().min(3).max(50).optional(),
});