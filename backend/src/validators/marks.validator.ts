import { z } from "zod";

export const marksSchema = z.object({
    studentId: z.number().int().positive(),
    subjectId: z.number().int().positive(),
    internalMarks: z.number().min(0).max(40),
    externalMarks: z.number().min(0).max(60),
});